import Room from "../models/room.js";
import cloudinary from "cloudinary";
import ErrorHandler from "../middlewares/error.js"; // Đảm bảo bạn đã import ErrorHandler


// Thêm phòng
export const addRoom = async (req, res, next) => {
    try {
        const { NumberofRoom, NameRoom, Describe, IDRoomType, IDBranch,acreage} = req.body;


        // Kiểm tra xem có file ảnh nào được upload không
        if (!req.files || !req.files.RoomImages || req.files.RoomImages.length === 0) {
            return next(new ErrorHandler("Ảnh phòng không được để trống!", 400));
        }


        const { RoomImages } = req.files;
        const allowedFormats = ["image/png", "image/jpeg", "image/webp"];


        // Lưu trữ ảnh đã tải lên vào Cloudinary
        const uploadedImages = [];
        const imagesArray = Array.isArray(RoomImages) ? RoomImages : [RoomImages]; // Đảm bảo luôn là mảng


       
// Kiểm tra mỗi ảnh
for (let image of RoomImages) {
    if (!image || !image.mimetype) {
        return next(new ErrorHandler("Không thể đọc thông tin tệp tin hình ảnh.", 400));
    }


    if (!allowedFormats.includes(image.mimetype)) {
        return next(new ErrorHandler("Định dạng tệp không được hỗ trợ!", 400));
    }


    // Tải từng ảnh lên Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(image.tempFilePath);
    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error("Cloudinary Error:", cloudinaryResponse.error || "Unknown Cloudinary error");
        return next(new ErrorHandler("Tải lên hình ảnh phòng vào Cloudinary không thành công", 500));
    }


    // Thêm ảnh vào mảng uploadedImages
    uploadedImages.push({
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
    });
}


        // Kiểm tra các trường cần thiết
        if (!NumberofRoom || !NameRoom || !Describe || !IDRoomType || !IDBranch || !acreage || uploadedImages.length === 0) {
            return res.status(400).json({ message: 'Vui lòng không được để trống.' });
        }


        // Kiểm tra số phòng
        // if (NumberofRoom.length !== 4 || isNaN(NumberofRoom)) {
        //     return res.status(400).json({ message: 'Số phòng phải là 4 số.' });
        // }


        // Kiểm tra xem số phòng đã tồn tại chưa
        const existingNumberRoom = await Room.findOne({NumberofRoom});
        if (existingNumberRoom) {
            return res.status(400).json({ message: 'Số Phòng đã tồn tại.' });
        }
        // Kiểm tra xem phòng đã tồn tại chưa
        const existingRoom = await Room.findOne({ NameRoom });
        if (existingRoom) {
            return res.status(400).json({ message: 'Phòng đã tồn tại.' });
        }


        // Tạo phòng mới với các ảnh đã tải lên
        const newRoom = await Room.create({
            NumberofRoom,
            NameRoom,
            Describe,
            IDRoomType,
            IDBranch,
            acreage,
            RoomImages: uploadedImages, // Lưu mảng ảnh đã tải lên
        });


        res.status(201).json({ message: 'Phòng mới đã được thêm thành công.', room: newRoom });
    } catch (error) {
        console.error('Lỗi khi thêm phòng:', error);
        res.status(500).json({ message: 'Lỗi khi thêm phòng.', error: error.message });
    }
};




