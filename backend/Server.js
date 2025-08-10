// const jwt = require('jsonwebtoken'); // Sửa tên module

// function authenticateToken(req, res, next) {
//     const authHeader = req.headers["authorization"];
//     const token = authHeader && authHeader.split(" ")[1]; // Sửa split

//     if (!token) return res.sendStatus(401);

//     jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
//         if (err) return res.sendStatus(401);
//         req.user = user;
//         next();
//     });
// }

// module.exports = {
//     authenticateToken,
// };


// import app from "./index.js"
// import cloudinary from "cloudinary"

// cloudinary.v2.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// })
// // app.listen(process.env.PORT,() => {
// //     console.log(Server listening on port ${process.env.PORT})
// // });