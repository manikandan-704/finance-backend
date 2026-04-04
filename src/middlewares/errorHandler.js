const errorHandler = (err, req, res, next) => {
  console.error(err.stack); 

  // Mongoose bad ObjectId error 
  if (err.name === "CastError") {
    return res
      .status(404)
      .json({ success: false, message: "Resource not found" });
  }

  // Mongoose duplicate key error  
  if (err.code === 11000) {
    return res
      .status(400)
      .json({ success: false, message: "Duplicate field value entered" });
  }

  // Default to 500 server error
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    // Only show the stack trace if we are in development mode
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = errorHandler;
