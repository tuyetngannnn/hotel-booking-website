// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./InvoiceDetailUser.css";
import imageInvoice from "../../assets/image-invoice.jpg";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";


const BookingDetails = () => {
  const { id } = useParams(); // Lấy id của booking từ URL
  const [booking, setBooking] = useState(null);
  const [tongtien, settongtien] = useState(0);
  const [numberOfNights, setNumberOfNights] = useState(0);
  const navigate = useNavigate();


  useEffect(() => {
    fetchBookingDetails();
  }, []);


  useEffect(() => {
    if (booking) {
      const nights = calculateNights(booking.CheckInDate, booking.CheckOutDate);
      setNumberOfNights(nights);
      const tt = (booking.DamageFee || 0) + (booking.TotalPrice || 0);


      settongtien(tt);
    }
  }, [booking]);


  // Hàm tính số đêm ở
  const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const timeDifference = checkOutDate - checkInDate;
    const days = Math.ceil(timeDifference / (1000 * 3600 * 24));
    return days > 0 ? days : 0;
  };


  // Lấy chi tiết booking từ server
  const fetchBookingDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/booking/bookings/${id}`
      );
      const data = await response.json();
      console.log(data); // Log dữ liệu API trả về để kiểm tra
      setBooking(data);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết đặt phòng:", error);
    }
  };


  // Cập nhật trạng thái thanh toán của booking
  const updateBookingStatus = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/booking/bookings/${id}/confirm-payment`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ invoiceStatus: "Đã thanh toán" }), // Trạng thái mới
        }
      );
      if (response.ok) {
        const updatedBooking = await response.json();
        setBooking(updatedBooking); // Cập nhật booking mới
        alert("Thanh toán thành công");
        navigate("/");
      } else {
        throw new Error("Lỗi khi cập nhật trạng thái hóa đơn.");
      }
    } catch (error) {
      console.error("Lỗi khi khi xác nhận thanh toán:", error);
    }
  };


  if (!booking) {
    return <div>Đang tải...</div>; // Hiển thị khi đang tải dữ liệu
  }


  return (
    <div className="invoice-section">
      <div className="header-invoice">
        <img src={imageInvoice} className="top-image" />
        <ul className="text-left-overlay">
          <h1>HÓA ĐƠN</h1>
          <p className="text-lg">KHÁCH SẠN THE ROYAL SEA</p>
          <p className="text-sm">www.theroyalseahotel.com</p>
        </ul>
      </div>


      <div className="body-invoice">
        <h2 className="invoice-username">
          MS./MR. {booking.User?.name.toUpperCase()}
        </h2>
        <div className="invoice-info">
          <ul className="invoice-no">
            <p>
              <strong>Mã </strong> #{booking.BookingCode}
            </p>
          </ul>
          <ul className="invoice-no-detail">
            <li className="room-info-invoice">
              <p>
                <strong>Phòng:</strong> {booking.Room?.NumberofRoom || "N/A"}
              </p>
              <p>
                <strong>Số điện thoại:</strong> {booking.PhoneNumber}
              </p>
              <p>
                <strong>Địa chỉ:</strong> {booking.Address}
              </p>
            </li>


            <li className="invoice-room">
              <p>
                <strong>Ngày nhận phòng:</strong>{" "}
                {new Date(booking.CheckInDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Ngày trả phòng:</strong>{" "}
                {new Date(booking.CheckOutDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Trạng thái:</strong> {booking.InvoiceStatus}
              </p>
            </li>
          </ul>
        </div>


        <table className="invoice-details">
          <thead>
            <tr className="border-b">
              <th className="text-tittle">LOẠI PHÒNG</th>
              <th className="text-tittle">TÊN PHÒNG</th>
              <th className="text-tittle">SỐ LƯỢNG</th>
              <th className="text-tittle">SỐ NGƯỜI</th>
              <th className="text-tittle">GHI CHÚ</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="c2-r2">
                {booking.RoomType?.NameRoomtype || "N/A"}
              </td>
              <td className="c2-r2">
                {booking.Room ? booking.Room.NameRoom : "N/A"}
              </td>
              <td className="c2-r2">{numberOfNights} đêm</td>
              <td className="c2-r2"> {booking.NumberOfPeople}</td>
              <td className="c2-r2">{booking.Notes}</td>
            </tr>


            <tr className="border-b">
              <th colSpan="2" className="invoice-service">
                DỊCH VỤ
              </th>
              <td colSpan="3" className="invoice-service-name">
                {booking.Services?.map((service, index) => (
                  <React.Fragment key={index}>
                    {service.Nameservices}
                    <br />
                  </React.Fragment>
                )) || "Không có dịch vụ"}
              </td>
            </tr>
            <tr className="border-b">
              <th colSpan="2" className="invoice-service">
                THIẾT BỊ
              </th>
              <td colSpan="5" className="invoice-service-name">
                {booking.Equipment?.map((equip, index) => (
                  <React.Fragment key={index}>
                    {equip.NameEquiment}
                    <br />
                  </React.Fragment>
                )) || "Không có thiết bị"}
              </td>
            </tr>
            <tr className="border-b">
              <th colSpan="2" className="invoice-service">
                CHI PHÍ PHÁT SINH
              </th>
              <td colSpan="5" className="invoice-service-name">
                {booking.DamageFee} VND
              </td>
            </tr>
            <tr className="border-b ">
              <th colSpan="3" className="invoice-total">
                TỔNG THANH TOÁN
              </th>
              <td colSpan="2" className="invoice-price">
                <p>{tongtien.toLocaleString('vi-VN')} VND</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>


      {booking.InvoiceStatus === "Đã thanh toán" && (
        <div>
          <Link to="/roomlist" className="backRoom-invoice">
            &larr; Tiếp tục đặt phòng
          </Link>
        </div>
      )}


      {/* Nút PayPal chỉ hiện nếu chưa thanh toán */}
      <div className="custom-payment-method">
        {booking.InvoiceStatus === "Chưa thanh toán" && (
          <ul className="custom-payment-content">
            VUI LÒNG CHỌN <br />
            PHƯƠNG THỨC THANH TOÁN
          </ul>
        )}
        {booking.InvoiceStatus === "Chưa thanh toán" && (
          <ul className="custom-mt-4">
            <PayPalScriptProvider
              options={{
                "client-id":
                  "AT-xGi2RlZ6A77niHyo0TbWnYHgJgFJ4Ic5-CcykiAeOP7a3q6t1f2XOkG4fNBzlUDZ2aQ9u5pjuxyuW",
              }}
            >
              <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          value: tongtien.toString(), // Số tiền cần thanh toán
                          currency_code: "USD",
                        },
                      },
                    ],
                  });
                }}
                onApprove={(data, actions) => {
                  // eslint-disable-next-line no-unused-vars
                  actions.order.capture().then(function (details) {
                    updateBookingStatus(); // Cập nhật trạng thái khi thanh toán thành công
                  });
                }}
              />
            </PayPalScriptProvider>
          </ul>
        )}
      </div>
    </div>
  );
};


export default BookingDetails;





