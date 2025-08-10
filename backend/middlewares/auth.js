import User from "../models/user.model.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";

// Middleware xác thực Admin
export const isAdminAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies.adminToken; // Lấy token từ cookie
    console.log("Token:", token);
    if (!token) {
        return next(new ErrorHandler("Admin not Authenticated!", 401)); // Sử dụng mã trạng thái 401 cho không xác thực
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Giải mã token
    req.user = await User.findById(decoded.id); // Lấy thông tin người dùng từ cơ sở dữ liệu

    if (!req.user) {
        return next(new ErrorHandler("User not found!", 404)); // Kiểm tra nếu người dùng không tồn tại
    }

    if (req.user.role !== "Quản lý") {
        return next(new ErrorHandler(`${req.user.role} not authorized for this resource!`, 403)); // Kiểm tra quyền truy cập
    }

    next(); // Gọi next nếu mọi thứ ổn
});

// Middleware xác thực Khách hàng
export const isPatientAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies.khachhangToken; // Lấy token từ cookie
    console.log("Token:", token);
    if (!token) {
        return next(new ErrorHandler("Khach hang not Authenticated!", 401)); // Sử dụng mã trạng thái 401 cho không xác thực
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Giải mã token
    req.user = await User.findById(decoded.id); // Lấy thông tin người dùng từ cơ sở dữ liệu

    if (!req.user) {
        return next(new ErrorHandler("User not found!", 404)); // Kiểm tra nếu người dùng không tồn tại
    }

    if (req.user.role !== "Khách hàng") {
        return next(new ErrorHandler(`${req.user.role} not authorized for this resource!`, 403)); // Kiểm tra quyền truy cập
    }

    next(); // Gọi next nếu mọi thứ ổn
});
