import React, { useState } from 'react';
import './NavBarHistory.css';
import { NavLink } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa'; // Import thêm icon FaTimes

const NavBarHistory = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="navbar-history">
      {/* Thay đổi icon khi menu mở/đóng */}
      <div className="menu-icon" onClick={toggleMenu}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Danh sách liên kết */}
      <ul className={isOpen ? 'open' : ''}>
        <li>
          <NavLink to="/history/bookingsuser" activeClassName="active" exact>
            Lịch sử đặt phòng
          </NavLink>
        </li>
        <li>
          <NavLink to="/history/bookingsycuser" activeClassName="active">
            Lịch sử đặt thêm
          </NavLink>
        </li>
        <li>
          <NavLink to="/history/invoice" activeClassName="active">
            Lịch sử hóa đơn
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default NavBarHistory;
