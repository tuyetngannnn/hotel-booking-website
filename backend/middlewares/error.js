class ErrorHandler extends Error {
  constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  // Thiết lập giá trị mặc định cho thông điệp lỗi và mã trạng thái
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  // Xử lý lỗi trùng lặp
  if (err.code === 11000) {
      const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
      err = new ErrorHandler(message, 400);
  }

  // Xử lý lỗi Json Web Token không hợp lệ
  if (err.name === "JsonWebTokenError") {
      const message = `Json Web Token is invalid, Try again!`;
      err = new ErrorHandler(message, 400);
  }

  // Xử lý lỗi Json Web Token đã hết hạn
  if (err.name === "TokenExpiredError") {
      const message = `Json Web Token is expired, Try again!`;
      err = new ErrorHandler(message, 400);
  }

  // Xử lý lỗi cast không hợp lệ
  if (err.name === "CastError") {
      const message = `Invalid ${err.path}`;
      err = new ErrorHandler(message, 400);
  }

  // Xử lý lỗi từ Mongoose
  const errorMessage = err.errors
      ? Object.values(err.errors)
          .map((error) => error.message)
          .join(" ")
      : err.message;

  // Trả về phản hồi lỗi
  return res.status(err.statusCode).json({
      success: false,
      message: errorMessage,
  });
};

// middlewares/asyncHandler.js
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// export default asyncHandler;


export default ErrorHandler;
