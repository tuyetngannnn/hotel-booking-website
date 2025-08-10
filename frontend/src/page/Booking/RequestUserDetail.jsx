// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import NavBarHistory from '../../components/Navbar/NavbarHistory';

import './List_DetailBooking.css'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookingDetails = () => {
    const { id } = useParams(); // Lấy id của booking từ URL
    const [bookingyc, setBookingyc] = useState(null);
    const navigate = useNavigate(); // Để điều hướng trang

    useEffect(() => {
        fetchBookingDetails();
    }, []);

    // Lấy chi tiết booking từ server
    const fetchBookingDetails = async () => {
        try {
            const response = await fetch(`http://localhost:4000/serviceRequests/getdetail/${id}`);
            const data = await response.json();
            setBookingyc(data);
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết đặt phòng:', error);
        }
    };

    // Xử lý hủy yêu cầu
    const handleCancelBooking = async () => {
        try {
            const response = await fetch(`http://localhost:4000/serviceRequests/${id}/cancel1`, {
                method: 'DELETE', // Phương thức DELETE để hủy yêu cầu
            });
    
            if (response.ok) {
                toast.success('Yêu cầu đã được hủy thành công!');
                // Thực hiện delay 3 giây (3000ms) trước khi điều hướng
                setTimeout(() => {
                    navigate('/history/bookingycuser'); // Điều hướng về danh sách yêu cầu chưa xác nhận
                }, 3000); // Thời gian delay 3 giây
            } else {
                toast.error('Đã có lỗi xảy ra khi hủy yêu cầu.');
            }
        } catch (error) {
            console.error('Lỗi khi hủy yêu cầu:', error);
        }
    };

    if (!bookingyc) {
        return <div>Đang tải...</div>; // Hiển thị khi đang tải dữ liệu
    }

    return (
        <div>
            <Navbar />
            <div className="body-user-listbooking">
                <NavBarHistory />
                <div className="booking-user-list">
                    <h1>Chi Tiết Yêu Cầu Đặt Thêm</h1>
                    <table className="booking-table-user-detail">
                        <tbody>
                            <tr>
                                <td><strong>Mã Đặt Phòng:</strong></td>
                                <td>{bookingyc.BookingCode}</td>
                            </tr>
                            <tr>
                                <td><strong>Email:</strong></td>
                                <td>{bookingyc.User?.name}</td>
                            </tr>
                            <tr>
                                <td><strong>Dịch Vụ:</strong></td>
                                <td>{bookingyc.Services?.map(service => service.Nameservices).join(', ') || 'Không có dịch vụ'}</td>
                            </tr>
                            <tr>
                                <td><strong>Thiết Bị:</strong></td>
                                <td>{bookingyc.Equipment?.map(equip => equip.NameEquiment).join(', ') || 'Không có thiết bị'}</td>
                            </tr>
                            <tr>
                                <td><strong>Trạng Thái:</strong></td>
                                <td>{bookingyc.Status}</td>
                            </tr>
                            <tr>
                                <td><strong>Giá Tổng:</strong></td>
                                <td>{bookingyc.Status.toLocaleString('vi-VN')}</td>
                            </tr>
                            <tr>
                                <td><strong>Ngày Đặt:</strong></td>
                                <td>{new Date(bookingyc.CreatedAt).toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="btn-content-user">
                        {/* Hiển thị nút hủy nếu trạng thái là 'Chưa xác nhận' */}
                        {bookingyc.Status === 'Chưa xác nhận' && (
                            <button
                                onClick={handleCancelBooking}
                                className="btn-huy-detail-user"
                            >
                                Hủy Yêu Cầu
                            </button>
                        )}
                    </div>
                </div>
                <ToastContainer/>
            </div>
            <Footer />
        </div>
    );
};

export default BookingDetails;
