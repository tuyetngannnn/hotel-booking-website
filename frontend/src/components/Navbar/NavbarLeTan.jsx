import React from 'react';
import { FaHome, FaBed, FaConciergeBell, FaInbox } from 'react-icons/fa';
import { NavLink } from 'react-router-dom'; // Import NavLink

import logo from '../../assets/logo.png';
import './NavbarLeTan.css'
const NavbarLeTan = () => {
    return (
        <div className="navbar-lt">
            <div className="navbar-logo-lt">
                <div className="line-navbar-lt short-line-lt"></div>
                <img src={logo} alt="The Royal Sea" className="logo-navbar-lt" />
                <div className="line-navbar-lt long-line-lt"></div>
            </div>
            <ul className="navbar-menu-lt">
                <li className="navbar-item-lt">
                    <NavLink to="/homeletan" className={({ isActive }) => isActive ? 'active' : ''}>
                        <FaHome className="icon-lt" />
                        <span>Trang chủ</span>
                    </NavLink>
                </li>
                <li className="navbar-item-lt">
                    <NavLink to="/roommanager" className={({ isActive }) => isActive ? 'active' : ''}>
                        <FaBed className="icon-lt" />
                        <span>Tạo phiếu đặt Phòng</span>
                    </NavLink>
                </li>
                <li className="navbar-item-lt">
                    <NavLink to="/hotelservicesmanager" className={({ isActive }) => isActive ? 'active' : ''}>
                        <FaConciergeBell className="icon-lt" />
                        <span>Tạo hóa đơn</span>
                    </NavLink>
                </li>
                <li className="navbar-item-lt">
                    <NavLink to="/getallmessage" className={({ isActive }) => isActive ? 'active' : ''}>
                        <FaInbox className="icon-lt" />
                        <span>Hộp thư</span>
                    </NavLink>
                </li>
            </ul>
        </div>
    );
};

export default NavbarLeTan;