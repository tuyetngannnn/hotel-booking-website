// controllers/serviceRequestController.js
import ServiceRequest from '../models/ServiceRequest.js';
import Booking from '../models/booking.js';

// Tạo yêu cầu thêm dịch vụ
export const createServiceRequest = async (req, res) => {
    const { BookingCode, Services, Equipment, User, TotalAmount } = req.body; // Thêm UserId vào yêu cầu

    const newRequest = new ServiceRequest({
        BookingCode,
        Services,
        Equipment,
        User, 
        TotalAmount,
        Status: 'Chưa xác nhận',
    });
    console.log(newRequest)
    try {
        await newRequest.save();
        res.status(201).json({ message: 'Yêu cầu thêm dịch vụ đã được gửi.' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo yêu cầu.', error });
    }
};

// Lấy danh sách yêu cầu
export const getServiceRequests = async (req, res) => {
    try {
        const requests = await ServiceRequest.find()
        .populate('Services Equipment User'); // Thêm UserId vào populate nếu cần
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy yêu cầu.', error });
    }
};
// Lấy danh sách yêu cầu dựa trên userid
export const getServiceRequests2 = async (req, res) => {
    try {
        const { id } = req.params;
        const requests = await ServiceRequest.find({User : id})
        .populate('Services Equipment User'); // Thêm UserId vào populate nếu cần
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy yêu cầu.', error });
    }
};
// Lấy danh sách detail dựa trên id
export const getServiceRequestsDetail = async (req, res) => {

    try {
        const { id } = req.params;
        const requests = await ServiceRequest.findById(id)
        .populate('Services Equipment User'); // Thêm UserId vào populate nếu cần
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy yêu cầu.', error });
    }
};

// Lấy danh sách yêu cầu
export const getServiceRequests1 = async (req, res) => {
    try {
        const requests = await ServiceRequest.find({Status : 'Chưa xác nhận'})
        .populate('Services Equipment User'); // Thêm UserId vào populate nếu cần
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy yêu cầu.', error });
    }
};

export const acceptServiceRequest = async (req, res) => {
    try {
        // Tìm yêu cầu dịch vụ và cập nhật trạng thái
        const request = await ServiceRequest.findByIdAndUpdate(req.params.id, { Status: 'Xác Nhận' }, { new: true });
        if (!request) {
            return res.status(404).json({ message: 'Yêu cầu không tìm thấy.' });
        }

        // Tìm booking theo BookingCode
        const booking = await Booking.findOne({ BookingCode: request.BookingCode });
        if (booking) {
            // Cập nhật danh sách dịch vụ và thiết bị
            booking.Services.push(...request.Services);
            booking.Equipment.push(...request.Equipment);
            
            // Cộng giá cũ với giá mới
            const newTotalAmount = booking.TotalPrice + request.TotalAmount; // giả định request có thuộc tính TotalAmount
            booking.TotalPrice = newTotalAmount;

            // Lưu booking
            await booking.save();
        }

        res.json({ message: 'Yêu cầu đã được xác nhận.', request });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xác nhận yêu cầu.', error });
    }
};
// Hủy yêu cầu dịch vụ
export const cancelServiceRequest = async (req, res) => {
    const { id } = req.params;

    try {
        // Tìm yêu cầu dịch vụ theo ID
        const serviceRequest = await ServiceRequest.findById(id);

        if (!serviceRequest) {
            return res.status(404).json({ message: 'Yêu cầu không tồn tại.' });
        }

        // Cập nhật trạng thái yêu cầu thành 'Hủy'
        serviceRequest.Status = 'Hủy';

        // Lưu lại thay đổi
        const updatedRequest = await serviceRequest.save();

        // Trả về yêu cầu đã cập nhật
        res.status(200).json({ message: 'Yêu cầu đã được hủy.', request: updatedRequest });
    } catch (error) {
        console.error('Lỗi khi hủy yêu cầu:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi hủy yêu cầu.' });
    }
};
export const cancelServiceRequest1 = async (req, res) => {
    const { id } = req.params;

    try {
        // Tìm yêu cầu dịch vụ theo ID và xóa nó
        const serviceRequest = await ServiceRequest.findByIdAndDelete(id);

        if (!serviceRequest) {
            return res.status(404).json({ message: 'Yêu cầu không tồn tại.' });
        }

        // Trả về thông báo xóa thành công
        res.status(200).json({ message: 'Yêu cầu đã được xóa.' });
    } catch (error) {
        console.error('Lỗi khi xóa yêu cầu:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa yêu cầu.' });
    }
};


