// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import "../Navbar/Navbar.css";
import logo from "../../assets/logo.png";
import VietnamIcon from "../../assets/vietnam.png";
import USAIcon from "../../assets/usa.png";
import { IoMdClose } from "react-icons/io";
import { CiMenuBurger } from "react-icons/ci";
import { Link, NavLink, useNavigate } from "react-router-dom";
import userIcon from "../../assets/Icons/profile-1.png";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";


const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNavActive, setIsNavActive] = useState(false);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false); // Trạng thái đã tải dữ liệu
  const navigate = useNavigate();
  const showNav = () => setIsNavActive(true);
  const removeNav = () => setIsNavActive(false);
  const toggleDropdown1 = () => setShowDropdown((prevState) => !prevState);
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setIsDropdownOpen(false);
  };
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedUserName = localStorage.getItem("userName");


    if (storedUserId) {
      setUserId(storedUserId);
      setUserName(storedUserName);
    } else {
      setUserId("");
      setUserName("");
    }
    setIsLoaded(true); // Đánh dấu là đã tải xong dữ liệu
  }, []);


  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:4000/api/user/khachhang/logout", {
        withCredentials: true,
      });
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      setUserId("");
      setUserName("");
      toast.success("Đăng xuất thành công!");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Có lỗi xảy ra khi đăng xuất, vui lòng thử lại.");
    }
  };


  // Chờ đến khi dữ liệu tải xong
  if (!isLoaded) return null;


  return (
    <header className="header-container">
      <div className="top-bar">
        {userId ? (
          <div className="user-menu">
            <div className="btn-user" onClick={toggleDropdown1}>
              <img src={userIcon} alt="User Icon" width="28" />
              <span className="username">{userName}</span>
            </div>
            {showDropdown && (
              <div className="dropdown-user">
                <Link to="/profile">{t("profile")}</Link>
                <Link to="/history/bookingsuser">{t("booking_history")}</Link>
                <button onClick={handleLogout}>{t("logout")}</button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="btn-login">
            {t("login")}
          </Link>
        )}


        <div className="dropdown">
          <button
            className="dropdown-btn"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <img
              src={i18n.language === "vi" ? VietnamIcon : USAIcon}
              alt="Flag"
              width="20"
            />
            <span>{i18n.language.toUpperCase()}</span>
          </button>
          {isDropdownOpen && (
            <ul className="dropdown-menu">
              <li onClick={() => changeLanguage("vi")}>VI</li>
              <li onClick={() => changeLanguage("en")}>EN</li>
            </ul>
          )}
        </div>
      </div>


      <div className="logo-bar">
        <hr className="horizontal-line" />
        <Link to="/">
          <img src={logo} alt="logo" className="logo" />
        </Link>
      </div>


      <nav className={isNavActive ? "menu activeNavbar" : "menu"}>
        <ul className={`menu-list flex ${userId ? "user-logged-in" : ""}`}>
          <li className="navItem">
            <NavLink
              to="/brand"
              className={({ isActive }) =>
                isActive ? "navLink active-link" : "navLink"
              }
            >
              {t("brand")}
            </NavLink>
          </li>
          <li className="navItem">
            <NavLink
              to="/roomlist"
              className={({ isActive }) =>
                isActive ? "navLink active-link" : "navLink"
              }
            >
              {t("rooms")}
            </NavLink>
          </li>
          <li className="navItem">
            <NavLink
              to="/service"
              className={({ isActive }) =>
                isActive ? "navLink active-link" : "navLink"
              }
            >
              {t("services")}
            </NavLink>
          </li>
          <li className="navItem">
            <NavLink
              to="/location"
              className={({ isActive }) =>
                isActive ? "navLink active-link" : "navLink"
              }
            >
              {t("location")}
            </NavLink>
          </li>
          <li className="navItem">
            <NavLink
              to="/contactus"
              className={({ isActive }) =>
                isActive ? "navLink active-link" : "navLink"
              }
            >
              {t("contact")}
            </NavLink>
          </li>
          {!userId && (
            <li>
              <Link className="btn-login-responsive" to="/login">
                {t("login")}
              </Link>
            </li>
          )}
        </ul>
        <div onClick={removeNav} className="closeNavBar">
          <IoMdClose className="icon" />
        </div>
      </nav>


      <div onClick={showNav} className="toggleNavBar">
        <CiMenuBurger className="icon" />
      </div>
      <ToastContainer />
    </header>
  );
};


export default Navbar;





