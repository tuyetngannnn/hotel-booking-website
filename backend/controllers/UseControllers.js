import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
 //import UserService from "../services/UserService.js";
import User from "../models/user.model.js";
import { generateToken } from "../utils/jwtToken.js";
import jwt from "jsonwebtoken";
import Branch from "../models/chinhanh.js";
import crypto from "crypto";
import bcryptjs from "bcryptjs"; // Correct import
import {sendPasswordResetEmail,sendResetSuccessEmail} from "../mailtrap/emails.js"
import { debug } from "console";
import { use } from "framer-motion/client";


//Tạo tài khoản
export const createUser = catchAsyncErrors(async(req,res,next)=>{
    const{ name, email, phone, password } = req.body;
    if( !name ||
        !email ||
        !phone || 
        !password 
        ){
            return next(new ErrorHandler("Vui lòng nhập đủ thông tin", 400))
        }
        // if(password != confirmpassword){
        //     return next(new ErrorHandler("Confirm password do not match", 400))
        // }
        let user = await User.findOne({ email })
        if(user){
            return next(new ErrorHandler("Người dùng đã tạo tài khoản", 400))
        }
        user = await User.create({name, email, phone, password, role: "Khách hàng"});
    generateToken(user, "user registered",200,res)
   
});


//Đăng nhập khách hàng
// export const login = catchAsyncErrors(async (req, res, next) => {
//     const { email, password } = req.body; // Chỉ cần email và password
//     if (!email || !password) {
//         return next(new ErrorHandler("Vui lòng nhập đủ thông tin!", 400));
//     }
    
//     // Tìm user trong database bằng email
//     const user = await User.findOne({ email }).select("+password");
//     // .select("+password");
//     if (!user) {
//         return next(new ErrorHandler("User Not Exist", 400));
//     }

//     // So sánh mật khẩu

//     console.log(password);
//     const newHashedPassword = await bcryptjs.hash(password, 10);
//     console.log("hashed pass: " + newHashedPassword);
//     console.log("user pass: " + user.password);


//     const isPasswordMatched = await bcryptjs.compare(password, user.password);
//     if (!isPasswordMatched) {
//         return next(new ErrorHandler("Invalid Password or Email", 400));
//     }

//     //generateTokenAndSetCookie(res, user._id);

// 		user.lastLogin = new Date();
//     // Kiểm tra role
//     const userRole = user.role; // Lấy role của user từ database

//     // Lưu thông tin user vào session
//     req.session.user = {
//         id: user._id,
//         email: user.email,
//         role: user.role,
//     };
//     req.session.isAuth = true;
//     req.session.name = user.name;

//     // In ra thông tin session sau khi lưu
//     console.log("Session lưu sau đăng nhập:", req.session);

//     // Sử dụng JWT để tạo token và trả về response
//     generateToken(user, "Đăng nhập thành công", 200, res);

   
// });

export const login = catchAsyncErrors(async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return next(new ErrorHandler("Vui lòng nhập đủ thông tin!", 400));
	}

	// Find user and ensure password is selected
	const user = await User.findOne({ email }).select("+password");

	if (!user) {
		return next(new ErrorHandler("User Not Exist", 400));
	}

	// Debug: Log the entered password and stored hashed password
	console.log("Entered password:", password);
	console.log("Email: " + user.email);

	// Compare passwords
	const isPasswordMatched = await bcryptjs.compare(password, user.password);
	console.log("Password matched:", isPasswordMatched);
    console.log("Stored hashed password:", user.password);  // In ra mật khẩu đã hash trong DB
    console.log("Entered password:", password); 
    // user = nguyenthivina0511@gmail.com
   // if(!isPasswordMatched && user.email != "nguyenthivina0511@gmail.com") {


	if (!isPasswordMatched) {
		return next(new ErrorHandler("Invalid Password or Email", 400));
	}

	// generateTokenAndSetCookie(res, user._id);

	// Proceed with login (session setup, etc.)
	req.session.user = { id: user._id, email: user.email, role: user.role };
	req.session.isAuth = true;
	req.session.name = user.name;

	console.log("Session after login:", req.session);

	generateToken(user, "Đăng nhập thành công", 200, res);
});


//Đăng nhập quản lý , lễ tân
export const loginAdmin = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body; // Chỉ cần email và password
    if (!email || !password) {
        return next(new ErrorHandler("Vui lòng nhập đủ thông tin!", 400));
    }
    
    // Tìm user trong database bằng email
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Email hoặc mật khẩu không hợp lệ", 400));
    }

    // So sánh mật khẩu
    const isPasswordMatched = await bcryptjs.compare(password, user.password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Email hoặc mật khẩu không hợp lệ", 400));
    }

    // Kiểm tra vai trò
    const userRole = user.role; // Lấy role của user từ database
    if (!["Quản lý", "Lễ tân"].includes(userRole)) {
        return next(new ErrorHandler("Bạn không có quyền truy cập!", 403));
    }

    // Lưu thông tin user vào session
    req.session.user = {
        id: user._id,
        email: user.email,
        role: user.role,
    };
    req.session.isAuth = true;
    req.session.name = user.name;

    // In ra thông tin session sau khi lưu
    console.log("Session lưu sau đăng nhập:", req.session);

    // Sử dụng JWT để tạo token và trả về response
    generateToken(user, "Đăng nhập thành công", 200, res);
});


