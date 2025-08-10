// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Service.css';
import Slider from 'react-slick';

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import BacktoTop from "../../components/BacktoTop/BacktoTop";
import axios from 'axios';

const DetailService = () => {
  const { serviceId } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
  };

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/hotelservices/hotelservicesdetail/${serviceId}`);
        setService(response.data);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError("Không thể lấy dữ liệu dịch vụ.");
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetails();
  }, [serviceId]);

  if (loading) {
    return <h1>Đang tải...</h1>;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  if (!service) {
    return <h1 className="service-not-found">Dịch vụ không tồn tại</h1>;
  }

  return (
    <div>
      <Navbar/>
      <div className="service-detail">
        <div className="service-slider">
        <Slider {...sliderSettings}>
        {/* Kiểm tra nếu mảng ảnh ServicesImage tồn tại và không rỗng */}
        {service.ServicesImage && service.ServicesImage.length > 0 && service.ServicesImage.map((imageObj, index) => (
          <div key={index}>
              <img src={imageObj.url} alt={`Slide ${index}`} className="slider-image" />
         </div>
        ))}
       </Slider>
        </div>

        <div className='banner-service-content'>
          <h1>{service.Nameservices}</h1>
          <p>{service.Describeservices}</p>
          <div className='banner-info-3'>
            <p><strong style={{fontWeight: '700'}}>Thời gian:</strong> {service.weekdays.from} - {service.weekdays.to} ({service.weekdays.days})</p>
            <p><strong style={{fontWeight: '700'}}>Thời gian:</strong> {service.sunday.from} - {service.sunday.to} ({service.sunday.day})</p>
            <p><strong style={{fontWeight: '700'}}>Địa điểm:</strong> {service.Locationservices}</p>
          </div>
        </div>  
        <div className="button-container">
          <Link to="/service" className="back-button">
            &larr; Quay lại 
          </Link>
        </div>
      </div>
      <BacktoTop/>
      <Footer/>
    </div>
  );
};

export default DetailService;
