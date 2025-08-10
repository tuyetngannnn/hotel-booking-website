import Booking from '../models/booking.js';
import Room from '../models/room.js';
import HotelServices from '../models/Hotelservices.js';
import Equipmenthotel from '../models/Equipment.js';
import { sendEmail, sendEmail1 } from '../email/emailService.js';
// Hàm tạo mã booking ngẫu nhiên
const generateBookingCode = async () => {
    let code;
    do {
        code = 'BOOK-' + Math.random().toString(36).substr(2, 9).toUpperCase(); // Tạo mã ngẫu nhiên
    } while (await Booking.exists({ BookingCode: code })); // Đảm bảo mã là duy nhất
    return code;
};
export const createBooking = async (req, res) => {
    try {
        const {
            roomId,
            roomTypeId,
            branchId,
            numberOfPeople,
            services,
            equipment,
            totalPrice,
            userId = req.user._id,
            address,
            phoneNumber,
            isPaid,
            checkInDateTime,
            checkOutDateTime
        } = req.body;
        const currentDate = new Date();
        if (checkInDateTime <= currentDate) {
            return res.status(400).json({ message: 'Ngày giờ nhận phải sau thời điểm hiện tại.' });
        }
        const newBooking = new Booking({
            BookingCode: await generateBookingCode(),
            Room: roomId,
            RoomType: roomTypeId,
            Branch: branchId,
            NumberOfPeople: numberOfPeople,
            Services: services,
            Equipment: equipment,
            TotalPrice: totalPrice,
            User: userId,
            Address: address,
            PhoneNumber: phoneNumber,
            Status: isPaid ? 'Đã thanh toán' : 'Chưa xác nhận',
            CheckInDate: checkInDateTime,
            CheckOutDate: checkOutDateTime,
            DamageFee: 0,
            Notes: "",
            InvoiceStatus: "Chưa thanh toán",
            PaymentDate: null
        });
        await newBooking.save();
        res.status(201).json({ success: true, newBooking });
    } catch (error) {
        console.error("Error in createBooking:", error); // In ra lỗi chi tiết
        res.status(500).json({ message: error.message });
    }
};

