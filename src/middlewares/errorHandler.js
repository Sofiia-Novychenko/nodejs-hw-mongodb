import { HttpError } from 'http-errors';

export const errorHandler = (error, req, resp, next) => {
  if (error instanceof HttpError) {
    resp.status(error.status).json({
      status: error.status,
      message: error.name,
      data: error,
    });
    return;
  }
  resp.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: error.message,
  });
};
