import { HttpError } from 'http-errors';

export const errorHandler = (err, req, resp, next) => {
  console.log('ErrorHandler', err);

  if (err instanceof HttpError) {
    resp.status(err.status).json({
      status: err.status,
      message: err.name,
      data: err,
    });
    return;
  }
  // ловимо помилки типу CastError (наприклад, некоректний ObjectId)
  if (err.name === 'CastError') {
    resp.status(400).json({
      status: 400,
      message: 'Invalid ContactId format, a 24-character hex string needed',
      data: err.message,
    });
  }

  resp.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: err.message,
  });
};
