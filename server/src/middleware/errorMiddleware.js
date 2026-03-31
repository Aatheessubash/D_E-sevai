import multer from "multer";

export const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => {
  const isUploadValidationError =
    err.message?.includes("Unsupported file type") || err.message?.includes("Please upload");
  const statusCode =
    res.statusCode && res.statusCode !== 200 ? res.statusCode : isUploadValidationError ? 400 : 500;

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      message: err.code === "LIMIT_FILE_SIZE" ? "File size exceeds 10MB." : err.message,
      stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    });
  }

  return res.status(statusCode).json({
    message: err.message || "Server error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
