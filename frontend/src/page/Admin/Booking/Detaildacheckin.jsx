import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import NavbarAdmin from '../../../components/Navbar/NavbarAdmin';
import Account from '../../../components/Account/Account';

import './BookingAdmin.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookingDetails = () => {
    const { id } = useParams(); // Lấy id của booking từ URL
    const [booking, setBooking] = useState(null);
    const [showCheckoutForm, setShowCheckoutForm] = useState(false);
    const [damageFee, setDamageFee] = useState(0);
    const [notes, setNotes] = useState('');
    const navigate = useNavigate();

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

    // Hàm để xác nhận checkout
    const handleCheckout = async () => {
        if (Number(damageFee) < 0) {
            toast.error("Vui lòng nhập số tiền hợp lệ");
            return;
        }

        try {
            const response = await fetch(`http://localhost:4000/booking/bookings/${id}/checkout`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ damageFee, notes }),
            });

            const data = await response.json();
            if (response.ok) {
                setBooking(data); // Cập nhật thông tin booking sau khi checkout
                setShowCheckoutForm(false); // Ẩn form
                toast.success('Trả phòng thành công!');
                // Đợi 2 giây để toast hiển thị xong trước khi điều hướng
                await new Promise(resolve => setTimeout(resolve, 2000)); 
                navigate('/homeadmin'); // Điều hướng sau khi toast hiển thị
            } else {
                toast.error(data.message || 'Có lỗi xảy ra khi trả phòng.');
            }
        } catch (error) {
            console.error('Lỗi khi xác nhận checkout:', error);
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
                            <td><strong>Tên Khách Hàng:</strong></td>
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
                <div className='btn-content'>
                    {/* Nút checkout */}
                    <button
                        className="btn-booking-admin"
                        onClick={() => setShowCheckoutForm(true)}
                    >
                        Trả Phòng
                    </button>
                </div>
                {/* Form checkout */}
                {showCheckoutForm && (
                    <div className="mt-4 p-4 border rounded">
                        <h3 className="text-lg font-semibold">Checkout</h3>
                        <div>
                            <label className="block mb-2">Giá Thiệt Hại:</label>
                            <input
                                type="number"
                                value={damageFee}
                                onChange={(e) => setDamageFee(e.target.value)}
                                className="border rounded p-2 mb-4 w-full"
                                placeholder="Nhập giá thiệt hại"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Ghi Chú:</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="border rounded p-2 mb-4 w-full"
                                placeholder="Nhập ghi chú"
                            />
                        </div>
                        <button
                            className="bg-green-500 text-white py-2 px-4 rounded"
                            onClick={handleCheckout}
                        >
                            Xác Nhận
                        </button>
                        <button
                            className="ml-2 bg-gray-500 text-white py-2 px-4 rounded"
                            onClick={() => setShowCheckoutForm(false)}
                        >
                            Hủy
                        </button>
                    </div>
                )}
                {/* Toast Container */}
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
            </div>
        </div>
    );
};

export default BookingDetails;