//Thêm admin
export const addNewAdmin = catchAsyncErrors(async(req,res,next) => {
    console.log(req.body);
    const{ name, email, phone, password } = req.body;
    if( !name ||
        !email ||
        !phone ||
        !password ){
            return next(new ErrorHandler("Vui lòng điền đủ thông tin", 400))
        }
const isRegistered = await User.findOne({email});
if(isRegistered){
    return next(new ErrorHandler(`${isRegistered.role} with this email already exists!`, 400));
}
const admin = await User.create({name, email, phone, password,role: "Quản lý",});
res.status(200).json ({
    success: true,
    message:"Tạo tài khoản admin mới thành công!",
})
});

export const getAllLeTan = catchAsyncErrors(async(req,res,next) =>{
    const doctors = await User.find({role:"Lễ Tân"});
    res.status(200).json({
        success: true,
        doctors,
    });
});

export const getUserDetails = catchAsyncErrors(async(req, res,next)=>{
    const user = req.user;
    res.status(200).json({
        success:true,
        user,
    })
});
// export const logoutAdmin = catchAsyncErrors(async (req,res,next) => {
    
//     res.status(200).cookie("adminToken", " ",{
//         httpOnly: true,
//         expires: new Date(Date.now()),
//     }).json({
//         success: true,
//         message:"Admin Log Out Successfully!",
//     })
// });

//Đăng xuất admin
export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
    const user = req.session.user;
    console.log("User session on logout attempt:", user); // Log phiên người dùng để kiểm tra

    // if (!req.user || !["Quản lý", "Lễ tân"].includes(user.role)) {
    //     console.log("Người dùng không có quyền hoặc thông tin phiên thiếu.");
    //     return next(new ErrorHandler("Bạn không có quyền để đăng xuất!", 403));
    // }

    req.session.destroy((err) => {
        if (err) {
            console.error("Không thể xóa phiên:", err);
            return next(new ErrorHandler("Không thể đăng xuất. Thử lại sau!", 500));
        }

        res.clearCookie("connect.sid", { path: "/" });
        res.status(200).json({
            success: true,
            message: "Đăng xuất thành công",
        });
    });
});


//Đăng xuất
export const logout = catchAsyncErrors(async (req, res, next) => {
    // Xóa thông tin session của người dùng
    
    req.session.destroy((err) => {
        if (err) {
            return next(new ErrorHandler("Không thể đăng xuất. Thử lại sau!", 500));
        }
        
        res.clearCookie("connect.sid", { path: "/" }); // Xóa cookie session nếu cần thiết
        
        // Gửi phản hồi xác nhận đăng xuất thành công
        res.status(200).json({
            success: true,
            message: "Đăng xuất thành công",
        });
    });
});

//tạo tài khoản lễ tân
export const createReceptionist = async (req, res, next) => { // Thêm next vào tham số
    try {
        const { name, email, phone, password, branch } = req.body;
        
        // Kiểm tra nếu thiếu thông tin
        if (!name || !email || !phone || !password || !branch ) {
            return res.status(400).json({ message: "Vui lòng điền đủ thông tin" });
        }

        // Tìm chi nhánh theo ID
        const branchData = await Branch.findById(branch); // Sửa từ Branch sang branch
        if (!branchData) {
            return res.status(404).json({ message: "Branch not found" });
        }

        // Tạo tài khoản lễ tân (trong User model)
        const user = await User.create({ // Sửa từ letan sang receptionist
            name,
            email,
            phone,
            password,
            branch: branchData._id, // Lưu ID chi nhánh
            role: "Lễ tân" // Thiết lập role là "Lễ tân"
        });
        res.status(201).json ({
            success: true,
            message:"Tạo tài khoản lễ tân mới thành công!",
            user:user
        })
    } catch (error) {
        console.error("Error creating lễ tân:", error);
        next(error); // Gọi next để chuyển lỗi cho middleware xử lý lỗi
    }
};
 
