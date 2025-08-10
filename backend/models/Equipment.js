import mongoose from 'mongoose';


const EquipmentSchema = new mongoose.Schema({
    NameEquiment: {
        type: String,
        required: true,
    },
    DescribeEquipment: {
        type: String,
        required: true,
    },
    PriceEquipment: {
        type: Number,
        required: true,
    },
    EquipmentImage: [{
        public_id: { type: String, required: true },
        url: { type: String, required: true }
    }]
});


const Equipment = mongoose.model('Equipment', EquipmentSchema);
export default Equipment;