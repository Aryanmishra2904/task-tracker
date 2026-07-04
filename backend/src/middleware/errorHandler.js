const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Mongoose "CastError" -> invalid ObjectId format
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Invalid value for field "${err.path}"`,
    });
  }

  // Mongoose validation error (schema-level)
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  const statusCode =
    err.statusCode && err.statusCode >= 400
      ? err.statusCode
      : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
  });
};

/**
 * 404 handler for any route that doesn't match a defined endpoint.
 */
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

export { errorHandler, notFound };