// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import avataradmin from '../../assets/images/avatar_admin.png';
import { NavLink, useNavigate } from 'react-router-dom'; // Import NavLink and useNavigate
import axios from 'axios';
import { toast } from 'react-toastify';

import './Account.css';

const Account = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    // eslint-disable-next-line no-unused-vars
    const [userId, setUserId] = useState("");
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleMouseLeave = () => {
        setDropdownOpen(false); // Ẩn dropdown khi chuột rời khỏi menu
    };

    useEffect(() => {
        // Retrieve user name and role from localStorage when component mounts
        const storedUserId = localStorage.getItem("userId");
        const storedUserName = localStorage.getItem('userName');
        const storedUserRole = localStorage.getItem('userRole');

        if (storedUserId) setUserId(storedUserId);
        if (storedUserName) setUserName(storedUserName);
        if (storedUserRole) setUserRole(storedUserRole);
        console.log("Stored user role:", storedUserRole); 
    }, []);

    const handleLogoutAdmin = async () => {
        try {
            console.log("Logging out, userId:", userId); // Log userId before logout
            const response = await axios.post("http://localhost:4000/api/user/admin/logout", {}, {
                withCredentials: true,
            });
            console.log("Logout response:", response); // Log the response to see what the server returns
    
            if (response.status === 200) {
                // Clear user data from localStorage
                localStorage.removeItem("userId");
                localStorage.removeItem("userName");
                localStorage.removeItem("userRole");
                setUserId("");
                setUserName("");
                toast.success("Đăng xuất thành công!");
    
                // Redirect to login page
                navigate("/admin");
            } else {
                throw new Error("Failed to logout");
            }
        } catch (error) {
            console.error("Logout failed:", error.response ? error.response.data : error);
            toast.error("Có lỗi xảy ra khi đăng xuất, vui lòng thử lại.");
        }
    };
    
    
    return (
        <div className="avatar-container-admin" onClick={toggleDropdown}>
            <img
                src={avataradmin}
                alt="User Avatar"
                className="avatar-img-admin"
            />
            <div className="user-info-admin">
                <span className="name-admin">{userName}</span>
                <span className="role-admin">{userRole}</span>
            </div>
            {/* Icon Dropdown */}
            <FaChevronDown
                className={`dropdown-icon-admin ${dropdownOpen ? 'rotate' : ''}`}
            />

            {/* Dropdown menu */}
            <div
                className={`dropdown-menu-admin ${dropdownOpen ? 'active' : ''}`}
                onMouseLeave={handleMouseLeave} // Thêm sự kiện onMouseLeave để ẩn menu
            >
                <div className="dropdown-item-admin">
                    <NavLink to="/profileAdmin" className={({ isActive }) => isActive ? 'active' : ''}>
                        <p>Thông tin cá nhân</p>
                    </NavLink>
                </div>
                <div className="dropdown-item-admin" onClick={handleLogoutAdmin}>
                    <p>Đăng xuất</p>
                </div>
            </div>
        </div>
    );
};

export default Account;
