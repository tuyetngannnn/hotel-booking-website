// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import NavbarAdmin from '../../../components/Navbar/NavbarAdmin';
import Account from '../../../components/Account/Account';

import './BookingAdmin.css'

const BookingDetails = () => {
    const { id } = useParams(); // Lấy id của booking từ URL
    const [bookingyc, setBookingyc] = useState(null);
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
                            <td>{new Date(bookingyc.CreatedAt).toLocaleString()} VND</td>
                        </tr>
                        <p><strong>Mã Đặt Phòng:</strong> {bookingyc.BookingCode}</p>
                        <p><strong>Email:</strong> {bookingyc.User?.name}</p>
                        <p><strong>Dịch Vụ:</strong> {bookingyc.Services?.map(service => service.Nameservices).join(', ') || 'Không có dịch vụ'}</p>
                        <p><strong>Thiết Bị:</strong> {bookingyc.Equipment?.map(equip => equip.NameEquiment).join(', ') || 'Không có thiết bị'}</p>
                        <p><strong>Trạng Thái:</strong> {bookingyc.Status}</p>
                        <p><strong>Giá Tổng:</strong> {bookingyc.TotalAmount.toLocaleString('vi-VN')} VND</p>
                        <p><strong>Ngày Đặt:</strong> {new Date(bookingyc.CreatedAt).toLocaleString()}</p>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BookingDetails;
