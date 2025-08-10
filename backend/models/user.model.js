import mongoose from "mongoose";
import validator from 'validator';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        minLength: [3, "Name Must Contain At Least 3 Characters!"],
    },
    email: {
        type: String,
        required: true,
        validate: [validator.isEmail, "Provide A Valid Email!"],
    },
    password: {
        type: String,
        required: [true, "Password Is Required!"],
        minLength: [8, "Password Must Contain At Least 8 Characters!"],
        select: false,
    },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v); // Kiểm tra 10 chữ số
            },
            message: "Phone Number Must Contain Exactly 10 Digits!"
        }
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch', // Tham chiếu đến mô hình Branch
        required: false
    },
    role: {
        type: String,
        required: [true, "User Role Required!"],
        enum: ["Lễ tân", "Quản lý", "Khách hàng"],
    },
    birthday: {
        type: Date,
        required: [false, "Birthday Is Required!"],
    },
    gender: {
        type: String,
        required: [false, "Gender Is Required!"],
        enum: ["Nam", "Nữ"],
    },
    resetPasswordToken: String,
	resetPasswordExpiresAt: Date,
    createdOn: { type: Date, default: new Date().getTime() },
}, {
    timestamps: true // Sửa thành timestamps thay vì timeseries
});

// Phương thức tạo JWT
userSchema.methods.generateJsonWebToken = function() {
    return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES // Ví dụ: "7d"
    });
};

// Mã băm password trước khi lưu
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcryptjs.hash(this.password, 10);
});

// Phương thức so sánh password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcryptjs.compare(enteredPassword, this.password);
};

// Xuất module
export default mongoose.model("User", userSchema);
