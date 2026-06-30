/**
 * Centralized error handler. Keep this as the LAST middleware
 * registered in app.js so it catches errors from all routes.
 */
function errorHandler(err, req, res, next) {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
}

module.exports = errorHandler;