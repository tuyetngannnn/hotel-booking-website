import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaBed, FaCheckCircle, FaTimesCircle, FaSignInAlt, FaSignOutAlt, FaCalendarTimes, FaConciergeBell } from 'react-icons/fa';

import NavbarLeTan from '../../../components/Navbar/NavbarLeTan';
import Account from '../../../components/Account/Account';

import './HomeLeTan.css'

const HomeLeTan = () => {
  const navigate = useNavigate();
  const [statusCounts, setStatusCounts] = useState({
    "Chưa xác nhận": 0,
    "Xác nhận": 0,
    "Check in": 0,
    "Check out": 0,
    "Hủy": 0
  });
  const [checkInCode, setCheckInCode] = useState('');
  const [checkOutCode, setCheckOutCode] = useState('');
  const [bookingInfo, setBookingInfo] = useState(null);
  const [totalServiceRequests, setTotalServiceRequests] = useState(0);
  const [pendingServiceRequests, setPendingServiceRequests] = useState(0);
  const [message, setMessage] = useState('');
  const [checkoutMessage, setCheckoutMessage] = useState('');
  const [damageFee, setDamageFee] = useState('');
  const [notes, setNotes] = useState('');

  const fetchBookings = async () => {
    try {
      const response = await fetch('http://localhost:4000/booking/allbookings');
      const data = await response.json();
      const counts = {
        "Chưa xác nhận": 0,
        "Xác nhận": 0,
        "Check in": 0,
        "Check out": 0,
        "Hủy": 0
      };

      data.forEach(booking => {
        if (counts[booking.Status] !== undefined) {
          counts[booking.Status]++;
        }
      });

      setStatusCounts(counts);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const fetchServiceRequests = async () => {
    try {
      const response = await fetch('http://localhost:4000/serviceRequests/get');
      const data = await response.json();

      const pendingRequests = data.filter(request => request.Status === "Chưa xác nhận").length;

      setTotalServiceRequests(data.length);
      setPendingServiceRequests(pendingRequests);
    } catch (error) {
      console.error("Error fetching service requests:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchServiceRequests();
  }, []);

  const fetchBookingInfo = async (code) => {
    if (code) {
      try {
        const response = await fetch(`http://localhost:4000/booking/${code}`);
        const data = await response.json();

        if (response.ok) {
          setBookingInfo(data);
          setMessage('');
        } else {
          setBookingInfo(null);
          setMessage('Mã đặt phòng không tồn tại.');
        }
      } catch (error) {
        console.error("Error fetching booking info:", error);
        setBookingInfo(null);
        setMessage("Có lỗi xảy ra, vui lòng thử lại.");
      }
    }
  };

  useEffect(() => {
    if (checkInCode) {
      fetchBookingInfo(checkInCode);
    } else {
      setBookingInfo(null);
      setMessage('');
    }
  }, [checkInCode]);

  useEffect(() => {
    if (checkOutCode) {
      fetchBookingInfo(checkOutCode);
    } else {
      setBookingInfo(null);
      setCheckoutMessage('');
    }
  }, [checkOutCode]);

  const handleCheckIn = async () => {
    try {
      if (bookingInfo && bookingInfo.Status === "Xác nhận") {
        const updateResponse = await fetch(`http://localhost:4000/booking/bookings/${bookingInfo._id}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: 'Check in' })
        });
        if (updateResponse.ok) {
          const updatedBooking = await updateResponse.json();
          setMessage("Check-in thành công!");
          setBookingInfo(updatedBooking);
          await fetchBookings();
          setCheckInCode(''); // Reset code after successful check-in
        } else {
          setMessage("Có lỗi xảy ra khi cập nhật trạng thái!");
        }
      } else {
        setMessage(`Mã này đang ở trạng thái "${bookingInfo?.Status}", không thể check in.`);
      }
    } catch (error) {
      console.error("Error checking in:", error);
      setMessage("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  const handleCheckOut = async () => {
    try {
      if (bookingInfo && bookingInfo.Status === "Check in") {
        if (Number(damageFee) < 1) {
          toast.error("Vui lòng nhập số tiền hợp lệ");
          return;
        }

        const updateResponse = await fetch(`http://localhost:4000/booking/bookings/${bookingInfo._id}/checkout`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ damageFee, notes })
        });
        if (updateResponse.ok) {
          const updatedBooking = await updateResponse.json();
          setCheckoutMessage("Check-out thành công!");
          setBookingInfo(updatedBooking);
          await fetchBookings();
          setCheckOutCode(''); // Reset code after successful check-out
        } else {
          setCheckoutMessage("Có lỗi xảy ra khi cập nhật trạng thái!");
        }
      } else {
        setCheckoutMessage(`Mã này đang ở trạng thái "${bookingInfo?.Status}", không thể check out.`);
      }
    } catch (error) {
      console.error("Error checking out:", error);
      setCheckoutMessage("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  const [selectedButton, setSelectedButton] = useState("checkin");

  return (
    <div className="admin-layout">
      <NavbarLeTan />

      <div className="top-bar-admin">
        <Account />
      </div>

      <div className="home-manager-content">
        <div className='home-content'>
          <div className="status-container">

            <div className="booking-form">
              <h3>Nhận & Trả phòng</h3>
              <div className="button-group">
                <button
                  className={`btn-checkin-out ${selectedButton === "checkin" ? "active" : ""}`}
                  onClick={() => setSelectedButton("checkin")}
                >
                  Nhận phòng
                </button>
                <button
                  className={`btn-checkin-out ${selectedButton === "checkout" ? "active" : ""}`}
                  onClick={() => setSelectedButton("checkout")}
                >
                  Trả phòng
                </button>
              </div>

              {selectedButton === "checkin" && (
                <>
                  <input
                    type="text"
                    placeholder="Nhập mã đặt phòng"
                    value={checkInCode}
                    onChange={(e) => setCheckInCode(e.target.value)}
                  />

                  {bookingInfo && checkInCode && (
                    <div className="booking-info">
                      <p><strong>Phòng:</strong> {bookingInfo.Room.NameRoom}</p>
                      <p><strong>Số phòng:</strong> {bookingInfo.Room.NumberofRoom}</p>
                      <p><strong>Số điện thoại:</strong> {bookingInfo.PhoneNumber}</p>
                      <p><strong>Địa chỉ:</strong> {bookingInfo.Address}</p>
                    </div>
                  )}

                  <button onClick={handleCheckIn} className='booking-btn-admin'>Tiếp tục</button>
                  {message && <p className="message">{message}</p>}
                </>
              )}

              {selectedButton === "checkout" && (
                <>
                  <input
                    type="text"
                    placeholder="Nhập mã đặt phòng"
                    value={checkOutCode}
                    onChange={(e) => setCheckOutCode(e.target.value)}
                  />

                  {bookingInfo && checkOutCode && (
                    <div className="booking-info">
                      <p><strong>Phòng:</strong> {bookingInfo.Room.NameRoom}</p>
                      <p><strong>Số phòng:</strong> {bookingInfo.Room.NumberofRoom}</p>
                      <p><strong>Số điện thoại:</strong> {bookingInfo.PhoneNumber}</p>
                      <p><strong>Địa chỉ:</strong> {bookingInfo.Address}</p>
                      <input
                        type="text"
                        placeholder="Chi phí phát sinh"
                        value={damageFee}
                        onChange={(e) => setDamageFee(e.target.value)}
                        style={{ width: '100%' }}
                      />

                      <textarea
                        placeholder="Ghi chú"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        style={{ width: '100%', marginTop: '20px' }}
                      />
                    </div>
                  )}


                  <button onClick={handleCheckOut} className='booking-btn-admin'>Tiếp tục</button>

                  {/* {checkoutMessage && <p className="checkout-message">{checkoutMessage}</p>} */}
                </>
              )}
            </div>
            <div className="status-box chua-xac-nhan" onClick={() => navigate(`/homeadmin/chuaxacnhan`)}>
              <FaBed />
              <h3>Phòng chờ xác nhận</h3>
              <p>{statusCounts["Chưa xác nhận"]} booking</p>
            </div>
            <div className="status-box da-xac-nhan" onClick={() => navigate(`/homeadmin/daxacnhan`)}>
              <FaCheckCircle />
              <h3>Phòng đã xác nhận</h3>
              <p>{statusCounts["Xác nhận"]} booking</p>
            </div>
            <div className="status-box da-huy" onClick={() => navigate(`/homeadmin/huy`)}>
              <FaCalendarTimes />
              <h3>Phòng đã hủy</h3>
              <p>{statusCounts["Hủy"]} booking</p>
            </div>
            <div className="status-box da-nhan-phong" onClick={() => navigate(`/homeadmin/dacheckin`)}>
              <FaSignInAlt />
              <h3>Phòng đã nhận phòng</h3>
              <p>{statusCounts["Check in"]} booking</p>
            </div>
            <div className="status-box da-tra-phong" onClick={() => navigate(`/homeadmin/dacheckout`)}>
              <FaSignOutAlt />
              <h3>Phòng đã trả phòng</h3>
              <p>{statusCounts["Check out"]} booking</p>
            </div>
            <div className="status-box huy-yeu-cau" onClick={() => navigate(`/bookingsyc/yeucauchuaxacnhan`)}>
              <FaTimesCircle />
              <h3>Yêu cầu chưa xác nhận</h3>
              <p>{pendingServiceRequests} yêu cầu</p>
            </div>
            <div className="status-box yeu-cau-dat-them" onClick={() => navigate(`/bookingsyc/yeucau`)}>
              <FaConciergeBell />
              <h3>Yêu cầu đặt thêm</h3>
              <p>{totalServiceRequests} yêu cầu</p>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default HomeLeTan
