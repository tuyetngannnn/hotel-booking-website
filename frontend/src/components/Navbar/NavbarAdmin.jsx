import React from 'react';
import { FaHome, FaBed, FaConciergeBell, FaThList, FaCogs, FaUsers, FaChartBar, FaFileInvoice } from 'react-icons/fa';
import { NavLink } from 'react-router-dom'; // Import NavLink

import logo from '../../assets/logo.png';
import './NavbarAdmin.css'; // Import CSS
const NavbarAdmin = () => {
    return (
        <div className="navbar-admin">
            <div className="navbar-logo">
                <div className="line-navbar-admin short-line"></div>
                <img src={logo} alt="The Royal Sea" className="logo-navbar-admin" />
                <div className="line-navbar-admin long-line"></div>
            </div>
            <ul className="navbar-menu">
                <li className="navbar-item">
                    <NavLink to="/homeadmin" className={({ isActive }) => isActive ? 'active' : ''}>
                        <FaHome className="icon" />
                        <span>Trang chủ</span>
                    </NavLink>
                </li>
                <li className="navbar-item">
                    <NavLink to="/roommanager" className={({ isActive }) => isActive ? 'active' : ''}>
                        <FaBed className="icon" />
                        <span>Phòng</span>
                    </NavLink>
                </li>
                <li className="navbar-item">
                    <NavLink to="/hotelservicesmanager" className={({ isActive }) => isActive ? 'active' : ''}>
                        <FaConciergeBell className="icon" />
                        <span>Dịch vụ</span>
                    </NavLink>
                </li>
                <li className="navbar-item">
                    <NavLink to="/roomtypemanager" className={({ isActive }) => isActive ? 'active' : ''}>
                        <FaThList className="icon" />
                        <span>Loại phòng</span>
                    </NavLink>
                </li>
                <li className="navbar-item">
                    <NavLink to="/equipmentmanagement" className={({ isActive }) => isActive ? 'active' : ''}>
                        <FaCogs className="icon" />
                        <span>Thiết bị</span>
                    </NavLink>
                </li>
                <li className="navbar-item">
                    <NavLink to="/accountmanager" className={({ isActive }) => isActive ? 'active' : ''}>
                        <FaUsers className="icon" />
                        <span>Tài khoản</span>
                    </NavLink>
                </li>
                <li className="navbar-item">
                    <NavLink to="/invoiceadmin" className={({ isActive }) => isActive ? 'active' : ''}>
                        <FaFileInvoice className="icon" />
                        <span>Hóa đơn</span>
                    </NavLink>
                </li>
                <li className="navbar-item">
                    <NavLink to="/statistics" className={({ isActive }) => isActive ? 'active' : ''}>
                        <FaChartBar className="icon" />
                        <span>Thống kê</span>
                    </NavLink>
                </li>
            </ul>
        </div>
    );
};

export default NavbarAdmin;
