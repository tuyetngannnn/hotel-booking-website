// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import NavbarAdmin from '../../../components/Navbar/NavbarAdmin';
import Account from '../../../components/Account/Account';

import './BookingAdmin.css'

const BookingDetails = () => {
    const { id } = useParams(); // Lấy id của booking từ URL
    const [booking, setBooking] = useState(null);
    const [tongtien, settongtien] = useState(0);
    const navigate = useNavigate();
    useEffect(() => {
        fetchBookingDetails();
    }, []);
    useEffect(() => {
        if (booking) {
            const tt = (booking.DamageFee || 0) + (booking.TotalPrice || 0);
            settongtien(tt);
        }
    }, [booking]);
    const handleConfirmPayment = async () => {
        try {
            const response = await fetch(`http://localhost:4000/booking/bookings/${id}/confirm-payment`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ invoiceStatus: 'Đã thanh toán' }), // Trạng thái mới
            });
            if (response.ok) {
                const updatedBooking = await response.json();
                setBooking(updatedBooking); // Cập nhật booking mới
                alert('Thanh toán thành công');
                navigate('/invoiceadmin');
            } else {
                throw new Error('Lỗi khi cập nhật trạng thái hóa đơn.');
            }
        } catch (error) {
            console.error('Lỗi khi khi xác nhận thanh toán:', error);
        }
    };
    const formatCurrency = (value) => {
        return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };
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
                <h1>Chi Tiết Hóa Đơn</h1>
                <table className="booking-detail-table">
                    <tbody>
                        <tr>
                            <td><strong>Mã hóa đơn:</strong></td>
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
                            <td>{booking.InvoiceStatus}</td>
                        </tr>
                        <tr>
                            <td><strong>Số Điện Thoại:</strong></td>
                            <td>{booking.PhoneNumber}</td>
                        </tr>
                        <tr>
                            <td><strong>Ngày thanh toán:</strong></td>
                            <td>
                                {booking.InvoiceStatus !== 'Chưa thanh toán' && (
                                    <>{new Date(booking.PaymentDate).toLocaleString()}</>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td><strong>Giá Tổng:</strong></td>
                            <td>{booking.TotalPrice.toLocaleString('vi-VN')} VND</td>
                        </tr>
                        <tr>
                            <td><strong>Ghi Chú:</strong></td>
                            <td>{booking.Notes}</td>
                        </tr>
                        <tr>
                            <td><strong>Chi phí phát sinh:</strong></td>
                            <td>{booking.DamageFee.toLocaleString('vi-VN')} VND</td>
                        </tr>
                        <tr>
                            <td><strong>Tổng tiền:</strong></td>
                            <td>{tongtien.toLocaleString('vi-VN')} VND</td>
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
                {booking.InvoiceStatus === 'Chưa thanh toán' && (
                    <>
                        <div className="btn-content">
                            <button
                                onClick={handleConfirmPayment}
                                className="btn-booking-admin"
                            >
                                Xác nhận thanh toán
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default BookingDetails;


