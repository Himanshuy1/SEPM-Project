const notFound = (req, res, _next) => {
  res.status(404);
  throw new Error(`Route not found: ${req.originalUrl}`);
};

const errorHandler = (err, req, res, _next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    path: req.originalUrl,
  });
};

module.exports = {
  notFound,
  errorHandler,
};
