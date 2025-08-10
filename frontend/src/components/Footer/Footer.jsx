// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import "../Footer/Footer.css";
// eslint-disable-next-line no-unused-vars
import { Link } from "react-router-dom"; // Import Link từ react-router-dom
import logo from "../../assets/logo.png";
import ig from "../../assets/ig.png";
import tt from "../../assets/tiktok.png";
import fb from "../../assets/facebook.png";
import pin from "../../assets/pinterest.png";
import yt from "../../assets/youtube.png";
import { useTranslation } from "react-i18next";


const Footer = () => {
  const { t } = useTranslation();
  // eslint-disable-next-line no-unused-vars
  const [isFocused, setIsFocused] = useState(false);


  const handleFocus = (e) => {
    const placeholder = e.target.nextElementSibling; // Lấy phần tử placeholder
    placeholder.style.display = "none"; // Ẩn placeholder
  };


  const handleBlur = (e) => {
    const placeholder = e.target.nextElementSibling; // Lấy phần tử placeholder
    if (!e.target.value) {
      placeholder.style.display = "block"; // Hiển thị lại placeholder nếu ô trống
    }
  };


  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-column">
          <h3>{t("notification")}</h3>
          <p>{t("update")}</p>
          <div className="input-wrapper">
            <input
              type="email"
              className="email-input"
              onFocus={handleFocus} // Thêm hàm xử lý sự kiện focus
              onBlur={handleBlur} // Thêm hàm xử lý sự kiện blur
            />
            <span className="placeholder">
              <span className="email-text">Email</span>{" "}
              <span className="required-text">{t("required")}</span>
            </span>
          </div>
          <button className="subscribe-button">{t("sign-up")}</button>
        </div>


        <div className="footer-column">
          <img src={logo} className="logo-footer" />
        </div>


        <div className="footer-column">
          <h3>{t("findUs")}</h3>
          <p>{t("address")}</p>
          <p>{t("address2")}</p>
          <p>+84 909 805 417</p>
          <p>theroyalsea@gmail.com</p>
          <div className="social-media">
            <a href="#">
              <img src={ig} style={{ width: "20px", height: "20px" }} />
            </a>
            <a href="#">
              <img src={tt} style={{ width: "20px", height: "20px" }} />
            </a>
            <a href="https://www.facebook.com/huflit.edu.vn">
              <img src={fb} style={{ width: "20px", height: "20px" }} />
            </a>
            <a href="#">
              <img src={pin} style={{ width: "20px", height: "20px" }} />
            </a>
            <a href="#">
              <img src={yt} style={{ width: "20px", height: "20px" }} />
            </a>
          </div>
        </div>
      </div>


      <div className="footer-bottom">
        <div className="footer-column">
          <p>© 2024 | All rights reserved by Hotel The Royal Sea Co., Ltd.</p>
        </div>
        <div className="footer-column">
          <p>{t("termsofservice")}</p>
        </div>
        <div className="footer-column">
          <p>{t("privacypolicy")}</p>
        </div>
      </div>
    </footer>
  );
};


export default Footer;





