// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./RoomDetail.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import BacktoTop from "../../components/BacktoTop/BacktoTop";
import Slider from "react-slick"; // Nhập Slider từ react-slick
import "slick-carousel/slick/slick.css"; // Import CSS cho slick-carousel
import "slick-carousel/slick/slick-theme.css";
import prev from "../../assets/left.png";
import next from "../../assets/right.png";
const RoomDetail = () => {
  const { roomId } = useParams(); // Lấy ID phòng từ URL
  const [room, setRoom] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/room/roomdetail/${roomId}`
        );
        setRoom(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu phòng:", error);
      }
    };
    fetchRoom();
  }, [roomId]);

  if (!room) return <div className="text-center py-10">Loading...</div>;

  const handleBooking = () => {
    // Chuyển hướng đến trang đặt chỗ
    navigate(`/booking/${roomId}`); // Chuyển hướng đến URL với ID của phòng
  };
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Hiển thị 1 ảnh tại một thời điểm
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000, // Tự động lướt mỗi 3 giây
    prevArrow: (
      <div className="custom-arrow prev">
        <img
          src={prev}
          alt="Previous"
          style={{ width: "fit-content", height: "fit-content" }}
        />
      </div>
    ),
    nextArrow: (
      <div className="custom-arrow next">
        <img
          src={next}
          alt="Next"
          style={{
            width: "fit-content",
            height: "fit-content",
            position: 'relative',
            left: '-10px'
          }}
        />
      </div>
    ),
    responsive: [
      {
        breakpoint: 768, // Điều chỉnh cho các màn hình nhỏ hơn
        settings: {
          slidesToShow: 1, // Hiển thị 1 ảnh cho màn hình nhỏ
        },
      },
    ],
  };

  return (
    <div className="room-detail">
      <Navbar />

      <div className="body-room-detail">
        {/* Thông tin chi tiết phòng */}
        <div className="room-detail-info">
          <div className="room-image-container">
            <img
              src={room.RoomImages[0]?.url}
              alt={room.NameRoom}
              className="room-image"
            />
            <div className="room-details-overlay">
              <h2>THÔNG TIN</h2>
              <ul>
                <li>
                  <strong>Loại phòng:</strong> {room.IDRoomType?.NameRoomtype}
                </li>
                <li>
                  <strong>Số khách:</strong> {room.IDRoomType?.MaxPeople}
                </li>
                <li>
                  <strong>Diện tích phòng:</strong> {room.acreage}m²
                </li>
                <li>
                  <strong>Giá:</strong>{" "}
                  {room.IDRoomType && room.IDRoomType.PriceRoomtype
                    ? room.IDRoomType.PriceRoomtype.toLocaleString()
                    : "Không có dữ liệu"}{" "}
                  VND
                </li>
                <li>
                  <strong>Mô tả:</strong> {room.Describe}
                </li>
                <li>Wifi miễn phí</li>
                <li>Phòng tắm, vòi sen</li>
                <li>LED TV</li>
                <li>Quầy minibar, trà, cà phê</li>
                <li>Dịch vụ chăm sóc khách hàng 24/24</li>
                <li>Két sắt</li>
                <li>Ban công với tầm nhìn ra biển</li>
              </ul>
              <button onClick={handleBooking}>ĐẶT CHỖ</button>
            </div>
          </div>
        </div>

        {/* Image Carousel (Thay đổi thành react-slick) */}
        <div className="image-carousel-room-detail" >
          <Slider {...settings}>
            {room.RoomImages.map((image, index) => (
              <div key={index} style={{ margin: '25px 25px', width: 'calc(100% - 40px)' }}>
                <img
                  src={image.url}
                  alt={`Room ${index + 1}`}
                  className="slider-rooms"
                  style={{ display: 'block', width: '95%', borderRadius: '8px' }}
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>

      <BacktoTop />
      <Footer />
    </div>
  );
};

export default RoomDetail;