//Sửa tài khoản nhân viên
export const updateReceptionist = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, email, phone, password, branch } = req.body;

        // Input validation
        if (!name || !email || !phone || !branch) {
            return res.status(400).json({ message: "Vui lòng điền đủ thông tin" });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "Tài khoản lễ tân không tồn tại" });
        }

        const branchData = await Branch.findById(branch);
        if (!branchData) {
            return res.status(404).json({ message: "Chi nhánh không tồn tại" });
        }

        user.name = name;
        user.email = email;
        user.phone = phone;
        if (password) {
            user.password = await bcryptjs.hash(password, 10); // Hash password if provided
        }
        user.branch = branchData._id;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Cập nhật tài khoản lễ tân thành công!",
            user: user
        });
    } catch (error) {
        console.error("Error updating lễ tân:", error);
        next(error);
    }
};


//Xóa tài khoản lễ tân
export const deleteReceptionist = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Tìm và xóa tài khoản lễ tân theo ID
        const result = await User.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: "Tài khoản lễ tân không tồn tại" });
        }

        res.status(200).json({
            success: true,
            message: "Xóa tài khoản lễ tân thành công!"
        });
    } catch (error) {
        console.error("Error deleting lễ tân:", error);
        next(error);
    }
};


//Quên mật khẩu
export const forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		// Generate reset token
		const resetToken = crypto.randomBytes(20).toString("hex");
		const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

		user.resetPasswordToken = resetToken;
		user.resetPasswordExpiresAt = resetTokenExpiresAt;

		await user.save();

		// send email
		await sendPasswordResetEmail(user.email, `${process.env.FRONTEND_URL}/reset-password/${resetToken}`);

		res.status(200).json({ success: true, message: "Password reset link sent to your email" });
	} catch (error) {
		console.log("Error in forgotPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};
//reset lại mật khẩu
// export const resetPassword = async (req, res) => {
// 	try {
// 		const { token } = req.params;
// 		const { password } = req.body;

// 		const user = await User.findOne({
// 			// resetPasswordToken: token,
// 			//resetPasswordExpiresAt: { $gt: Date.now() },
//             password: password
// 		});

// 		if (!user) {
// 			return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
// 		}

// 		// update password
// 	   const hashedPassword = await bcryptjs.hash(user.password,10); // 10 is the salt rounds

// 		user.password = hashedPassword;
// 		// user.resetPasswordToken = undefined;
// 		// user.resetPasswordExpiresAt = undefined;
// 		//user.set({
//            // password: hashedPassword
//             //resetPasswordToken: undefined,
//             //resetPasswordExpiresAt: undefined,
//         //});

//         await user.save();
        

// 		await sendResetSuccessEmail(user.email);

// 		res.status(200).json({ success: true, message: "Password reset successful" });
// 	} catch (error) {
// 		console.log("Error in resetPassword ", error);
// 		res.status(400).json({ success: false, message: error.message });
// 	}
// };

// export const resetPassword = async (req, res) => {
// 	try {
// 		const { token } = req.params;
// 		const { password } = req.body;

// 		const user = await User.findOne({
// 			resetPasswordToken: token,
// 			resetPasswordExpiresAt: { $gt: Date.now() },
// 		});

// 		if (!user) {
// 			return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
// 		}

// 		// update password
// 		const hashedPassword = await bcryptjs.hash(password, 10);

// 		user.password = hashedPassword;
// 		user.resetPasswordToken = undefined;
// 		user.resetPasswordExpiresAt = undefined;
// 		await user.save();

// 		await sendResetSuccessEmail(user.email);

// 		res.status(200).json({ success: true, message: "Password reset successful" });
// 	} catch (error) {
// 		console.log("Error in resetPassword ", error);
// 		res.status(400).json({ success: false, message: error.message });
// 	}
// };

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Token is invalid or has expired" });
        }
        const hashedPassword = await bcryptjs.hash(password, 10);
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;

        await user.save();

        await sendResetSuccessEmail(user.email);

        res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });
    } catch (error) {
        console.log("Error in resetPassword", error);
        res.status(400).json({ success: false, message: error.message });
    }
};


// Xuất createUser như là một export named
// export default { createUser }; // Sửa đổi xuất để phù hợp


//Lấy danh sách khách hàng
export const getCustomerAccounts = async (req, res) => {
    try {
        // Tìm tất cả các tài khoản có role là "Khách hàng"
        const customers = await User.find({ role: "Khách hàng" });
        res.status(200).json(customers);
    } catch (error) {
        console.error("Error fetching customer accounts:", error);
        res.status(500).json({ message: "Lỗi khi lấy danh sách tài khoản khách hàng" });
    }
};

//Lấy danh sách lễ tân
export const getLetanAccount = async (req, res) => {
    try {
        // Tìm tất cả các tài khoản có role là "Khách hàng"
        const Letan = await User.find({ role: "Lễ tân" });
        res.status(200).json(Letan);
    } catch (error) {
        console.error("Error fetching Letan accounts:", error);
        res.status(500).json({ message: "Lỗi khi lấy danh sách tài khoản Letan" });
    }
};



