// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Navbar from '../../components/Navbar/Navbar';
import NavBarHistory from '../../components/Navbar/NavbarHistory';
import Footer from '../../components/Footer/Footer';

import './List_DetailBooking.css'

const PendingServiceRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, []);

    useEffect(() => {
        const fetchPendingRequests = async () => {
            if (!userId) return;

            try {
                const response = await fetch(`http://localhost:4000/serviceRequests/get/${userId}`);
                if (!response.ok) {
                    throw new Error('Lỗi khi lấy dữ liệu yêu cầu');
                }
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
    }, [userId]); // Thêm userId vào mảng phụ thuộc

    return (
        <div>
            <Navbar />
            <div className="body-user-listbooking">
                <NavBarHistory />
                <div className="booking-user-list">
                    <h1>Danh Sách Yêu Cầu</h1>
                    {loading ? (
                        <p>Đang tải dữ liệu...</p> // Hiển thị khi đang tải dữ liệu
                    ) : (
                        <table className="booking-table-user">
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
                                                <Link to={`/history/bookingsycuser/${request._id}`} className="btn-detail-booking-user">
                                                    Xem Chi Tiết
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-2 px-4 border text-center">Không có yêu cầu chưa xác nhận.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default PendingServiceRequests;
