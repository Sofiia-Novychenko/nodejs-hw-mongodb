import {
  loginUser,
  logoutUser,
  refreshUserSession,
  registerUser,
} from '../services/auth.js';
import { THIRTY_DAYS } from '../constants/index.js';

export const registerUserController = async (req, resp) => {
  const user = await registerUser(req.body);

  resp.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const loginUserController = async (req, resp) => {
  const session = await loginUser(req.body);
  //* повертає об'єкт сесії

  //* встановлюємо два кукі: refreshToken і sessionId методом resp.cookie
  // вони обидва мають термін дії і є http-only cookie,
  // тобто вони доступніли лише через HTTP-запит,
  // без запиту JS зі сторони клієнта
  resp.cookie('refreshToken', session.refreshToken, {
    //! забороняє доступ до сookies через клієнтський JS
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
  resp.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });

  resp.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutUserController = async (req, resp) => {
  //* перевірка, чи існує кукі sessionId у запиті
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  resp.clearCookie('sessionId');
  resp.clearCookie('refreshToken');

  resp.status(204).end();
};

const setupSession = (resp, session) => {
  resp.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });

  resp.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
};

export const refreshUserSessionController = async (req, resp) => {
  const session = await refreshUserSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });
  //* повертає об'єкт нової сесії.

  setupSession(resp, session);

  resp.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
