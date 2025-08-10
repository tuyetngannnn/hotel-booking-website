// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import './Room.css';

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import BacktoTop from "../../components/BacktoTop/BacktoTop";
import BannerSlider from '../../components/Banner-Slider/Banner-Image';
import { useNavigate } from 'react-router-dom';
const Room = () => {
    const [rooms, setRooms] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();
    useEffect(() => {
        fetchRooms();
    }, [currentPage]);

    const fetchRooms = async () => {
        try {
            const response = await fetch(`http://localhost:4000/room/getroomlist?page=${currentPage}&limit=4`);
            const data = await response.json();
            console.log(data); // Kiểm tra dữ liệu trả về
            setRooms(data.rooms);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách phòng:', error);
        }
    };
    const handleCardClick = (roomId) => {
        // Điều hướng đến trang chi tiết phòng dựa trên roomId
        navigate(`/roomdetail/${roomId}`);
      };
    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div>
            <Navbar />
            <BannerSlider />
            <div className="body-room">
                <div className="text-content-body-1">Phòng & Suites</div>
                <div className="text-content-body-room">
                    The Royal Sea là sự kết hợp giữa kiến trúc cổ điển và thiết kế hiện đại, với 280 phòng và suite sang trọng có nội thất phong cách và cao cấp. Màu sắc nhẹ nhàng trong mỗi phòng tạo ra bầu không khí thư giãn mang đến cho khách doanh nhân và khách du lịch một nơi ẩn náu thư thái sau một ngày khám phá Thành phố Hồ Chí Minh.
                </div>

                <div className="room-grid">
                    {rooms.map((room) => (
                        <div key={room._id} className="room-card" onClick={() => handleCardClick(room._id)}>
                            <img src={room.RoomImages?.[0]?.url || 'default_image_url'} alt={room.NameRoom} className="image-room" />
                            <h3 className="room-title">{room.NameRoom}</h3>
                            <p className="room-description">{room.Describe}</p>
                            <p className="room-info">{room.IDRoomType?.MaxPeople} Khách | {room.IDBranch?.branchname} | {room.acreage} m²</p>
                            <button className="book-button">Xem phòng</button> 
                        </div>
                    ))}
                </div>

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
                            className={`page-button page-number ${currentPage === page + 1 ? 'active' : ''}`} // Sử dụng 'page-number' cùng với 'active'
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

export default Room;
