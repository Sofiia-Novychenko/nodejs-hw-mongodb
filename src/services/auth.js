import { UsersModel } from '../bd/models/user';
import createHttpError from 'http-errors';

export const registerUser = async (payload) => {
  const user = await UsersModel.findOne({ email: payload.email });

  //* переверка на те чи є юзер з такою поштою в нашій системі:
  //* це н мідедвара тому помилка кидається через throw
  if (user !== null) {
    throw createHttpError(409, 'Email in use');
  }

  return await UsersModel.create(payload);
};
