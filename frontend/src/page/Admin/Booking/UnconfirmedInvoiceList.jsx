// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


const BookingList = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
   
    useEffect(() => { // Kiểm tra nếu userId tồn tại trước khi gọi API


        const fetchBookings = async () => {
            try {
                const response = await fetch(`http://localhost:4000/booking/invoice1`);
                const data = await response.json();
                console.log("Dữ liệu API trả về:", data); // Kiểm tra dữ liệu trả về
                setBookings(data); // Giả sử data là mảng bookings
            } catch (error) {
                console.error('Lỗi khi lấy danh sách đặt phòng:', error);
            } finally {
                setLoading(false); // Dừng trạng thái loading
            }
        };


        fetchBookings();
    }, []); // Thêm userId vào danh sách phụ thuộc
    return (
        <div className="container mx-auto py-10">
            <h2 className="text-2xl font-bold mb-8 text-center">Danh Sách Hóa Đơn Chưa Thanh Toán</h2>
            {loading ? (
                <p>Đang tải dữ liệu...</p> // Hiển thị khi đang tải dữ liệu
            ) : (
                <table className="min-w-full bg-white border rounded-lg">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border">Mã Hóa Đơn</th>
                            <th className="py-2 px-4 border">Tên Phòng</th>
                            <th className="py-2 px-4 border">Tên khách hàng</th>
                            <th className="py-2 px-4 border">Trạng Thái Hóa đơn</th>
                            <th className="py-2 px-4 border">Ngày thanh toán</th>
                            <th className="py-2 px-4 border">Chi Tiết</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.length > 0 ? (
                            bookings.map((booking) => (
                                <tr key={booking._id}>
                                    <td className="py-2 px-4 border text-center">{booking.BookingCode}</td>
                                    <td className="py-2 px-4 border text-center">{booking.Room?.NameRoom || 'N/A'}</td>
                                    <td className="py-2 px-4 border text-center">{booking.User?.name || 'N/A'}</td>
                                    <td className="py-2 px-4 border text-center">{booking.InvoiceStatus}</td>
                                    <td className="py-2 px-4 border text-center">
                                        {booking.PaymentDate ? new Date(booking.PaymentDate).toLocaleString() : 'N/A'}
                                    </td>
                                    <td className="py-2 px-4 border text-center">
                                        <Link to={`/invoiceadmin/${booking._id}`} className="bg-yellow-500 text-white py-1 px-3 rounded">
                                            Xem Chi Tiết
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="py-2 px-4 border text-center">Không có dữ liệu đặt phòng.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};
export default BookingList;



