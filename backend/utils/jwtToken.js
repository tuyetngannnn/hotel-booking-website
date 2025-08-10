export const generateToken = (user, message, statusCode, res) => {
    const token = user.generateJsonWebToken(); // Đảm bảo user có phương thức này
    const cookieName = user.role === "Quản lý" ? "adminToken" : "khachhangToken";
    res.status(statusCode).cookie(cookieName, token, {
        expires: new Date(Date.now() + process.env.COKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
    }).json({
        success: true,
        message,
        user,
        token,
    });
};
