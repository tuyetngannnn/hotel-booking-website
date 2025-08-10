// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import NavbarAdmin from '../../../components/Navbar/NavbarAdmin';
import Account from '../../../components/Account/Account';

import './BookingAdmin.css'

const PendingServiceRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPendingRequests = async () => {
            try {
                const response = await fetch('http://localhost:4000/serviceRequests/get1');
                const data = await response.json();
                console.log("Dữ liệu API trả về:", data); // Kiểm tra dữ liệu trả về
                setRequests(data); // Giả sử data là mảng các yêu cầu
            } catch (error) {
                console.error('Lỗi khi lấy danh sách yêu cầu chưa xác nhận:', error);
            } finally {
                setLoading(false); // Dừng trạng thái loading
            }
        };

        fetchPendingRequests();
    }, []);

    return (
        <div className="admin-layout">
            <NavbarAdmin />

            <div className="top-bar-admin">
                <Account />
            </div>
            <div className="room-manager-content">
                <h1>Danh Sách Yêu Cầu Chưa Xác Nhận</h1>
                {loading ? (
                    <p>Đang tải dữ liệu...</p> // Hiển thị khi đang tải dữ liệu
                ) : (
                    <table className="booking-table">
                        <thead>
                            <tr>
                                <th>Mã Yêu Cầu</th>
                                <th>Tên Khách Hàng</th>
                                <th>Trạng thái</th>
                                <th>Ngày Yêu Cầu</th>
                                <th>Chi Tiết</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.length > 0 ? (
                                requests.map((request) => (
                                    <tr key={request._id}>
                                        <td>{request.BookingCode}</td>
                                        <td>{request.User.name}</td>
                                        <td>{request.Status}</td>
                                        <td>
                                            {request.CreatedAt ? new Date(request.CreatedAt).toLocaleString() : 'N/A'}
                                        </td>
                                        <td>
                                            <Link to={`/bookingsyc/${request._id}`} className="btn-detail-booking">
                                                Xem Chi Tiết
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-2 px-4 border text-center">Không có yêu cầu chưa xác nhận.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default PendingServiceRequests;
