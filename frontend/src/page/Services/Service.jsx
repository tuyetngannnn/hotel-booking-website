// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import './Service.css';
import axios from 'axios';  // Import axios để gọi API

import gpsIcon from '../../assets/icons/gps.png'; // Đường dẫn đến hình ảnh gps
import clockIcon from '../../assets/icons/clock.png'; // Đường dẫn đến hình ảnh clock

import Navbar from "../../components/Navbar/Navbar";
import Banner from "../../components/Banner/Banner";
import Footer from "../../components/Footer/Footer";
import BacktoTop from "../../components/BacktoTop/BacktoTop";

const Service = () => {
    const [services, setServices] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/hotelservices/getallservices?page=${currentPage}&limit=4`);
                setServices(response.data.hotelservices);
                setTotalPages(response.data.totalPages); 
            } catch (err) {
                setError('Lỗi khi tải dịch vụ');
            }
        };
        fetchServices();
    }, [currentPage]);  

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <Navbar />
            <Banner
                image="src/assets/images/Banner_dich_vu.jpg"
                title="Dịch Vụ & Giải Trí"
            />
            <div className="body-dv">
                <div className="text-content-body-1">DỊCH VỤ & GIẢI TRÍ</div>
                <div className="text-content-body-2">
                    The Royal Sea mang đến trải nghiệm nghỉ dưỡng hoàn hảo với nhiều dịch vụ và tiện ích đa dạng.
                    Quý khách có thể thư giãn tại spa, bơi lội tại hồ bơi ngoài trời, rèn luyện sức khỏe tại phòng gym hiện đại,
                    và thưởng thức ẩm thực tinh tế tại các nhà hàng. Nhiều hoạt động giải trí và tiện nghi khác cũng được thiết kế để
                    đem lại sự thoải mái tuyệt đối trong suốt kỳ nghỉ.
                </div>

                {/* Render danh sách dịch vụ từ API */}
                {services.map((service, index) => (
                    <div key={service._id} className={`service-banner-1 ${index % 2 === 0 ? 'left' : 'right'}`}>
                        {index % 2 === 0 ? (
                            <>
                                <div className="banner-image">
                                    <img src={service.ServicesImage?.[0]?.url || 'default-image.jpg'} alt={service.Nameservices} />
                                </div>
                                <div className="banner-content-1">
                                    <h3>{service.Nameservices}</h3>
                                    <p>{service.Describeservices}</p>
                                    <div className="banner-info">
                                        <p>
                                            <img src={clockIcon} alt="Clock Icon" className="icon" />
                                            {service.weekdays?.from || 'N/A'} - {service.weekdays?.to || 'N/A'} - {service.weekdays?.days || 'N/A'}
                                        </p>
                                        <p>
                                            <img src={clockIcon} alt="Clock Icon" className="icon" />
                                            {service.sunday?.from || 'N/A'} - {service.sunday?.to || 'N/A'} - {service.sunday?.day || 'N/A'}
                                        </p>
                                        <p>
                                            <img src={gpsIcon} alt="Gps Icon" className="icon" />
                                            {service.Locationservices || 'N/A'}
                                        </p>
                                    </div>
                                    <Link to={`/detail-service/${service._id}`} className="banner-button">
                                        Xem thêm &rarr;
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <div className="service-banner-2">
                                <div className="banner-content-2">
                                    <h3>{service.Nameservices}</h3>
                                    <p>{service.Describeservices}</p>
                                    <div className="banner-info-2">
                                        <p>
                                            <img src={clockIcon} alt="Clock Icon" className="icon" />
                                            {service.weekdays?.from || 'N/A'} - {service.weekdays?.to || 'N/A'} - {service.weekdays?.days || 'N/A'}
                                        </p>
                                        <p>
                                            <img src={clockIcon} alt="Clock Icon" className="icon" />
                                            {service.sunday?.from || 'N/A'} - {service.sunday?.to || 'N/A'} - {service.sunday?.day || 'N/A'}
                                        </p>
                                        <p>
                                            <img src={gpsIcon} alt="Gps Icon" className="icon" />
                                            {service.Locationservices || 'N/A'}
                                        </p>
                                    </div>
                                    <Link to={`/detail-service/${service._id}`} className="banner-button">
                                        Xem thêm &rarr;
                                    </Link>
                                </div>
                                <div className="banner-image-2">
                                    <img src={service.ServicesImage?.[0]?.url || 'default-image.jpg'} alt={service.Nameservices} />
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {/* Phân trang */}
                <div className="pagination">
                    <button
                        className="page-button"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}>
                        Trước
                    </button>
                    {[...Array(totalPages).keys()].map((page) => (
                        <button
                            key={page + 1}
                            className={`page-button page-number ${currentPage === page + 1 ? 'active' : ''}`}
                            onClick={() => handlePageChange(page + 1)}>
                            {page + 1}
                        </button>
                    ))}
                    <button
                        className="page-button"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}>
                        Sau
                    </button>
                </div>
            </div>
            <BacktoTop />
            <Footer />
        </div>
    );
};

export default Service;
