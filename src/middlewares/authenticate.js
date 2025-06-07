import createHttpError from 'http-errors';
import { Session } from '../bd/models/session.js';
import { User } from '../bd/models/user.js';

export const authenticate = async (req, resp, next) => {
  //* отрумуємо отримує заголовок авторизації
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    return next(createHttpError(401, 'Please provide Authorization header'));
  }

  //* Функція розділяє заголовок авторизації на дві частини: тип (повинен бути "Bearer") і сам токен.
  const bearer = authHeader.split(' ')[0];
  const token = authHeader.split(' ')[1];

  if (bearer !== 'Bearer' || !token) {
    return next(createHttpError(401, 'Auth header should be of type Bearer'));
  }
  const session = await Session.findOne({ accessToken: token });

  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }

  const isAccesTokeExpired =
    new Date() > new Date(session.accessTokenValidUntil);

  if (isAccesTokeExpired) {
    return next(createHttpError(401, 'Access token expired'));
  }
  const user = await User.findById(session.userId);

  if (!user) {
    return next(createHttpError(401));
  }

  //! функція додає об'єкт користувача до запиту
  req.user = { _id: user._id, name: user.name, email: user.email };

  next();
};
