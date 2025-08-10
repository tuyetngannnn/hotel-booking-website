import RoomType from "../models/roomtype.js"


//Thêm loại phòng
export const addRoomType = async (req, res) => {
    const { IDRoomtype, NameRoomtype, PriceRoomtype, MaxPeople } = req.body;
    console.log('Received data:', req.body);
    
  
    if (!IDRoomtype || !NameRoomtype || !PriceRoomtype || !MaxPeople) {
        return res.status(400).json({ message: 'Vui lòng không được để trống.' });
    }

    try {
      
        const existingRoomType = await RoomType.findOne({ NameRoomtype });
        if (existingRoomType) {
            return res.status(400).json({ message: 'Loại phòng đã tồn tại.' });
        }

     
        const newRoomType = await RoomType.create({ IDRoomtype, NameRoomtype, PriceRoomtype, MaxPeople });
        res.status(201).json({ message: 'Loại phòng mới đã được thêm thành công.', roomtype: newRoomType });
        
    } catch (error) {
        console.error('Lỗi khi thêm loại phòng:', error);
        res.status(500).json({ message: 'Lỗi khi thêm loại phòng.', error });
    }
};

//Sửa loại phòng
export const updateRoomType = async (req, res) => {
    const { IDRoomtype } = req.params; 
    const { NameRoomtype, PriceRoomtype, MaxPeople } = req.body;

    try {
     
        const existingRoomType = await RoomType.findOne({ IDRoomtype });
        if (!existingRoomType) {
            return res.status(404).json({ message: 'Loại phòng không tồn tại.' });
        }

        existingRoomType.NameRoomtype = NameRoomtype;
        existingRoomType.PriceRoomtype = PriceRoomtype;
        existingRoomType.MaxPeople = MaxPeople;
        
        const updatedRoomType = await existingRoomType.save();
        res.status(200).json({ message: 'Loại phòng đã được cập nhật thành công.', roomtype: updatedRoomType });
    } catch (error) {
        console.error('Lỗi khi cập nhật loại phòng:', error);
        res.status(500).json({ message: 'Lỗi khi cập nhật loại phòng.', error });
    }
};

//Xóa loại phòng
export const deleteRoomType = async (req, res) => {
    const { IDRoomtype } = req.params;

    try {
       
        const roomType = await RoomType.findOne({ IDRoomtype });
        if (!roomType) {
            return res.status(404).json({ message: 'Loại phòng không tồn tại.' });
        }

       
        await RoomType.deleteOne({ IDRoomtype });
        res.status(200).json({ message: 'Loại phòng đã được xóa thành công.' });
    } catch (error) {
        console.error('Lỗi khi xóa loại phòng:', error);
        res.status(500).json({ message: 'Lỗi khi xóa loại phòng.', error });
    }
};

//Lấy tất cả loại phòng
export const getallRoomtype = async (req, res) => {
    try {
      
        const allRoomTypes = await RoomType.find();

        res.status(200).json(allRoomTypes);
    } catch (error) {
        console.error('Lỗi khi lấy tất cả loại phòng:', error);
        res.status(500).json({ message: 'Lỗi khi lấy tất cả loại phòng.', error });
    }
};
