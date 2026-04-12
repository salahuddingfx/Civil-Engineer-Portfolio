function notFound(req, res) {
  res.status(404).json({ message: "Route not found" });
}

function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 409;
    message = "CONTRADICTION_ERROR: DATA_RECORD_EXISTS (Duplicate ID)";
  }

  res.status(statusCode).json({
    message,
    details: err.details || null,
  });
}

module.exports = { notFound, errorHandler };
