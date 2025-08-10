import mongoose from 'mongoose';


// Khai báo schema cho Booking
const bookingSchema = new mongoose.Schema({
    BookingCode: { type: String, required: true, unique: true }, // Mã đặt phòng (độc nhất)
    Room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' }, // ID phòng được đặt
    RoomType: { type: mongoose.Schema.Types.ObjectId, ref: 'RoomType' }, // ID loại phòng
    Branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' }, // ID chi nhánh của khách sạn
    NumberOfPeople: { type: Number, required: true }, // Số người trong đặt phòng
    Services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'HotelServices' }], // Danh sách dịch vụ liên quan đến đặt phòng
    Equipment: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' }], // Danh sách thiết bị liên quan đến đặt phòng
    TotalPrice: { type: Number }, // Tổng giá của đặt phòng (bao gồm dịch vụ, thiết bị...)
    DamageFee: { type: Number, default: 0 }, // Tiền thiệt hại, mặc định là 0 (được cập nhật nếu có thiệt hại xảy ra)
    User: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // ID người dùng đặt phòng
    Address: { type: String }, // Địa chỉ của khách hàng
    PhoneNumber: { type: String }, // Số điện thoại của khách hàng
    Status: { type: String }, // Trạng thái đặt phòng (ví dụ: Đã xác nhận, Đã hủy, ...)
    CheckInDate: { type: Date }, // Ngày nhận phòng
    CheckOutDate: { type: Date }, // Ngày trả phòng
    Notes: { type: String }, // Trường ghi chú cho phép thêm thông tin bổ sung
    InvoiceStatus: { type: String, default: 'Chưa thanh toán' }, // Trạng thái hóa đơn (ví dụ: Đã thanh toán, Chưa thanh toán)
    PaymentDate: { type: Date }, // Ngày thanh toán của hóa đơn
}, { timestamps: true }); // Tự động thêm trường createdAt và updatedAt


const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;