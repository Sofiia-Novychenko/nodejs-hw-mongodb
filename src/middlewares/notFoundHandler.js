export const notFoundHandler = (req, resp, next) => {
  resp.status(404).json({
    message: 'Route not found',
  });
};
