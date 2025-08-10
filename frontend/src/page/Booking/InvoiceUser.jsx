// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Navbar from '../../components/Navbar/Navbar';
import NavBarHistory from '../../components/Navbar/NavbarHistory';
// eslint-disable-next-line no-unused-vars
import Footer from '../../components/Footer/Footer';

import '../Booking/List_DetailBooking.css'

const BookingList = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState('');
    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, []);

    useEffect(() => {
        if (!userId) return; // Kiểm tra nếu userId tồn tại trước khi gọi API


        const fetchBookings = async () => {
            try {
                const response = await fetch(`http://localhost:4000/booking/invoice/${userId}`);
                const data = await response.json();
                console.log("Dữ liệu API trả về:", data); // Kiểm tra dữ liệu trả về
                setBookings(data); // Giả sử data là mảng bookings
            } catch (error) {
                console.error('Lỗi khi lấy danh sách đặt phòng:', error);
            } finally {
                setLoading(false); // Dừng trạng thái loading
            }
        };


        fetchBookings();
    }, [userId]); // Thêm userId vào danh sách phụ thuộc
    return (
        <div>
            <Navbar />
            <div className="body-user-listbooking">
                <NavBarHistory />
                <div className="booking-user-list">
                    <h1>Danh Sách Hóa Đơn</h1>
                    {loading ? (
                        <p>Đang tải dữ liệu...</p> // Hiển thị khi đang tải dữ liệu
                    ) : (
                        <table className="booking-table-user">
                            <thead>
                                <tr>
                                    <th>Mã Hóa Đơn</th>
                                    <th>Tên Phòng</th>
                                    <th>Tên khách hàng</th>
                                    <th>Trạng Thái Hóa đơn</th>
                                    <th>Ngày thanh toán</th>
                                    <th>Chi Tiết</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.length > 0 ? (
                                    bookings.map((booking) => (
                                        <tr key={booking._id}>
                                            <td>{booking.BookingCode}</td>
                                            <td>{booking.Room?.NameRoom || 'N/A'}</td>
                                            <td>{booking.User?.name || 'N/A'}</td>
                                            <td>{booking.InvoiceStatus}</td>
                                            <td>
                                                {booking.PaymentDate ? new Date(booking.PaymentDate).toLocaleString() : 'N/A'}
                                            </td>
                                            <td>
                                                <Link to={`/history/invoice/${booking._id}`} className="btn-detail-booking-user">
                                                    Xem Chi Tiết
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-2 px-4 border text-center">Không có dữ liệu đặt phòng.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};
export default BookingList;



