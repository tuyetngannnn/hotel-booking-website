
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { motion } from 'framer-motion'; 
import { Link, useNavigate } from 'react-router-dom'; // Thêm useNavigate
import { validateEmail } from '../../utils/helper'; // Helper để kiểm tra email hợp lệ
import Password from "../../components/Input/Password"; // Component nhập mật khẩu
import axios from 'axios'; // Sử dụng axios để gọi API
import '../../App.css'

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState(""); 
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // Biến để hiển thị thông báo thành công
  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

  // Hàm kiểm tra số điện thoại chính xác 10 số
  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  // Hàm xử lý đăng ký tài khoản
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null); // Reset lỗi
    setSuccess(null); // Reset thông báo thành công

    // Kiểm tra hợp lệ dữ liệu đầu vào
    if (!name) {
      setError("Vui lòng nhập tên của bạn");
      return;
    }
    if (!validateEmail(email)) {
      setError("Vui lòng nhập email hợp lệ");
      return;
    }
    if (!validatePhone(phone)) {
      setError("Vui lòng nhập số điện thoại hợp lệ (10 số)");
      return;
    }
    if (!password) {
      setError("Vui lòng nhập mật khẩu");
      return;
    }

    try {
      // Gọi API đăng ký tài khoản
      const response = await axios.post('http://localhost:4000/api/user/createUser', {
        name,
        email,
        phone,
        password,
        role:"Khách hàng"
      });

      if (response.data.success) {
        setSuccess("Đăng ký thành công!"); // Hiển thị thông báo
        setTimeout(() => {
          navigate('/login'); // Chuyển sang trang đăng nhập sau khi thành công
        }, 2000); // Đợi 2 giây trước khi chuyển trang
      } else {
        setError("Đăng ký thất bại!");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <form onSubmit={handleSignUp}>
          <h1>Tạo Tài Khoản</h1>
          <p>Tên đăng nhập <span style={{ color: 'red' }}>*</span></p>
          <input
            type="text"
            className="input-box"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <p>Email <span style={{ color: 'red' }}>*</span></p>
          <input
            type="text"
            className="input-box"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p>Số điện thoại <span style={{ color: 'red' }}>*</span></p>
          <input
            type="text"
            className="input-box"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <p>Mật khẩu <span style={{ color: 'red' }}>*</span></p>
          <Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <button type="submit" className="btn-primary-signup">Đăng ký</button>
          <div className="create-account">
            Bạn đã có tài khoản? {" "}
            <Link to="/login" className="link-create">
              Đăng nhập
            </Link>
          </div>
        </form>
      </div>
      <motion.div 
        className='image-container-signup'
        initial={{ x: 100 }} 
        animate={{ x: 0 }} 
        exit={{ x: 100 }} 
        transition={{ duration: 0.5 }} 
      >
        {/* Image placeholder */}
      </motion.div>
    </div>
  );
}

export default SignUp;
