import Equipment from "../models/Equipment.js";
import cloudinary from "cloudinary";
import ErrorHandler from "../middlewares/error.js";


//Thêm dịch vụ khách sạn
export const addEquipment = async (req, res, next) => {
    try {
        const { NameEquiment, DescribeEquipment, PriceEquipment } = req.body;


        if (!NameEquiment || !DescribeEquipment || !PriceEquipment || !req.files || !req.files.EquipmentImage) {
            return res.status(400).json({ message: 'Vui lòng không được để trống.' });
        }


        const existingEquipment = await Equipment.findOne({ NameEquiment });
        if (existingEquipment) {
            return res.status(400).json({ message: 'Thiết bị đã tồn tại.' });
        }


        const { EquipmentImage } = req.files;
        const allowedFormats = ["image/png", "image/jpeg", "image/webp"];


        // Lưu trữ ảnh đã tải lên vào Cloudinary
        const uploadedImages = [];
        const imagesArray = Array.isArray(EquipmentImage) ? EquipmentImage : [EquipmentImage]; // Đảm bảo luôn là mảng


        for (let image of imagesArray) {
            if (!allowedFormats.includes(image.mimetype)) {
                return next(new ErrorHandler("Định dạng tệp không được hỗ trợ!", 400));
            }


            // Tải từng ảnh lên Cloudinary
            const cloudinaryResponse = await cloudinary.uploader.upload(image.tempFilePath);
            if (!cloudinaryResponse || cloudinaryResponse.error) {
                console.error("Cloudinary Error:", cloudinaryResponse.error || "Unknown Cloudinary error");
                return next(new ErrorHandler("Tải lên hình ảnh thiết bị vào Cloudinary không thành công", 500));
            }


            // Thêm ảnh vào mảng uploadedImages
            uploadedImages.push({
                public_id: cloudinaryResponse.public_id,
                url: cloudinaryResponse.secure_url,
            });
        }


        const newEquipment = await Equipment.create({
            NameEquiment,
            DescribeEquipment,
            PriceEquipment,
            EquipmentImage: uploadedImages, // Lưu trữ URL của ảnh
        });


        res.status(201).json({ message: 'Thiết bị mới đã được thêm thành công.', Equipment: newEquipment });


    } catch (error) {
        console.error('Lỗi khi thêm thiết bị:', error);
        res.status(500).json({ message: 'Lỗi khi thêm thiết bị.', error: error.message });
    }
};


//Sửa dịch vụ khách sạn
export const updateEquipment = async (req, res) => {
    const { IDEquipment } = req.params;
    const { NameEquiment, DescribeEquipment, PriceEquipment } = req.body;


    try {
        const existingEquipment = await Equipment.findById(IDEquipment);
        if (!existingEquipment) {
            return res.status(404).json({ message: 'Thiết bị phòng không tồn tại.' });
        }


        existingEquipment.NameEquiment = NameEquiment || existingEquipment.NameEquiment;
        existingEquipment.DescribeEquipment = DescribeEquipment || existingEquipment.DescribeEquipment;
        existingEquipment.PriceEquipment = PriceEquipment || existingEquipment.PriceEquipment;


        // Kiểm tra và tải lên hình ảnh mới nếu có
        if (req.files && req.files.EquipmentImage) {
            const { EquipmentImage } = req.files;
            const allowedFormats = ["image/png", "image/jpeg", "image/webp"];


            const uploadedImages = [];
            const imagesArray = Array.isArray(EquipmentImage) ? EquipmentImage : [EquipmentImage];


            for (let image of imagesArray) {
                if (!allowedFormats.includes(image.mimetype)) {
                    return next(new ErrorHandler("Định dạng tệp không được hỗ trợ!", 400));
                }


                // Tải từng ảnh lên Cloudinary
                const cloudinaryResponse = await cloudinary.uploader.upload(image.tempFilePath);
                if (!cloudinaryResponse || cloudinaryResponse.error) {
                    console.error("Cloudinary Error:", cloudinaryResponse.error || "Unknown Cloudinary error");
                    return next(new ErrorHandler("Tải lên hình ảnh thiết bị vào Cloudinary không thành công", 500));
                }


                // Thêm ảnh vào mảng uploadedImages
                uploadedImages.push({
                    public_id: cloudinaryResponse.public_id,
                    url: cloudinaryResponse.secure_url,
                });
            }


            existingEquipment.EquipmentImage = uploadedImages; // Cập nhật hình ảnh mới
        }
       
        const updatedEquipment = await existingEquipment.save();
        res.status(200).json({ message: 'Thiết bị phòng đã được cập nhật thành công.', Equipment: updatedEquipment });
    } catch (error) {
        console.error('Lỗi khi cập nhật thiết bị phòng:', error);
        res.status(500).json({ message: 'Lỗi khi cập nhật thiết bị phòng.', error });
    }
};






// Xóa dịch vụ phòng
export const deleteEquipment = async (req, res) => {
    const { IDEquipment } = req.params;


    try {
        const equipment = await Equipment.findById(IDEquipment);
        if (!equipment) {
            return res.status(404).json({ message: 'Thiết bị phòng khách sạn không tồn tại.' });
        }


        await equipment.deleteOne();
        res.status(200).json({ message: 'Thiết bị phòng khách sạn đã được xóa thành công.' });
    } catch (error) {
        console.error('Lỗi khi xóa thiết bị phòng khách sạn:', error);
        res.status(500).json({ message: 'Lỗi khi xóa thiết bị phòng khách sạn.', error });
    }
};


// Lấy danh sách dịch vụ khách sạn
export const getallEquipment = async (req, res) => {
    const { page = 1, limit = 4 } = req.query;


    try {
        const equipment = await Equipment.find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();


        const count = await Equipment.countDocuments();


        res.status(200).json({
            equipment,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách thiết bị phòng:', error);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách thiết bị phòng', error: error.message });
    }
};
export const getAllEquipment1 = async (req, res) => {
    try {
        const equipment = await Equipment.find().exec(); // Lấy toàn bộ danh sách thiết bị


        res.status(200).json({
            equipment,
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách thiết bị phòng:', error);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách thiết bị phòng', error: error.message });
    }
};



