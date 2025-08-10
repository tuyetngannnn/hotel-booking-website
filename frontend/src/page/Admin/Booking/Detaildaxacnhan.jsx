// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import NavbarAdmin from '../../../components/Navbar/NavbarAdmin';
import Account from '../../../components/Account/Account';

import './BookingAdmin.css'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookingDetails = () => {
    const { id } = useParams(); // Lấy id của booking từ URL
    const navigate = useNavigate(); // Hook điều hướng
    const [booking, setBooking] = useState(null);

    useEffect(() => {
        fetchBookingDetails();
    }, []);

    // Lấy chi tiết booking từ server
    const fetchBookingDetails = async () => {
        try {
            const response = await fetch(`http://localhost:4000/booking/bookings/${id}`);
            const data = await response.json();
            setBooking(data);
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết đặt phòng:', error);
        }
    };

    // Hàm để cập nhật trạng thái booking thành "Check In"
    const handleCheckIn = async () => {
        try {
            const response = await fetch(`http://localhost:4000/booking/bookings/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'Check in' }), // Trạng thái mới
            });
            if (response.ok) {
                const updatedBooking = await response.json();
                setBooking(updatedBooking); // Cập nhật booking mới
                toast.success('Nhận phòng thành công');

                // Chờ 3 giây trước khi điều hướng
                setTimeout(() => {
                    navigate('/homeadmin');
                }, 3000); // Thời gian chờ 3000ms (3 giây)
            } else {
                throw new Error('Lỗi khi cập nhật trạng thái đặt phòng.');
            }
        } catch (error) {
            console.error('Lỗi khi check in:', error);
        }
    };

    if (!booking) {
        return <div>Đang tải...</div>; // Hiển thị khi đang tải dữ liệu
    }

    return (
        <div className="admin-layout">
            <NavbarAdmin />

            <div className="top-bar-admin">
                <Account />
            </div>
            <div className="room-manager-content">
                <h1>Chi Tiết Đặt Phòng</h1>
                <table className="booking-detail-table">
                    <tbody>
                        <tr>
                            <td><strong>Mã Đặt Phòng:</strong></td>
                            <td>{booking.BookingCode}</td>
                        </tr>
                        <tr>
                            <td><strong>Tên khách hàng:</strong></td>
                            <td>{booking.User?.name}</td>
                        </tr>
                        <tr>
                            <td><strong>Email:</strong></td>
                            <td>{booking.User?.email}</td>
                        </tr>
                        <tr>
                            <td><strong>Tên Phòng:</strong></td>
                            <td>{booking.Room?.NameRoom || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td><strong>Số Phòng:</strong></td>
                            <td>{booking.Room?.NumberofRoom || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td><strong>Loại Phòng:</strong></td>
                            <td>{booking.RoomType?.NameRoomtype || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td><strong>Chi Nhánh:</strong></td>
                            <td>{booking.Branch?.branchname || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td><strong>Số Người:</strong></td>
                            <td>{booking.NumberOfPeople}</td>
                        </tr>
                        <tr>
                            <td><strong>Dịch Vụ:</strong></td>
                            <td>{booking.Services?.map(service => service.Nameservices).join(', ') || 'Không có dịch vụ'}</td>
                        </tr>
                        <tr>
                            <td><strong>Thiết Bị:</strong></td>
                            <td>{booking.Equipment?.map(equip => equip.NameEquiment).join(', ') || 'Không có thiết bị'}</td>
                        </tr>
                        <tr>
                            <td><strong>Địa Chỉ:</strong></td>
                            <td>{booking.Address}</td>
                        </tr>
                        <tr>
                            <td><strong>Số Điện Thoại:</strong></td>
                            <td>{booking.PhoneNumber}</td>
                        </tr>
                        <tr>
                            <td><strong>Trạng Thái:</strong></td>
                            <td>{booking.Status}</td>
                        </tr>
                        <tr>
                            <td><strong>Giá Tổng:</strong></td>
                            <td>{booking.TotalPrice.toLocaleString('vi-VN')} VND</td>
                        </tr>
                        <tr>
                            <td><strong>Ngày Nhận Phòng:</strong></td>
                            <td>{new Date(booking.CheckInDate).toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td><strong>Ngày Trả Phòng:</strong></td>
                            <td>{new Date(booking.CheckOutDate).toLocaleString()}</td>
                        </tr>
                    </tbody>
                </table>
                <div className="btn-content">
                    {booking.Status !== 'Check In' && (
                        <button
                            className="btn-booking-admin"
                            onClick={handleCheckIn}
                        >
                            Nhận phòng
                        </button>
                    )}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default BookingDetails;