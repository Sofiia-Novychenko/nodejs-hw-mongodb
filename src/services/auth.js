import fs from 'node:fs/promises';
import path from 'node:path';
import { User } from '../bd/models/user.js';
import { Session } from '../bd/models/session.js';
import { randomBytes } from 'crypto';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import {
  THIRTY_DAYS,
  FIFEEN_MINUTES,
  TEMPLATES_DIR,
} from '../constants/index.js';
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendEmail } from '../utils/sendMail.js';

// //! синхронно зчитуємо файл
// const RESET_PASSWORD_TEMPLATE = fs.readFileSync(
//   path.resolve('templates', 'reset-password-email.hbs', 'utf-8'),
// );

// console.log('RESET_PASSWORD_TEMPLATE is :', RESET_PASSWORD_TEMPLATE);

export const registerUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });

  //* переверка на те чи є юзер з такою поштою в нашій системі:
  //* це не мідедвара тому помилка кидається через throw
  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  payload.password = await bcrypt.hash(payload.password, 10);

  return await User.create(payload);
};

export const loginUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });

  if (user === null) {
    throw createHttpError(401, 'Email or password is incorrect');
  }

  //* Порівнюємо хеші паролів
  const isEqual = await bcrypt.compare(payload.password, user.password);

  if (!isEqual) {
    throw createHttpError(401, 'Email or password is incorrect');
  }

  //! функція видаляє попередню сесію користувача, якщо така існує, з колекції сесій.
  //* Це робиться для уникнення конфліктів з новою сесією.
  await Session.deleteOne({ userId: user._id });

  //! генеруються нові токени доступу та оновлення.
  //* Використовуються випадкові байти, які конвертуються в строку формату base64.
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });
};

export const logoutUser = async (sessionId) => {
  await Session.deleteOne({ _id: sessionId });
};

export const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
};

export const refreshUserSession = async ({ sessionId, refreshToken }) => {
  const session = await Session.findOne({ _id: sessionId, refreshToken });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = createSession();

  await Session.deleteOne({ _id: sessionId, refreshToken });

  return await Session.create({
    userId: session.userId,
    ...newSession,
  });
};

export const requestResetToken = async (email) => {
  const user = await User.findOne({ email: email });

  console.log('Email in services:', email);
  console.log('User in services: ', user);

  if (user === null) {
    throw createHttpError(404, 'User not found');
  }

  //! створюємо токенскидання пароля
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVar('JWT_SECRET'),
    { expiresIn: '15m' },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.hbs',
  );
  const templateSource = await fs
    .readFile(resetPasswordTemplatePath)
    .toString();

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${getEnvVar('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  //! надсилаєм лист користувачу з посиланням на скид пароля і створеним токеном
  await sendEmail({
    from: getEnvVar('SMTP_FROM'),
    to: email,
    subject: 'Reset your password',
    html,
  });
};
