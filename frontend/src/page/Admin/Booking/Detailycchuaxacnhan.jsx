// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import NavbarAdmin from '../../../components/Navbar/NavbarAdmin';
import Account from '../../../components/Account/Account';

import './BookingAdmin.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookingDetails = () => {
    const { id } = useParams(); // Lấy id của booking từ URL
    const [bookingyc, setBookingyc] = useState(null);
    const navigate = useNavigate();

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

    // Xác nhận yêu cầu dịch vụ
    const handleAcceptRequest = async () => {
        try {
            const response = await fetch(`http://localhost:4000/serviceRequests/${id}/accept`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            if (response.ok) {
                toast.success('Yêu cầu đã được xác nhận.');

                setBookingyc(result.request); // Cập nhật trạng thái mới vào UI

                // Dùng setTimeout để trì hoãn điều hướng
                setTimeout(() => {
                    navigate('/homeadmin'); // Điều hướng sau 2 giây (2000ms)
                }, 2000); // 2 giây delay
            } else {
                toast.error(result.message || 'Lỗi khi xác nhận yêu cầu.');
            }
        } catch (error) {
            console.error('Lỗi khi xác nhận yêu cầu:', error);
            toast.warning('Đã xảy ra lỗi khi xác nhận yêu cầu.');
        }
    };

    // Hủy yêu cầu dịch vụ
    const handleCancelRequest = async () => {
        try {
            const response = await fetch(`http://localhost:4000/serviceRequests/${id}/cancel`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            if (response.ok) {
                toast.success('Yêu cầu đã bị hủy.');

                setBookingyc(result.request); // Cập nhật trạng thái mới vào UI

                // Dùng setTimeout để trì hoãn điều hướng
                setTimeout(() => {
                    navigate('/serviceRequests'); // Điều hướng sau 2 giây (2000ms)
                }, 2000); // 2 giây delay
            } else {
                toast.error(result.message || 'Lỗi khi hủy yêu cầu.');
            }
        } catch (error) {
            console.error('Lỗi khi hủy yêu cầu:', error);
            toast.warning('Đã xảy ra lỗi khi hủy yêu cầu.');
        }
    };

    if (!bookingyc) {
        return <div>Đang tải...</div>; // Hiển thị khi đang tải dữ liệu
    }

    return (
        <div className="admin-layout">
            <NavbarAdmin />

            <div className="top-bar-admin">
                <Account />
            </div>
            <div className="room-manager-content">
                <h1>Chi Tiết Yêu Cầu Đặt Thêm</h1>
                <table className="booking-detail-table">
                    <tbody>
                        <tr>
                            <td><strong>Mã Đặt Phòng:</strong></td>
                            <td>{bookingyc.BookingCode}</td>
                        </tr>
                        <tr>
                            <td><strong>Email:</strong></td>
                            <td>{bookingyc.User?.email}</td>
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
                            <td>{bookingyc.TotalAmount.toLocaleString('vi-VN')} VND</td>
                        </tr>
                        <tr>
                            <td><strong>Ngày Đặt:</strong></td>
                            <td>{new Date(bookingyc.CreatedAt).toLocaleString()}</td>
                        </tr>
                    </tbody>
                </table>
                {/* Nút xác nhận yêu cầu */}
                <div className="btn-content">
                    <button
                        onClick={handleAcceptRequest}
                        className="btn-xacnhan-detail-admin"
                        disabled={bookingyc.Status === 'Xác Nhận'}
                    >
                        {bookingyc.Status === 'Xác Nhận' ? 'Đã Xác Nhận' : 'Xác Nhận Yêu Cầu'}
                    </button>

                    {/* Nút hủy yêu cầu */}
                    <button
                        onClick={handleCancelRequest}
                        className="btn-huy-detail-admin"
                        disabled={bookingyc.Status === 'Hủy'}
                    >
                        {bookingyc.Status === 'Hủy' ? 'Đã Hủy' : 'Hủy Yêu Cầu'}
                    </button>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default BookingDetails;
