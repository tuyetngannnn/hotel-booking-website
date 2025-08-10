// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { Link } from "react-router-dom";
import "./Contact.css";
import Banner from "../../components/Banner/Banner";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import BacktoTop from "../../components/BacktoTop/BacktoTop";


import sendIcon from "../../assets/icons/send.png";


const Contact = () => {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [notification, setNotification] = useState(""); // State for notification message
    const [notificationType, setNotificationType] = useState(""); // State for notification type (success/error)


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:4000/message/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });


            const data = await response.json();
            if (data.success) {
                setNotification("Gửi thành công! Chúng tôi sẽ sớm liên hệ lại ngay.");
                setNotificationType("success");
                setFormData({ name: "", email: "", message: "" }); // Clear form data
            } else {
                setNotification("Gửi không thành công, vui lòng thử lại.");
                setNotificationType("error");
            }
        } catch (error) {
            console.error("Error:", error);
            setNotification("Có lỗi xảy ra. Vui lòng thử lại sau.");
            setNotificationType("error");
        }
    };


    return (
        <div>
            <Navbar />
            <Banner
                image="src/assets/images/Banner_contact.jpg"
                title="Liên Hệ"
            />
            <div className="body-lh">
                <div className="text-content-body-1">THÔNG TIN LIÊN HỆ</div>
                <div className="text-content-body-3">
                    <div className="text-content-body-4">Chi Nhánh Chính: 828 Sư Vạn Hạnh, Phường 13, Quận 10, Thành phố Hồ Chí Minh, Việt Nam.</div>
                    <div className="text-content-body-4">Hotline: +84 909 805 417</div>
                    <div className="text-content-body-4">Email: theroyalseahotel@gmail.com</div>
                </div>
                <div className="other-branche">
                    <hr className="divider" />
                    <div className="text-content-body-1">LIÊN HỆ VỚI CHÚNG TÔI</div>
                    <div className="contact-container">
                        <div className="map-container">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4167.160841477365!2d106.66773915025917!3d10.775636743034099!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3ae5901877%3A0x42c37972de865906!2zODI4IMSQLiBTxrAgVuG6oW4gSOG6oW5oLCBQaMaw4budbmcgMTIsIFF14bqtbiAxMCwgVGjDoG5oIHBo4buRIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1698473075297!5m2!1svi!2s"></iframe>
                        </div>
                        <div className="form-container">
                            <h2>LIÊN HỆ VỚI CHÚNG TÔI ĐỂ NHẬN PHẢN HỒI SỚM NHẤT!</h2>
                            {notification && (
                                <div className={`notification ${notificationType}`}>
                                    {notification}
                                </div>
                            )}
                            <form className="contact-form" onSubmit={handleSubmit}>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Họ tên" required />
                                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
                                <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Nội dung liên hệ" required></textarea>
                                <div className="button-send">
                                    <button type="submit">
                                        GỬI <span><img src={sendIcon} alt="Send Icon" className="icon" /></span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <BacktoTop />
            <Footer />
        </div>
    );
};


export default Contact;