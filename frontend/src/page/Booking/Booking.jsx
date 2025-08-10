// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import FireworksAnimation from "../../components/Lottie/Lottie.jsx"
import "./Booking.css";
import ProgressBar from "./ProgressBar";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Booking = () => {
  const [showAnimation, setShowAnimation] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const handleNextStep = () => {
    let errorMessage = "";


    // Kiểm tra lỗi theo từng bước
    if (currentStep === 1) {
      if (guestCount < 1) {
        errorMessage = "Vui lòng nhập số lượng khách hợp lệ.";
      }
    } else if (currentStep === 3) {
      if (!address || address.trim() === "") {
        errorMessage = "Địa chỉ không được để trống.";
      }
      if (!/^\d{10}$/.test(phoneNumber) || phoneNumber === "") {
        errorMessage = "Số điện thoại không hợp lệ.";
      }
      if (!checkInDateTime || !checkOutDateTime) {
        errorMessage = "Vui lòng chọn ngày nhận và trả phòng.";
      }
      if (calculateNights(checkInDateTime, checkOutDateTime) <= 0) {
        errorMessage = "Ngày trả phòng phải sau ngày nhận phòng.";
      }
    }


    // Hiển thị lỗi nếu có, ngược lại chuyển bước
    if (errorMessage) {
      toast.error(errorMessage);
      return;
    } else {
      setError(""); // Xóa lỗi nếu không có lỗi nào
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };
  const handlePrevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));


  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      navigate("/login"); // Chuyển hướng sang trang đăng nhập nếu chưa đăng nhập
    }
  }, [navigate]);


  const [guestCount, setGuestCount] = useState(1);
  const [services, setServices] = useState([]);
  const [idloai, setidloai] = useState([]);
  const [idcn, setidcn] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [checkInDateTime, setCheckInDateTime] = useState("");
  const [checkOutDateTime, setCheckOutDateTime] = useState("");
  const [roomDetails, setRoomDetails] = useState([]); // Lưu thông tin chi tiết phòng
  const [baseRoomPrice, setBaseRoomPrice] = useState(0); // Giá cơ bản của phòng
  const [userId, setUserId] = useState("");
  // Lấy dịch vụ từ API
  const fetchServices = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/hotelservices/getallservices1"
      );
      setServices(response.data.hotelservices || []);
    } catch (error) {
      console.error(error);
      setError("Không thể lấy thông tin dịch vụ");
    }
  };


  // Lấy thiết bị từ API
  const fetchEquipment = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/equipment/getallEquipment1"
      );
      setEquipment(response.data.equipment || []);
    } catch (error) {
      console.error(error);
      setError("Không thể lấy thông tin thiết bị");
    }
  };


  // Lấy thông tin chi tiết phòng
  const fetchRoomDetails = async () => {
    try {
      // Gửi yêu cầu tới API để lấy thông tin phòng
      const response = await axios.get(
        `http://localhost:4000/room/getroom/${id}`
      );


      // Lưu thông tin chi tiết phòng vào state
      setRoomDetails(response.data.room || []);
      console.log(response.data.room);
      setidloai(response.data.room.IDRoomType._id);
      setidcn(response.data.room.IDBranch._id);
      setBaseRoomPrice(response.data.room.IDRoomType?.PriceRoomtype); // Đặt giá cơ bản của phòng từ loại phòng
    } catch (error) {
      console.error(error);
      setError("Có lỗi xảy ra khi lấy thông tin phòng.");
    }
  };


  // Fetch dữ liệu dịch vụ, thiết bị, và thông tin phòng khi component mount
  useEffect(() => {
    fetchServices();
    fetchEquipment();
    fetchRoomDetails(); // Lấy thông tin phòng
  }, []);


  // Tính tổng tiền
  useEffect(() => {
    const totalServicesPrice = selectedServices.reduce(
      (total, service) => total + service.Priceservices,
      0
    );
    const totalEquipmentPrice = selectedEquipment.reduce(
      (total, equip) => total + equip.PriceEquipment,
      0
    );
    const numberOfNights = calculateNights(checkInDateTime, checkOutDateTime);
    const newTotalPrice =
      (baseRoomPrice + totalServicesPrice + totalEquipmentPrice) *
      numberOfNights;
    setTotalPrice(newTotalPrice);
  }, [
    selectedServices,
    selectedEquipment,
    baseRoomPrice,
    checkInDateTime,
    checkOutDateTime,
  ]);


  // Tính số đêm ở
  const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const timeDifference = checkOutDate - checkInDate;
    const days = Math.ceil(timeDifference / (1000 * 3600 * 24)); // Chuyển đổi milliseconds thành days
    return days > 0 ? days : 0; // Đảm bảo số ngày không âm
  };


  // Hàm kiểm tra xem phòng có đã được đặt trong khoảng thời gian không
  const checkRoomAvailability = async (roomId, checkIn, checkOut) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/booking/checkAvailability`,
        {
          params: {
            roomId: roomId,
            checkIn: checkIn,
            checkOut: checkOut,
          },
        }
      );
      return response.data.isAvailable; // Trả về true nếu phòng còn trống
    } catch (error) {
      console.error("Lỗi kiểm tra tính khả dụng:", error);
      setError("Có lỗi xảy ra khi kiểm tra phòng.");
      return false;
    }
  };


  const handleCheckInDateChange = (e) => {
    const selectedDate = e.target.value;
    setCheckInDateTime(`${selectedDate}T14:00`); // Đặt giờ mặc định 14:00 cho check-in
    setCheckOutDateTime(""); // Reset ngày trả phòng để người dùng chọn lại
  };
  const handleCheckOutDateChange = (e) => {
    const selectedDate = e.target.value;
    setCheckOutDateTime(`${selectedDate}T12:00`); // Đặt giờ mặc định 12:00 cho check-out
  };


  // Hàm xử lý đặt phòng
  const handleBooking = async (isPaid) => {
    if (guestCount < 1 || guestCount > roomDetails.IDRoomType.MaxPeople) {
      toast.error("Vui lòng nhập số lượng khách hợp lệ");
      return;
    }


    if (!address || address.trim() === "") {
      toast.error("Vui lòng nhập địa chỉ");
      return;
    }


    if (!/^\d{10}$/.test(phoneNumber)) {
      toast.error("Vui lòng nhập số điện thoại");
      return;
    }
    // Kiểm tra giá trị checkInDateTime và checkOutDateTime
    if (!checkInDateTime || !checkOutDateTime) {
      toast.error("Vui lòng chọn ngày nhận và trả phòng hợp lệ.");
      return;
    }


    const checkInDate = new Date(checkInDateTime);
    const checkOutDate = new Date(checkOutDateTime);


    // Kiểm tra tính hợp lệ của đối tượng Date
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      toast.error("Ngày nhận hoặc trả phòng không hợp lệ.");
      return;
    }


    // Chuyển đổi sang ISO chỉ khi giá trị hợp lệ
    const checkInDateISO = checkInDate.toISOString();
    const checkOutDateISO = checkOutDate.toISOString();


    if (checkOutDate <= checkInDate) {
      toast.error("Ngày trả phòng phải sau ngày nhận phòng.");
      return;
    }


    if (calculateNights(checkInDateISO, checkOutDateISO) <= 0) {
      toast.error("Ngày trả phòng phải sau ngày nhận phòng.");
      return;
    }


    const isAvailable = await checkRoomAvailability(
      id,
      checkInDateISO,
      checkOutDateISO
    );


    if (!isAvailable) {
      toast.error("Phòng đã được đặt trong khoảng thời gian này!");
      return;
    }


    console.log("Check-in DateTime:", checkInDateISO);
    console.log("Check-out DateTime:", checkOutDateISO);
    setError("");


    try {
      const response = await axios.post(
        "http://localhost:4000/booking/create",
        {
          roomId: id,
          roomTypeId: idloai,
          branchId: idcn,
          numberOfPeople: guestCount,
          services: selectedServices.map((service) => service._id),
          equipment: selectedEquipment.map((equip) => equip._id),
          totalPrice: totalPrice,
          userId: userId,
          address: address,
          phoneNumber: phoneNumber,
          status: isPaid ? "Đã thanh toán" : "Chưa xác nhận",
          checkInDateTime: checkInDateISO,
          checkOutDateTime: checkOutDateISO,
        }
      );


      if (response.data.success) {
        setShowAnimation(true); // Hiển thị hoạt ảnh thành công
        setTimeout(() => {
          navigate("/roomlist");
        }, 7000);


        // Hiển thị thông báo thành công
        Swal.fire({
          title: "Đặt phòng thành công!",
          icon: "success",
          confirmButtonText: "OK",
          timer: 7000,
        });
      } else {
        // Hiển thị thông báo thất bại
        Swal.fire({
          title: "Đặt phòng thất bại!",
          icon: "error",
          confirmButtonText: "OK",
          timer: 7000,
          preConfirm: () => {
            navigate("/roomlist"); // Chuyển hướng tới trang /roomlist
          },
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!"
      );
    }
  };


  return (
    <div className="booking-steps-container">
      <Navbar />
      {showAnimation && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 9999, // Đảm bảo nó hiển thị trên các phần tử khác
            pointerEvents: "none", // Để không ảnh hưởng đến các tương tác khác trên trang
          }}
        >
          <FireworksAnimation />
        </div>
      )}
      <h1
        className="booking-h1"
      >
        THÔNG TIN ĐẶT PHÒNG
      </h1>


      <div className="booking-steps-content">
        <ProgressBar currentStep={currentStep} />
        <div className="book-steps">
          <div className="booking-container">
            {error && <div className="error-message">{error}</div>}{" "}
            {/* Display error message */}
            {currentStep === 1 && (
              <div className="booking-section">
                {roomDetails && (
                  <div className="booking-content">
                    <p>
                      <strong>Tên phòng: </strong>
                      {roomDetails.NameRoom}
                    </p>
                    <p>
                      <strong>Tên chi nhánh: </strong>
                      {roomDetails.IDBranch?.branchname}
                    </p>
                    <p>
                      <strong>Loại phòng: </strong>
                      {roomDetails.IDRoomType?.NameRoomtype}
                    </p>
                    <p>
                      <strong>Giá cơ bản: </strong>
                      {roomDetails.IDRoomType?.PriceRoomtype.toLocaleString('vi-VN')} VND
                    </p>
                    <p>
                      <strong>Mô tả: </strong>
                      {roomDetails.Describe}
                    </p>
                  </div>
                )}


                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="form-booking">
                    <label className="label-number">Số lượng khách:</label>
                    <input
                      className="input-number"
                      type="number"
                      value={guestCount}
                      min="1"
                      // onChange={(e) => setGuestCount(Number(e.target.value))}
                      max={roomDetails.IDRoomType?.MaxPeople || 1} // Giới hạn giá trị tối đa
                      onChange={(e) => {
                        const newGuestCount = Number(e.target.value);
                        if (newGuestCount <= (roomDetails.IDRoomType?.MaxPeople || 1)) {
                          setGuestCount(newGuestCount);
                        } else {
                          toast.error(`Số lượng khách không được vượt quá ${roomDetails.IDRoomType.MaxPeople}.`);
                        }
                      }}
                    />
                  </div>
                </form>
              </div>
            )}
            {currentStep === 2 && (
              <div className="services-booking">
                <label>Thiết bị:</label>
                {equipment.length > 0 ? (
                  equipment.map((equip) => {
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
                          {equip.PriceEquipment.toLocaleString('vi-VN')} VND
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


                <label>Dịch vụ thêm (nếu có):</label>
                {services.length > 0 ? (
                  services.map((service) => {
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
                          {service.Priceservices.toLocaleString('vi-VN')} VND
                        </span>
                      </ul>
                    );
                  })
                ) : (
                  <p>Không có dịch vụ</p>
                )}
              </div>
            )}
            {currentStep === 3 && (
              <div className="booking-step3">
                <ul>
                  <label className="label-date">Địa chỉ:</label>
                  <br />
                  <input
                    className="input-booking"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </ul>
                <ul>
                  <label className="label-date">Số điện thoại:</label>
                  <br />
                  <input
                    className="input-booking"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </ul>
                <ul>
                  <label className="label-date">Ngày nhận phòng:</label>
                  <br />
                  <input
                    type="date"
                    value={checkInDateTime ? checkInDateTime.slice(0, 10) : ""}
                    min={new Date().toISOString().slice(0, 10)} // Ngày nhận phòng không thể trước ngày hôm nay
                    onChange={handleCheckInDateChange}
                    required
                  />
                </ul>
                <ul>
                  <label className="label-date">Ngày trả phòng:</label>
                  <br />
                  <input
                    type="date"
                    value={
                      checkOutDateTime ? checkOutDateTime.slice(0, 10) : ""
                    }
                    min={checkInDateTime.slice(0, 10)} // Ngày trả phòng phải sau ngày nhận phòng
                    onChange={handleCheckOutDateChange}
                    required
                  />
                </ul>


                <p>
                  <strong>TỔNG TIỀN: </strong>
                  {totalPrice.toLocaleString('vi-VN')} VND
                </p>
              </div>
            )}
          </div>
          {/* Nút điều hướng tùy thuộc vào currentStep */}
          <div className="btn-section">
            {currentStep > 1 && (
              <button
                className="btn-booking-back"
                type="button"
                onClick={handlePrevStep}
              >
                Quay lại
              </button>
            )}
            {currentStep < 3 && (
              <button
                className="btn-booking-next"
                type="button"
                onClick={handleNextStep}
              >
                Tiếp theo
              </button>
            )}
            {currentStep === 3 && (
              <button
                className="btn-booking-confirm"
                type="button"
                onClick={() => handleBooking(true)}
              >
                Xác nhận
              </button>
            )}
          </div>
        </div>
      </div>
      <br />
      <Footer />
      <ToastContainer />
    </div>
  );
};
export default Booking;





