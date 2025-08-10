// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import NavbarAdmin from '../../../components/Navbar/NavbarAdmin';
import Account from '../../../components/Account/Account';

import './BookingAdmin.css'

const BookingList = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await fetch(`http://localhost:4000/booking/bookings3`);
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
    }, []);

    return (
        <div className="admin-layout">
            <NavbarAdmin />

            <div className="top-bar-admin">
                <Account />
            </div>
            <div className="room-manager-content">
                <h1>Danh Sách Đặt Phòng</h1>
                {loading ? (
                    <p>Đang tải dữ liệu...</p> // Hiển thị khi đang tải dữ liệu
                ) : (
                    <table className="booking-table">
                        <thead>
                            <tr>
                                <th>Mã Đặt Phòng</th>
                                <th>Tên Phòng</th>
                                <th>Trạng Thái</th>
                                <th>Ngày Nhận</th>
                                <th>Ngày Trả</th>
                                <th>Chi Tiết</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.length > 0 ? (
                                bookings.map((booking) => (
                                    <tr key={booking._id}>
                                        <td>{booking.BookingCode}</td>
                                        <td>{booking.Room?.NameRoom || 'N/A'}</td>
                                        <td>{booking.Status}</td>
                                        <td>
                                            {booking.CheckInDate ? new Date(booking.CheckInDate).toLocaleString() : 'N/A'}
                                        </td>
                                        <td>
                                            {booking.CheckOutDate ? new Date(booking.CheckOutDate).toLocaleString() : 'N/A'}
                                        </td>
                                        <td>
                                            <Link to={`/bookings3/${booking._id}`} className="btn-detail-booking">
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
    );
};

export default BookingList;
