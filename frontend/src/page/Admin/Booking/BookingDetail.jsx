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
    const navigate = useNavigate(); // Khai báo useNavigate
    const [booking, setBooking] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Trạng thái loading khi cập nhật
    const [canConfirm, setCanConfirm] = useState(false); // Trạng thái cho phép xác nhận

    useEffect(() => {
        fetchBookingDetails();
    }, []);

    // Lấy chi tiết booking từ server
    const fetchBookingDetails = async () => {
        try {
            const response = await fetch(`http://localhost:4000/booking/bookings/${id}`);
            const data = await response.json();
            setBooking(data);
            checkCanConfirm(data.CheckInDate); // Kiểm tra xem có thể xác nhận không

            // Tự động hủy nếu cần
            autoCancelIfNeeded(data);
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết đặt phòng:', error);
        }
    };

    // Hàm kiểm tra xem có thể xác nhận hay không (trong vòng 30 phút kể từ hiện tại)
    const checkCanConfirm = (checkInDateTime) => {
        const currentDateTime = new Date(); // Ngày giờ hiện tại
        const checkInTime = new Date(checkInDateTime); // Ngày giờ nhận phòng

        // Tính sự chênh lệch giữa ngày nhận phòng và ngày hiện tại
        const diffInMinutes = (checkInTime - currentDateTime) / (1000 * 60); // Đổi ra phút

        // Cho phép xác nhận nếu chênh lệch <= 30 phút và > 0 (tương lai)
        setCanConfirm(diffInMinutes >= 30);
    };

    // Hàm tự động hủy nếu thời gian đặt còn ít hơn 30 phút và chưa xác nhận
    const autoCancelIfNeeded = (bookingData) => {
        const currentDateTime = new Date();
        const checkInTime = new Date(bookingData.CheckInDate);

        const diffInMinutes = (checkInTime - currentDateTime) / (1000 * 60);

        // Nếu còn ít hơn 30 phút và trạng thái chưa được xác nhận
        if (diffInMinutes <= 30 && bookingData.Status !== 'Xác nhận') {
            updateBookingStatus('Hủy');
        }
    };

    // Hàm cập nhật trạng thái đặt phòng
    const updateBookingStatus = async (newStatus) => {
        try {
            setIsLoading(true); // Bắt đầu quá trình cập nhật
            const response = await fetch(`http://localhost:4000/booking/bookings/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }), // Trạng thái mới được gửi đến server
            });

            if (response.ok) {
                const updatedBooking = await response.json();
                setBooking(updatedBooking); // Cập nhật trạng thái mới sau khi thay đổi
                checkCanConfirm(updatedBooking.CheckInDate); // Kiểm tra lại khi cập nhật trạng thái
                // Gửi email cho người dùng (bước này đã được thực hiện trên server)

                // Hiển thị thông báo thành công dựa trên trạng thái
                if (newStatus === 'Xác nhận') {
                    await toast.success("Xác nhận phòng thành công.");
                } else if (newStatus === 'Hủy') {
                    await toast.success("Đã hủy phòng thành công.");
                }

                // Chuyển hướng về trang đặt phòng
                setTimeout(() => navigate('/homeadmin'), 1000);
            } else {
                console.error('Lỗi khi cập nhật trạng thái đặt phòng');
                toast.error("Cập nhật trạng thái không thành công.");
            }
        } catch (error) {
            console.error('Lỗi:', error);
            toast.error("Đã xảy ra lỗi khi cập nhật trạng thái.");
        } finally {
            setIsLoading(false); // Kết thúc quá trình cập nhật
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

                {/* Nút Xác Nhận và Hủy */}
                <div className="btn-content">
                    {/* Hiển thị nút "Xác nhận" nếu trạng thái không phải là "Xác nhận" và trong vòng 30 phút */}
                    {booking.Status !== 'Xác nhận' && canConfirm && (
                        <button
                            className="btn-xacnhan-detail-admin"
                            onClick={() => updateBookingStatus('Xác nhận')}
                            disabled={isLoading} // Disable nút khi đang loading
                        >
                            {isLoading ? 'Đang xử lý...' : 'Xác nhận'}
                        </button>
                    )}
                    {/* Hiển thị nút "Hủy" nếu trạng thái không phải là "Hủy" */}
                    {booking.Status !== 'Hủy' && (
                        <button
                            className="btn-huy-detail-admin"
                            onClick={() => updateBookingStatus('Hủy')}
                            disabled={isLoading} // Disable nút khi đang loading
                        >
                            {isLoading ? 'Đang xử lý...' : 'Hủy'}
                        </button>
                    )}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default BookingDetails;