export const getBookingForm = async (req, res) => {
    try {
        const rooms = await Room.find();
        const services = await HotelServices.find();
        const equipment = await Equipmenthotel.find();
        res.render('bookingForm', { rooms, services, equipment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// list lấy hết booking của admin
export const getAllBookings = async (req, res) => {
    try {
        // Lấy danh sách các phiếu đặt phòng kèm thông tin về phòng
        const bookings = await Booking.find()
            .populate('Room', 'NameRoom')  // Lấy tên phòng
            .populate('Branch', 'branchname')
            .select('BookingCode Room Status CheckInDate CheckOutDate'); // Chỉ lấy các trường cần thiết
        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error in getBookings:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getBookings = async (req, res) => {
    try {
        // Lấy danh sách các phiếu đặt phòng kèm thông tin về phòng
        const bookings = await Booking.find({Status : 'Chưa xác nhận'})
            .populate('Room', 'NameRoom')  // Lấy tên phòng
            .populate('Branch', 'branchname')
            .select('BookingCode Room Status CheckInDate CheckOutDate'); // Chỉ lấy các trường cần thiết
        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error in getBookings:", error);
        res.status(500).json({ message: error.message });
    }
};
// list xác nhận của admin
export const getBookings1 = async (req, res) => {
    try {
        // Lấy danh sách các phiếu đặt phòng kèm thông tin về phòng
        const bookings = await Booking.find({Status : 'Xác nhận'})
            .populate('Room', 'NameRoom')  // Lấy tên phòng
            .populate('Branch', 'branchname')
            .select('BookingCode Room Status CheckInDate CheckOutDate'); // Chỉ lấy các trường cần thiết
        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error in getBookings:", error);
        res.status(500).json({ message: error.message });
    }
};
// list Checkin của admin
export const getBookings2 = async (req, res) => {
    try {
        // Lấy danh sách các phiếu đặt phòng kèm thông tin về phòng
        const bookings = await Booking.find({Status : 'Check in'})
            .populate('Room', 'NameRoom')  // Lấy tên phòng
            .populate('Branch', 'branchname')
            .select('BookingCode Room Status CheckInDate CheckOutDate'); // Chỉ lấy các trường cần thiết
        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error in getBookings:", error);
        res.status(500).json({ message: error.message });
    }
};
// list Check out của admin
export const getBookings3 = async (req, res) => {
    try {
        // Lấy danh sách các phiếu đặt phòng kèm thông tin về phòng
        const bookings = await Booking.find({Status : 'Check out'})
            .populate('Room', 'NameRoom')  // Lấy tên phòng
            .populate('Branch', 'branchname')
            .select('BookingCode Room Status CheckInDate CheckOutDate'); // Chỉ lấy các trường cần thiết
        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error in getBookings:", error);
        res.status(500).json({ message: error.message });
    }
};
// list Hủy của admin
export const getBookings4 = async (req, res) => {
    try {
        // Lấy danh sách các phiếu đặt phòng kèm thông tin về phòng
        const bookings = await Booking.find({Status : 'Hủy'})
            .populate('Room', 'NameRoom')  // Lấy tên phòng
            .populate('Branch', 'branchname')
            .select('BookingCode Room Status CheckInDate CheckOutDate'); // Chỉ lấy các trường cần thiết
        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error in getBookings:", error);
        res.status(500).json({ message: error.message });
    }
};
// detail của admin
export const getBookingDetails = async (req, res) => {
    try {
        const { id } = req.params; // Lấy id từ params
        // Lấy thông tin chi tiết của phiếu đặt phòng, bao gồm phòng, dịch vụ và thiết bị
        const booking = await Booking.findById(id)
            .populate('Room', 'NameRoom NumberofRoom')  // Lấy tên phòng
            .populate('Services', 'Nameservices')  // Lấy tên dịch vụ
            .populate('Equipment', 'NameEquiment')  // Lấy tên thiết bị
            .populate('Branch', 'branchname')  // Lấy tên chi nhánh
            .populate('User', 'name email') // Lấy tên người dùng
            .populate('RoomType','NameRoomtype');


        if (!booking) {
            return res.status(404).json({ message: 'Phiếu đặt phòng không tồn tại.' });
        }
        res.status(200).json(booking);
    } catch (error) {
        console.error("Error in getBookingDetails:", error);
        res.status(500).json({ message: error.message });
    }
};
// Thêm phương thức deleteBooking để xóa đặt phòng
export const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params; // Lấy id từ params
        const booking = await Booking.findByIdAndDelete(id); // Xóa phiếu đặt phòng


        if (!booking) {
            return res.status(404).json({ message: 'Phiếu đặt phòng không tồn tại.' });
        }


        res.status(200).json({ message: 'Đặt phòng đã được hủy thành công.' });
    } catch (error) {
        console.error("Error in deleteBooking:", error);
        res.status(500).json({ message: error.message });
    }
};
// Dữ liệu booking của use
export const getBookingUser = async (req, res) => {
    try {
        const { id } = req.params; // Lấy id từ params
        // Lấy thông tin chi tiết của phiếu đặt phòng, bao gồm phòng, dịch vụ và thiết bị
        const booking = await Booking.find({User : id})
            .populate('Room', 'NameRoom NumberofRoom')  // Lấy tên phòng
            .populate('Services', 'Nameservices')  // Lấy tên dịch vụ
            .populate('Equipment', 'NameEquiment')  // Lấy tên thiết bị
            .populate('Branch', 'branchname')  // Lấy tên chi nhánh
            .populate('User', 'name email')// Lấy tên người dùng
            .populate('RoomType','NameRoomtype');


        if (!booking) {
            return res.status(404).json({ message: 'Phiếu đặt phòng không tồn tại.' });
        }


        res.status(200).json(booking);
    } catch (error) {
        console.error("Error in getBookingDetails:", error);
        res.status(500).json({ message: error.message });
    }
};
// Lấy dữ liệu hóa đơn người dùng
export const getInvoiceUser = async (req, res) => {
    try {
        const { id } = req.params; // Lấy id từ params
        // Lấy thông tin chi tiết của phiếu đặt phòng, bao gồm phòng, dịch vụ và thiết bị
        const booking = await Booking.find({User : id, Status : 'Check out'})
            .populate('Room Services Equipment Branch User RoomType')
        if (!booking) {
            return res.status(404).json({ message: 'Phiếu đặt phòng không tồn tại.' });
        }
        res.status(200).json(booking);
    } catch (error) {
        console.error("Error in getBookingDetails:", error);
        res.status(500).json({ message: error.message });
    }
};


// Lấy dữ liệu hóa đơn admin
export const getInvoice = async (req, res) => {
    try {
        // Lấy thông tin chi tiết của phiếu đặt phòng, bao gồm phòng, dịch vụ và thiết bị
        const booking = await Booking.find({Status : 'Check out'})
            .populate('Room Services Equipment Branch User RoomType')
        if (!booking) {
            return res.status(404).json({ message: 'Phiếu đặt phòng không tồn tại.' });
        }
        res.status(200).json(booking);
    } catch (error) {
        console.error("Error in getBookingDetails:", error);
        res.status(500).json({ message: error.message });
    }
};
// Lấy dữ liệu hóa đơn chưa thanh toán của admin
export const getInvoice1 = async (req, res) => {
    try {
        // Lấy thông tin chi tiết của phiếu đặt phòng, bao gồm phòng, dịch vụ và thiết bị
        const booking = await Booking.find({Status : 'Check out', InvoiceStatus: 'Chưa thanh toán'})
            .populate('Room Services Equipment Branch User RoomType')
        if (!booking) {
            return res.status(404).json({ message: 'Phiếu đặt phòng không tồn tại.' });
        }
        res.status(200).json(booking);
    } catch (error) {
        console.error("Error in getBookingDetails:", error);
        res.status(500).json({ message: error.message });
    }
};
// Cập nhật trạng thái đặt phòng
export const updateBookingStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;


    try {
        const booking = await Booking.findById(id).populate('User', 'email name');
        if (!booking) {
            return res.status(404).json({ message: 'Booking không tồn tại.' });
        }


        booking.Status = status;
        await booking.save();


        // Gửi email thông báo
        let subject, message;
        const checkInDate = new Date(booking.CheckInDate); // Chuyển đổi sang đối tượng Date
        const formattedDate = checkInDate.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        const formattedTime = checkInDate.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
        });


        switch (status) {
            case 'Xác nhận':
                subject = 'Xác nhận đặt phòng thành công';
                message = `Xin chào ${booking.User.name},\n\nĐặt phòng của bạn đã được xác nhận. Hãy chuẩn bị cho ngày nhận phòng ${formattedDate} lúc ${formattedTime}!`;
                break;
            case 'Hủy':
                subject = 'Đặt phòng bị hủy';
                message = `Xin chào ${booking.User.name},\n\nĐặt phòng của bạn đã bị hủy. Xin vui lòng liên hệ chúng tôi nếu bạn có thắc mắc.`;
                break;
            case 'Check in':
                subject = 'Chúc mừng bạn đã check in!';
                message = `Xin chào ${booking.User.name},\n\nBạn đã check in thành công! Chúng tôi rất mong được chào đón bạn. Nếu bạn cần hỗ trợ gì, hãy liên hệ với chúng tôi.`;
                break;
            default:
                return res.status(400).json({ message: 'Trạng thái không hợp lệ.' });
        }
        sendEmail(booking.User.email, subject, message);
        res.status(200).json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái đặt phòng.' });
    }
};
// Cập nhật trạng thái đặt hóa đơn
export const updateInvoiceStatus = async (req, res) => {
    const { id } = req.params;
    const { invoiceStatus } = req.body;


    try {
        const booking = await Booking.findById(id).populate('User', 'email name');
        if (!booking) {
            return res.status(404).json({ message: 'Booking không tồn tại.' });
        }
        booking.InvoiceStatus = invoiceStatus;
        // Lấy ngày hiện tại để cập nhật vào PaymentDate nếu trạng thái là "Đã thanh toán"
        if (invoiceStatus === 'Đã thanh toán') {
            booking.PaymentDate = new Date(); // Gán ngày hiện tại
        }


        await booking.save();


        // Gửi email thông báo
        let subject, message;
        switch (invoiceStatus) {
            case 'Đã thanh toán':
                subject = 'Xác nhận thanh toán';
                message = `Cảm ơn ${booking.User.name} đã thanh toán thành công hóa đơn ${booking.BookingCode}. Hẹn gặp bạn ở The Royal Sea vào một ngày không xa!`;
                break;
            default:
                return res.status(400).json({ message: 'Trạng thái không hợp lệ.' });
        }
        sendEmail(booking.User.email, subject, message);
        res.status(200).json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái đặt phòng.' });
    }
};


export const checkRoomAvailability = async (req, res) => {
    const { roomId, checkIn, checkOut } = req.query;
    try {
        const bookings = await Booking.find({
            Room: roomId,
            CheckInDate: { $lt: checkOut },
            CheckOutDate: { $gt: checkIn },
            status: { $in: ['Xác nhận', 'Check in', 'Chưa xác nhận'] }
        });
        const isAvailable = bookings.length === 0; // Nếu không có booking thì phòng khả dụng
        res.json({ isAvailable });
    } catch (error) {
        console.error('Lỗi khi kiểm tra tính khả dụng:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra khi kiểm tra tính khả dụng' });
    }
};
export const getBookingByCode = async (req, res) => {
    const { bookingCode } = req.params; // Lấy BookingCode từ URL
    try {
        // Tìm booking dựa trên mã BookingCode
        const booking = await Booking.findOne({ BookingCode: bookingCode })
            .populate('Room', 'NameRoom NumberofRoom')          // Lấy tên phòng
            .populate('Branch', 'branchname')      // Lấy tên chi nhánh
            .populate('User', 'name email')        // Lấy tên và email của người dùng
            .populate('Services')                  // Lấy thông tin dịch vụ
            .populate('Equipment')                 // Lấy thông tin thiết bị
            .select('-__v');                       // Loại bỏ trường __v nếu không cần thiết
        if (!booking) {
            return res.status(404).json({ message: 'Không tìm thấy đặt phòng với mã này.' });
        }
        res.status(200).json(booking);
    } catch (error) {
        console.error("Error in getBookingByCode:", error);
        res.status(500).json({ message: error.message });
    }
};
// Hàm để xử lý checkout
// Hàm để xử lý checkout
export const checkoutBooking = async (req, res) => {
    const { id } = req.params;
    const { damageFee, notes } = req.body;
    try {
        const booking = await Booking.findById(id).populate('User', 'email name');
        if (!booking) {
            return res.status(404).json({ message: 'Đặt phòng không tồn tại.' });
        }
        // Cập nhật ghi chú và giá thiệt hại
        booking.Notes = notes;
        booking.DamageFee = damageFee;
        booking.Status = 'Check out';
        // Lưu lại thay đổi
        const updatedBooking = await booking.save();
        // Gửi email thông báo
        let subject, message;
        subject = 'Chúc mừng bạn đã check out!';
        message = `
            Xin chào ${booking.User.name},<br><br>
            Bạn đã check out thành công! Vui lòng thanh toán bằng cách truy cập vào 
            <a href="http://localhost:5173/history/invoice/${id}">đường dẫn này</a>. 
            Hãy liên hệ với chúng tôi nếu bạn cần hỗ trợ thêm.<br><br>
            Trân trọng,<br>
            Đội ngũ hỗ trợ
        `;          
        sendEmail1(booking.User.email, subject, message);
        res.status(200).json(updatedBooking);
    } catch (error) {
        console.error('Lỗi khi checkout:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi checkout.' });
    }
};
export const getRoomEquipmentServiceStatsAPI = async (req, res) => {
    const { branchId, month, year } = req.params;

    try {
        const filter = {
            Branch: branchId,
            PaymentDate: {
                $gte: new Date(year, month - 1, 1),
                $lt: new Date(year, month, 1)
            }
        };
        

        // Tìm các booking theo filter
        const bookings = await Booking.find(filter).populate('Room');

        // Tính toán doanh thu phòng
        const roomRevenue = {};
        bookings.forEach(booking => {
            if (booking.Room && booking.TotalPrice) {
                const roomId = booking.Room._id.toString();
                roomRevenue[roomId] = (roomRevenue[roomId] || 0) + booking.TotalPrice;
            }
        });

        // Fetch dữ liệu doanh thu của các phòng
        const roomRevenueData = await Promise.all(Object.keys(roomRevenue).map(async roomId => {
            const room = await Room.findById(roomId);
            return { roomName: room.NameRoom, revenue: roomRevenue[roomId] };
        }));

// Tính toán số lượng thiết bị đã sử dụng
const equipmentUsed = {};
bookings.forEach(booking => {
    booking.Equipment.forEach(equip => {
        equipmentUsed[equip] = (equipmentUsed[equip] || 0) + 1;
    });
});

// Fetch dữ liệu thiết bị đã sử dụng
const equipmentData = await Promise.all(Object.keys(equipmentUsed).map(async id => {
    const equipment = await Equipmenthotel.findById(id); // Đảm bảo `Equipment` là model thiết bị chính xác
    return equipment ? { equipmentName: equipment.NameEquiment, count: equipmentUsed[id] } : null;
})).then(results => results.filter(item => item !== null)); // Lọc ra các kết quả `null`

// Tính toán số lượng dịch vụ đã sử dụng
const serviceUsed = {};
bookings.forEach(booking => {
    booking.Services.forEach(service => {
        serviceUsed[service] = (serviceUsed[service] || 0) + 1;
    });
});

// Fetch dữ liệu dịch vụ đã sử dụng
const serviceData = await Promise.all(Object.keys(serviceUsed).map(async id => {
    const service = await HotelServices.findById(id);
    return service ? { serviceName: service.Nameservices, count: serviceUsed[id] } : null;
})).then(results => results.filter(item => item !== null)); // Lọc ra các kết quả `null`


        // Trả về dữ liệu cho frontend
        res.json({
            roomRevenueData,
            equipmentData,
            serviceData
        });
    } catch (error) {
        console.error("Error fetching statistics:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};