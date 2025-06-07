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

export const sendResetToken = async (email) => {
  const user = await User.findOne({ email: email });

  if (user === null) {
    throw createHttpError(404, 'User not found');
  }

  //! створюємо токен скидання пароля
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVar('JWT_SECRET'),
    { expiresIn: '5m' },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.hbs',
  );
  const buffer = await fs.readFile(resetPasswordTemplatePath);
  const templateSource = buffer.toString();

  const template = handlebars.compile(templateSource);

  const html = template({
    name: user.name,
    link: `${getEnvVar('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  //! надсилаєм лист користувачу з посиланням на скид пароля і створеним токеном
  const mailResult = await sendEmail({
    from: getEnvVar('SMTP_FROM'),
    to: email,
    subject: 'Reset your password',
    html,
  });

  if (!mailResult.accepted || mailResult.accepted.length === 0) {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
  } catch (error) {
    if (error instanceof Error) throw createHttpError(401, error.message);
    throw error;
  }

  const user = await User.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (user === null) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await User.updateOne({ _id: user._id }, { password: encryptedPassword });
};
