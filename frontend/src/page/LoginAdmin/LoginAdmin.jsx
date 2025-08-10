// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { motion } from 'framer-motion'; 
// eslint-disable-next-line no-unused-vars
import { Link, useNavigate } from "react-router-dom";
import Password from "../../components/Input/PasswordAdmin"; // Giả sử bạn đã tạo component Password
// eslint-disable-next-line no-unused-vars
import { validateEmail } from '../../utils/helper'; // Giả sử bạn đã tạo hàm validateEmail
import '../../App.css'; // Import file CSS
import axios from 'axios';
const LoginAdmin = () => {
   
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        if (!validateEmail(email)) {
            setError("Vui lòng nhập lại email của bạn");
            return;
        }
        if (!password) {
            setError("Vui lòng nhập mật khẩu của bạn");
            return;
        }

        setError(""); // Reset lỗi

        try {
            const response = await axios.post('http://localhost:4000/api/user/loginAdmin', {
                email,
                password,
            });
        
            console.log("Response:", response.data); // In ra dữ liệu trả về từ server
        
            if (response.data.success) {
                const { user } = response.data; // Giả sử server trả về role và thông tin người dùng
        
                // Lưu thông tin người dùng vào localStorage
                // localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("userId", user._id);
                localStorage.setItem("userName", user.name);
                localStorage.setItem("role", user.role);
                // Chuyển hướng dựa trên role
                if (user.role === "Quản lý") {
                    localStorage.setItem('user', JSON.stringify(user));
                    navigate('/homeadmin'); // Chuyển đến trang cho admin
                } else if (user.role === "Lễ tân") {
                    localStorage.setItem('user', JSON.stringify(user));
                    navigate('/homeletan'); // Chuyển đến trang cho lễ tân
                } else {
                    setError("Tài khoản không tồn tại");
                }
            } else {
                setError("Đăng nhập thất bại!");
            }
        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!");
        }
        
    };
    return (
        <div className="login-container" style={{backgroundColor: "#162f4a"} }>
            <motion.div 
                className='image-container-admin'
                initial={{ x: -100 }} // Vị trí bắt đầu
                animate={{ x: 0 }} // Vị trí kết thúc
                exit={{ x: -100 }} // Vị trí ra khỏi
                transition={{ duration: 0.5 }} // Thời gian chuyển động
            >
            </motion.div>
            <div className="login-form-admin">
                <form onSubmit={handleLogin}>
                    <h1>Đăng Nhập</h1>
                    <p>Email <span style={{ color: 'red', fontSize: '28px'}}>*</span></p>
                    <input
                        type="text"
                        className="input-box-admin"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <p>Mật khẩu <span style={{ color: 'red', fontSize: '28px'}}>*</span></p>
                    <Password
                        className='password-box-admin'
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                    {error && <p className='error-message'>{error}</p>}
                    <p className="forgot-password-admin">
                        <Link to="/forgot-password" className="link-admin">Quên mật khẩu</Link>
                    </p>
                    <button type="submit" className="btn-primary-admin"> 
                        Đăng Nhập
                    </button>
                    <div className="footer-login">
                         <div className="login-role-container">
                             <span className="line-admin"></span>
                             <span className="login-role-text-admin">Đăng nhập với vai trò</span>
                             <span className="line-admin"></span>
                         </div>
                         <Link to="/login">
                             <button className="btn-role">Khách hàng</button>
                         </Link>
                     </div>
                </form>
                <Link to="/" className='backHome-admin'>
                        Quay về trang chủ &rarr;
                    </Link>
            </div>
        </div>
    );
}

export default LoginAdmin;