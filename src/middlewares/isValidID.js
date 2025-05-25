import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

//* в міделварі краще використовувати return next(createHttpError.[Тип]('Повідомлення'))
//* замість throw, бо Express очікує, що помилки передаватимуться через next(err)

export const IsValidID = (req, resp, next) => {
  const { contactId } = req.params;
  if (isValidObjectId(contactId) !== true) {
    return next(createHttpError.BadRequest('Id should be an ObjectId'));
  }
  next();
};
