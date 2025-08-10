import Branch from "../models/chinhanh.js";
import Room from "../models/room.js";
import Booking from "../models/booking.js"; 
import RoomType from "../models/roomtype.js"; // Nhập mô hình RoomType
import ErrorHandler from "../middlewares/error.js";

// Tìm kiếm phòng
export const searchRoom = async (req, res, next) => {
    try {
        const { branch, startDate, endDate, guests } = req.query;

        // Kiểm tra các trường bắt buộc
        if (!branch || !startDate || !endDate || guests <= 0) {
            return next(new ErrorHandler('Vui lòng điền đầy đủ thông tin: chi nhánh, ngày nhận, ngày trả và số khách.', 400));
        }

        // Chuyển đổi startDate và endDate thành kiểu Date
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Kiểm tra nếu startDate lớn hơn hoặc bằng endDate
        if (start >= end) {
            return next(new ErrorHandler('Ngày trả phòng phải lớn hơn ngày nhận phòng.', 400));
        }

        // Tìm chi nhánh trong cơ sở dữ liệu
        const selectedBranch = await Branch.findById(branch);

        // Kiểm tra chi nhánh
        if (!selectedBranch) {
            return next(new ErrorHandler('Không tìm thấy chi nhánh.', 404));
        }

        // Tìm các loại phòng có số khách tối đa phù hợp
        const roomTypes = await RoomType.find({ MaxPeople: { $gte: guests } });
        const roomTypeIds = roomTypes.map(type => type._id); // Lấy ID của các RoomType phù hợp

        // Tìm phòng theo chi nhánh và các loại phòng
        const rooms = await Room.find({
            IDBranch: selectedBranch._id,
            IDRoomType: { $in: roomTypeIds }, // Lọc theo IDRoomType
        });

        // Loại bỏ các phòng đã được đặt trong khoảng thời gian này
        const availableRooms = [];
        for (const room of rooms) {
            const overlappingBookings = await Booking.find({
                Room: room._id,
                CheckInDate: { $lt: end },
                CheckOutDate: { $gt: start }, // Booking trùng khoảng thời gian
                status: { $ne: 'Hủy' }
            });

            // Nếu không có booking trùng thời gian, thêm phòng vào danh sách availableRooms
            if (overlappingBookings.length === 0) {
                availableRooms.push(room);
            }
        }
        console.log('Danh sách phòng có sẵn:', availableRooms);

        // Nếu không tìm thấy phòng phù hợp
        if (availableRooms.length === 0) {
            return next(new ErrorHandler('Không tìm thấy phòng phù hợp.', 404));
        }

        // Trả về danh sách phòng có sẵn
        res.status(200).json(availableRooms);
    } catch (error) {
        console.error("Lỗi trong searchRoom:", error); // In lỗi chi tiết để kiểm tra
        next(new ErrorHandler('Đã xảy ra lỗi trong quá trình tìm kiếm phòng.', 500)); // Trả về lỗi tổng quát
    }
};
