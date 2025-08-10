// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';

// eslint-disable-next-line no-unused-vars
import { FaEdit, FaTrash, FaTimes } from 'react-icons/fa'; // Importing icons

import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import NavBarHistory from '../../components/Navbar/NavbarHistory';

import './List_DetailBooking.css'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookingDetails = () => {
    const { id } = useParams();
    const [booking, setBooking] = useState(null);
    const [services, setServices] = useState([]);
    const [equipment, setEquipment] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedEquipment, setSelectedEquipment] = useState([]);
    // const [bookingCode, setBookingCode] = useState('');
    const [userId, setUserId] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const bookingResponse = await fetch(`http://localhost:4000/booking/bookings/${id}`);
                const bookingData = await bookingResponse.json();
                setBooking(bookingData);

                const servicesResponse = await axios.get('http://localhost:4000/hotelservices/getallservices1');
                setServices(servicesResponse.data.hotelservices || []);

                const equipmentResponse = await axios.get('http://localhost:4000/equipment/getallEquipment1');
                setEquipment(equipmentResponse.data.equipment || []);

                const storedUserId = localStorage.getItem('userId');
                setUserId(storedUserId);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        if (booking) {
            const totalServicesPrice = selectedServices.reduce((total, service) => total + service.Priceservices, 0);
            const totalEquipmentPrice = selectedEquipment.reduce((total, equip) => total + equip.PriceEquipment, 0);
            const numberOfNights = calculateNights(booking.CheckInDate, booking.CheckOutDate);
            const newTotalPrice = (totalServicesPrice + totalEquipmentPrice) * numberOfNights;
            setTotalPrice(newTotalPrice);
        }
    }, [selectedServices, selectedEquipment, booking]);

    const calculateNights = (checkIn, checkOut) => {
        if (!checkIn || !checkOut) return 0;
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const timeDifference = checkOutDate - checkInDate;
        const days = Math.ceil(timeDifference / (1000 * 3600 * 24));
        return days > 0 ? days : 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Gửi yêu cầu đến API
        try {
            await axios.post('http://localhost:4000/serviceRequests/create', {
                BookingCode: booking.BookingCode,
                User: userId,
                Services: selectedServices.map(service => service._id),
                Equipment: selectedEquipment.map(equip => equip._id),
                TotalAmount: totalPrice
            });
            // Chuyển hướng sau khi gửi thành công
            navigate(`/history/bookingsuser`);
        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu:', error);
        }
    };

    const handleCancelBooking = async () => {
        if (window.confirm("Bạn có chắc chắn muốn hủy đặt phòng này?")) {
            try {
                const response = await fetch(`http://localhost:4000/booking/bookings/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    toast.success('Đặt phòng đã được hủy thành công.');
                    navigate('/history/bookingsuser');
                } else {
                    const errorData = await response.json();
                    toast.error(`Lỗi: ${errorData.message}`);
                }
            } catch (error) {
                console.error('Lỗi khi hủy đặt phòng:', error);
                toast.success('Đã xảy ra lỗi khi hủy đặt phòng.');
            }
        }
    };

    if (isLoading) {
        return <div>Đang tải...</div>;
    }

    if (!booking) {
        return <div>Không tìm thấy đặt phòng.</div>;
    }
    // Lọc dịch vụ và thiết bị đã chọn từ trước
    const bookedServiceIds = booking.Services.map(service => service._id);
    const bookedEquipmentIds = booking.Equipment.map(equip => equip._id);

    const availableServices = services.filter(service => !bookedServiceIds.includes(service._id));
    const availableEquipment = equipment.filter(equip => !bookedEquipmentIds.includes(equip._id));

    return (
        <div>
            <Navbar />
            <div className="body-user-listbooking">
                <NavBarHistory />
                <div className="booking-user-list">
                    <h1>Chi Tiết Đặt Phòng</h1>
                    <table className="booking-table-user-detail">
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
                                <td><strong>Giá Dịch vụ:</strong></td>
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

                            {booking.Status === 'Check out' && (
                                <>
                                    <tr>
                                        <td><strong>Chi phí phát sinh:</strong></td>
                                        <td>{booking.DamageFee.toLocaleString('vi-VN')} VND</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Ghi chú:</strong></td>
                                        <td>{booking.Notes}</td>
                                    </tr>
                                </>
                            )}
                            {booking.Status === 'Check in' && (
                                <div className="mt-8">
                                    {/* Modal */}
                                    <Modal
                                        isOpen={isModalOpen}
                                        onRequestClose={() => setIsModalOpen(false)}
                                        className="modal-content"
                                        overlayClassName="modal-overlay"
                                    >
                                        <button onClick={() => setIsModalOpen(false)} className="close-icon">
                                            <FaTimes />
                                        </button>
                                        <h2 className="modal-title">Chọn Dịch Vụ và Thiết Bị</h2>
                                        <form>
                                            <div className="services-booking">
                                                <label className="label-text">Thiết bị:</label>
                                                {availableEquipment.length > 0 ? (
                                                    availableEquipment.map((equip) => {
                                                        const isChecked = selectedEquipment.some(
                                                            (selected) => selected._id === equip._id
                                                        );

                                                        return (
                                                            <ul
                                                                key={equip._id}
                                                                onClick={() => {
                                                                    if (isChecked) {
                                                                        setSelectedEquipment((prev) =>
                                                                            prev.filter((item) => item._id !== equip._id)
                                                                        );
                                                                    } else {
                                                                        setSelectedEquipment((prev) => [...prev, equip]);
                                                                    }
                                                                }}
                                                                className={isChecked ? "selected" : ""}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    value={equip._id}
                                                                    checked={isChecked}
                                                                    readOnly // Không cho phép thay đổi trực tiếp từ checkbox
                                                                />
                                                                <span className="equipment-name">
                                                                    {equip.NameEquiment}
                                                                </span>
                                                                <span className="equipment-price">
                                                                    {equip.PriceEquipment} VND
                                                                </span>
                                                            </ul>
                                                        );
                                                    })
                                                ) : (
                                                    <p>Không có thiết bị</p>
                                                )}

                                                {/* Đường line với khoảng trắng ở giữa */}
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        margin: "16px 0",
                                                    }}
                                                ></div>

                                                <label className="label-text">Dịch vụ:</label>
                                                {availableServices.length > 0 ? (
                                                    availableServices.map((service) => {
                                                        const isChecked = selectedServices.some(
                                                            (selected) => selected._id === service._id
                                                        );

                                                        return (
                                                            <ul
                                                                key={service._id}
                                                                onClick={() => {
                                                                    if (isChecked) {
                                                                        setSelectedServices((prev) =>
                                                                            prev.filter((item) => item._id !== service._id)
                                                                        );
                                                                    } else {
                                                                        setSelectedServices((prev) => [...prev, service]);
                                                                    }
                                                                }}
                                                                className={isChecked ? "selected" : ""}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    value={service._id}
                                                                    checked={isChecked}
                                                                    readOnly // Không cho phép thay đổi trực tiếp từ checkbox
                                                                />
                                                                <span className="service-name">
                                                                    {service.Nameservices}
                                                                </span>
                                                                <span className="service-price">
                                                                    {service.Priceservices} VND
                                                                </span>
                                                            </ul>
                                                        );
                                                    })
                                                ) : (
                                                    <p>Không có dịch vụ</p>
                                                )}

                                                {/* Đường line với khoảng trắng ở giữa */}
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        margin: "16px 0",
                                                    }}
                                                ></div>

                                                <label className="label-text">
                                                    Tổng Giá: <span style={{ color: '#EFD099', fontSize: '20px', fontWeight: 'bold' }}>{totalPrice} VND</span>
                                                </label>

                                                <div className="btn-content-user">
                                                    <button
                                                        className="modal-submit-button"
                                                        onClick={handleSubmit}
                                                    >
                                                        Gửi Yêu Cầu
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </Modal>
                                    {/* Nút để mở Modal */}
                                    <div className='btn-content-user'>
                                        <button
                                            className="btn-booking-yc"
                                            onClick={() => setIsModalOpen(true)}
                                        >
                                            Yêu Cầu Thêm Dịch Vụ
                                        </button>
                                    </div>
                                </div>
                            )}

                            {booking.Status === 'Chưa xác nhận' && (
                                <button
                                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                                    onClick={handleCancelBooking}
                                >
                                    Hủy đặt phòng
                                </button>
                            )}

                        </tbody>
                    </table>
                </div>
            </div>
            <Footer />
            <ToastContainer />
        </div >
    );
};
export default BookingDetails;
