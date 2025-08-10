import Hotelservices from "../models/Hotelservices.js"; // Đảm bảo đúng tên mô hình
import cloudinary from "cloudinary";
import ErrorHandler from "../middlewares/error.js";
import fileUpload from 'express-fileupload';
 // Đảm bảo import ErrorHandler đúng cách


 export const addHotelServices = async (req, res, next) => {
    try {
        const {
            Nameservices,
            Describeservices,
            weekdays: weekdaysInput,
            sunday: sundayInput,
            Locationservices,
            Priceservices
        } = req.body;


        if (!Nameservices || !Describeservices || !Locationservices || !Priceservices || !weekdaysInput || !sundayInput) {
            return res.status(400).json({ message: 'Vui lòng không để trống bất kỳ trường nào.' });
        }


        const existingService = await Hotelservices.findOne({ Nameservices });
        if (existingService) {
            return res.status(400).json({ message: 'Dịch vụ đã tồn tại.' });
        }


        const weekdays = Object.create(null);
        Object.assign(weekdays, weekdaysInput);


        const sunday = Object.create(null);
        Object.assign(sunday, sundayInput);


        if (!req.files || !req.files.ServicesImage) {
            return next(new ErrorHandler("Ảnh dịch vụ không được để trống!", 400));
        }


        const { ServicesImage } = req.files;
        const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
        const uploadedImages = [];


        const imagesArray = Array.isArray(ServicesImage) ? ServicesImage : [ServicesImage];


        for (let image of imagesArray) {
            if (!allowedFormats.includes(image.mimetype)) {
                return res.status(400).json({ message: 'Định dạng ảnh không hợp lệ. Chỉ chấp nhận PNG, JPEG và WEBP.' });
            }
            const cloudinaryResponse = await cloudinary.uploader.upload(image.tempFilePath);
            uploadedImages.push({ public_id: cloudinaryResponse.public_id, url: cloudinaryResponse.secure_url });
        }


        const newService = await Hotelservices.create({
            Nameservices,
            Describeservices,
            weekdays,
            sunday,
            Locationservices,
            Priceservices,
            ServicesImage: uploadedImages
        });


        res.status(201).json({ message: 'Dịch vụ mới đã được thêm thành công.', service: newService });
    } catch (error) {
        next(new ErrorHandler("Đã xảy ra lỗi khi thêm dịch vụ.", 500));
    }
};


// Sửa dịch vụ khách sạn
export const updateHotelServices = async (req, res) => {
    const { id } = req.params;
    const {
        Nameservices,
        Describeservices,
        weekdays: weekdaysInput,
        sunday: sundayInput,
        Locationservices,
        Priceservices
    } = req.body;


    console.log(req.body); // Kiểm tra dữ liệu đầu vào


    try {
        const existingHotelservices = await Hotelservices.findOne({ _id: id });
        if (!existingHotelservices) {
            return res.status(404).json({ message: 'Dịch vụ phòng không tồn tại.' });
        }


        // Kiểm tra các trường bắt buộc
        if (!Nameservices || !Describeservices || !Locationservices || !Priceservices ||
            !weekdaysInput || !sundayInput ||!req.file ||!req.file.ServicesImage) {
            return res.status(400).json({ message: 'Vui lòng không để trống bất kỳ trường nào.' });
        }


        const uploadedImages = [];
        if (req.files && req.files.ServicesImage) {
            const { ServicesImage } = req.files;
            const allowedFormats = ["image/png", "image/jpeg", "image/webp"];


            const imagesArray = Array.isArray(ServicesImage) ? ServicesImage : [ServicesImage];


            for (let image of imagesArray) {
                if (!allowedFormats.includes(image.mimetype)) {
                    return res.status(400).json({ message: "Định dạng tệp không được hỗ trợ!" });
                }


                const cloudinaryResponse = await cloudinary.uploader.upload(image.tempFilePath);
                if (!cloudinaryResponse || cloudinaryResponse.error) {
                    return res.status(500).json({ message: "Tải lên hình ảnh dịch vụ không thành công." });
                }


                uploadedImages.push({
                    public_id: cloudinaryResponse.public_id,
                    url: cloudinaryResponse.secure_url,
                });
            }
        }


        // Cập nhật các trường dịch vụ
        existingHotelservices.Nameservices = Nameservices;
        existingHotelservices.Describeservices = Describeservices;


        // Cập nhật weekdays
        const weekdays = Object.create(null);
        Object.assign(weekdays, weekdaysInput);
        existingHotelservices.weekdays = weekdays;


        // Cập nhật sunday
        const sunday = Object.create(null);
        Object.assign(sunday, sundayInput);
        existingHotelservices.sunday = sunday;


        existingHotelservices.Locationservices = Locationservices;
        existingHotelservices.Priceservices = Priceservices;


        // Nếu có ảnh được tải lên, cập nhật ảnh
        // if (uploadedImages.length > 0) {
        //     existingHotelservices.ServicesImage = uploadedImages;
        // }


        const updatedHotelServices = await existingHotelservices.save();
        res.status(200).json({ message: 'Dịch vụ phòng đã được cập nhật thành công.', Hotelservices: updatedHotelServices });
    } catch (error) {
        console.error('Lỗi khi cập nhật dịch vụ phòng:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật dịch vụ phòng.', error: error.message });
    }
};


// Xóa dịch vụ phòng
export const deleteHotelservices = async (req, res) => {
    const { IDHotelServices } = req.params;


    try {
        const hotelservices = await Hotelservices.findById(IDHotelServices); // Sử dụng Hotelservices và tìm theo _id
        if (!hotelservices) {
            return res.status(404).json({ message: 'Dịch vụ khách sạn không tồn tại.' });
        }


        await hotelservices.deleteOne();
        res.status(200).json({ message: 'Dịch vụ khách sạn đã được xóa thành công.' });
    } catch (error) {
        console.error('Lỗi khi xóa dịch vụ khách sạn:', error);
        res.status(500).json({ message: 'Lỗi khi xóa dịch vụ khách sạn.', error });
    }
};


// Lấy danh sách dịch vụ khách sạn
export const getHotelServices = async (req, res) => {
    const { page = 1, limit = 4 } = req.query;


    try {
        const hotelservices = await Hotelservices.find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();


        const count = await Hotelservices.countDocuments();


        res.status(200).json({
            hotelservices,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách dịch vụ:', error);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách dịch vụ', error: error.message });
    }
};




//chi tiết dịch vụ
export const getServicesDetails = async (req, res) => {
    try {
      // Sử dụng populate để lấy dữ liệu tham chiếu từ RoomType và Branch
      const services = await Hotelservices.findById(req.params.serviceId)
        // .populate('IDRoomType') // Lấy thông tin RoomType
        // .populate('IDBranch');   // Lấy thông tin Branch (nếu cần)
     
      if (!services) {
        return res.status(404).json({ message: "Dịch vụ không tồn tại" });
      }
 
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Lỗi server" });
    }
  };


  export const getHotelServices1 = async (req, res) => {


    try {
        const hotelservices = await Hotelservices.find().exec();
        res.status(200).json({
            hotelservices
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách dịch vụ:', error);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách dịch vụ', error: error.message });
    }
};


//Hiển thị tất cả dịch vụ
export const getallHotelServices = async (req, res) => {
    try {
        const allHotelServices = await Hotelservices.find()
           
        res.status(200).json({ services: allHotelServices }); // Trả về rooms thay vì allRoom
    } catch (error) {
        console.error('Lỗi khi lấy tất cả dịch vụ phòng:', error);
        res.status(500).json({ message: 'Lỗi khi lấy tất cả dịch vụ .', error });
    }
};
