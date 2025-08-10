import mongoose from "mongoose";


const roomSchema = new  mongoose.Schema ({
    NumberofRoom: {
        type: String,
        required: true, 
        unique: true ,
        validate: {
            validator: function(v) {
                return /^[A-Za-z0-9]+$/.test(v); // Cho phép chữ cái và số
            },
            message: props => `${props.value} chỉ được chứa chữ cái và số!`
        }
    },
    NameRoom: { 
        type: String, 
        required: true
    },
    Describe: { 
        type: String 
    },
    IDRoomType: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: 'RoomType' // Tham chiếu đến RoomType
    },
    IDBranch: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: 'Branch' // Tham chiếu đến Branch
    },
    RoomImages: [{
        public_id: String,
        url: String,
    }],
    acreage:{
        type: Number,
        
    }

}, {
    timestamps: true
});


export default mongoose.model('Room', roomSchema);