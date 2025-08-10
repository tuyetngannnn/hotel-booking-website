import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import NavbarAdmin from '../../../components/Navbar/NavbarAdmin';
import Account from '../../../components/Account/Account';

import './BookingAdmin.css';

const BookingList = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("Tất cả"); // Trạng thái lọc dữ liệu

    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true); // Bắt đầu trạng thái loading
            try {
                const response = await fetch(`http://localhost:4000/booking/invoice`);
                const data = await response.json();
                console.log("Dữ liệu API trả về:", data); // Kiểm tra dữ liệu trả về
                setBookings(data);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách đặt phòng:', error);
            } finally {
                setLoading(false); // Dừng trạng thái loading
            }
        };

        fetchBookings();
    }, []);

    // Lọc dữ liệu dựa trên trạng thái filter
    const filteredBookings = bookings.filter((booking) => {
        if (filter === "Tất cả") return true;
        if (filter === "Chưa Thanh Toán") return booking.InvoiceStatus === "Chưa thanh toán";
        if (filter === "Đã Thanh Toán") return booking.InvoiceStatus === "Đã thanh toán";
        return true;
    });

    return (
        <div className="admin-layout">
            <NavbarAdmin />
            <div className="top-bar-admin">
                <Account />
            </div>

            <div className="room-manager-content">
                <h1>Danh Sách Hóa Đơn</h1>

                {/* Nhóm nút chuyển đổi */}
                <div className="button-group-invoice">
                    <button
                        className={`btn-checkin-out ${filter === "Tất cả" ? "active" : ""}`}
                        onClick={() => setFilter("Tất cả")}
                    >
                        Tất Cả
                    </button>
                    <button
                        className={`btn-checkin-out ${filter === "Chưa Thanh Toán" ? "active" : ""}`}
                        onClick={() => setFilter("Chưa Thanh Toán")}
                    >
                        Chưa Thanh Toán
                    </button>
                    <button
                        className={`btn-checkin-out ${filter === "Đã Thanh Toán" ? "active" : ""}`}
                        onClick={() => setFilter("Đã Thanh Toán")}
                    >
                        Đã Thanh Toán
                    </button>
                </div>

                {/* Hiển thị danh sách hóa đơn */}
                {loading ? (
                    <p>Đang tải dữ liệu...</p>
                ) : (
                    <table className="booking-table">
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
                            {filteredBookings.length > 0 ? (
                                filteredBookings.map((booking) => (
                                    <tr key={booking._id}>
                                        <td>{booking.BookingCode}</td>
                                        <td>{booking.Room?.NameRoom || "N/A"}</td>
                                        <td>{booking.User?.name || "N/A"}</td>
                                        <td>{booking.InvoiceStatus}</td>
                                        <td>
                                            {booking.PaymentDate
                                                ? new Date(booking.PaymentDate).toLocaleString()
                                                : "N/A"}
                                        </td>
                                        <td>
                                            <Link
                                                to={`/invoiceadmin/${booking._id}`}
                                                className="btn-detail-booking"
                                            >
                                                Xem Chi Tiết
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-2 px-4 border text-center">
                                        Không có dữ liệu đặt phòng.
                                    </td>
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