// Sửa thông tin phòng
export const updateRoom = async (req, res, next) => {
    const { idroom } = req.params;
    const { NumberofRoom, NameRoom, Describe, IDRoomType, IDBranch, acreage } = req.body;


    try {
        const existingRoom = await Room.findById(idroom);
        if (!existingRoom) {
            return res.status(404).json({ message: 'Phòng không tồn tại.' });
        }


        // Kiểm tra các trường cần thiết
        if (!NumberofRoom || !NameRoom || !Describe || !IDRoomType || !IDBranch || !acreage) {
            return res.status(400).json({ message: 'Vui lòng không để trống các trường thông tin.' });
        }


        // Kiểm tra nếu có file ảnh mới được upload
        const uploadedImages = [];
        if (req.files && req.files.RoomImages) {
            const { RoomImages } = req.files;
            const allowedFormats = ["image/png", "image/jpeg", "image/webp"];


            // Kiểm tra xem RoomImages có phải là một mảng hay không
            const imagesArray = Array.isArray(RoomImages) ? RoomImages : [RoomImages];


            // Tải ảnh mới lên Cloudinary
            for (let image of imagesArray) {
                if (!allowedFormats.includes(image.mimetype)) {
                    return next(new ErrorHandler("Định dạng tệp không được hỗ trợ!", 400));
                }


                const cloudinaryResponse = await cloudinary.uploader.upload(image.tempFilePath);
                if (!cloudinaryResponse || cloudinaryResponse.error) {
                    return next(new ErrorHandler("Tải lên hình ảnh phòng vào Cloudinary không thành công", 500));
                }


                // Thêm ảnh vào mảng uploadedImages
                uploadedImages.push({
                    public_id: cloudinaryResponse.public_id,
                    url: cloudinaryResponse.secure_url,
                });
            }
        }


        // Nếu có ảnh mới, cập nhật RoomImages, nếu không giữ lại ảnh cũ
        if (uploadedImages.length > 0) {
            existingRoom.RoomImages = uploadedImages;
        }


        // Cập nhật các trường khác
        existingRoom.NumberofRoom = NumberofRoom;
        existingRoom.NameRoom = NameRoom;
        existingRoom.Describe = Describe;
        existingRoom.IDRoomType = IDRoomType;
        existingRoom.IDBranch = IDBranch;
        existingRoom.acreage = acreage;


        const updatedRoom = await existingRoom.save();
        res.status(200).json({ message: 'Phòng đã được cập nhật thành công.', room: updatedRoom });
    } catch (error) {
        console.error('Lỗi khi cập nhật phòng:', error);
        res.status(500).json({ message: 'Lỗi khi cập nhật phòng.', error });
    }
};


// Xóa phòng
export const deleteRoom = async (req, res) => {
    const { idroom } = req.params;


    try {
        // Tìm kiếm phòng theo _id
        const room = await Room.findById(idroom);
        if (!room) {
            return res.status(404).json({ message: 'Phòng không tồn tại.' });
        }


        await Room.deleteOne({ _id: idroom }); // Xóa phòng theo _id
        res.status(200).json({ message: 'Phòng đã được xóa thành công.' });
    } catch (error) {
        console.error('Lỗi khi xóa phòng:', error);
        res.status(500).json({ message: 'Lỗi khi xóa phòng.', error });
    }
};








//Lấy danh sách phòng
export const getRooms = async (req, res) => {
    const { page = 1, limit = 4 } = req.query;


    try {
        // Sử dụng populate để lấy dữ liệu RoomType và Branch
        const rooms = await Room.find()
            .populate('IDRoomType', 'MaxPeople') // Lấy MaxPeople từ RoomType
            .populate('IDBranch', 'branchname') // Lấy branchName từ Branch
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();


        // Đếm tổng số phòng
        const count = await Room.countDocuments();


        res.status(200).json({
            rooms,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách phòng', error: error.message });
    }
};


//Chi tiết phòng
export const getRoomDetails = async (req, res) => {
    try {
        // Sử dụng populate để lấy dữ liệu tham chiếu từ RoomType và Branch
        const room = await Room.findById(req.params.roomId)
        .populate('IDRoomType', 'PriceRoomtype NameRoomtype MaxPeople') // Lấy cả NameRoomtype và PriceRoomtype từ RoomType
            .populate('IDBranch', 'branchname'); // Lấy branchname từ Branch
           
        if (!room) {
            return res.status(404).json({ message: "Phòng không tồn tại" });
        }


        res.json(room);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};




//Lấy tất cả phòng
export const getallRoom = async (req, res) => {
    try {
        const allRoom = await Room.find()
            .populate('IDRoomType', 'NameRoomtype') // Lấy thuộc tính NameRoomtype từ RoomType
            .populate('IDBranch', 'branchname'); // Lấy thuộc tính branchname từ Branch
        res.status(200).json({ rooms: allRoom }); // Trả về rooms thay vì allRoom
    } catch (error) {
        console.error('Lỗi khi lấy tất cả phòng:', error);
        res.status(500).json({ message: 'Lỗi khi lấy tất cả phòng.', error });
    }
};


// Lấy chi tiết phòng theo ID
export const getRoomById = async (req, res) => {
    const { id } = req.params;
    //NameRoomtype PriceRoomtype
    try {
        const room = await Room.findById(id)
            .populate('IDRoomType', 'MaxPeople NameRoomtype PriceRoomtype') // Populate tất cả các trường cần thiết từ IDRoomType
            .populate('IDBranch', 'branchname'); // Populate branchname từ IDBranch


        if (!room) {
            return res.status(404).json({ message: 'Phòng không tồn tại.' });
        }
        res.status(200).json({ room });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy chi tiết phòng', error: error.message });
    }
};