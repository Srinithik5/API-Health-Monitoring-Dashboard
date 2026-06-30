/**
 * Catches any request that doesn't match a defined route.
 * Register this AFTER all routes but BEFORE the error handler.
 */
function notFound(req, res, next) {
  res.status(404).json({
    status: "error",
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

module.exports = notFound;