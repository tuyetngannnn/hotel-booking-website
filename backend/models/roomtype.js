import mongoose from "mongoose";

const roomtypeSchema = new mongoose.Schema({
    IDRoomtype: {
        type: String,
        required: true,
        unique: true,
    },
    NameRoomtype: {
        type: String,
        required: true,
    },
    PriceRoomtype:{
        type: Number,
        required: true,
    },
    MaxPeople: {
        type:Number,
        required:true,
    }
},{
    timestamps: true
});


roomtypeSchema.methods.getFormattedPrice = function() {
    return (this.PriceRoomtype / 100).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};
const RoomType = mongoose.model('RoomType', roomtypeSchema);
export default RoomType;