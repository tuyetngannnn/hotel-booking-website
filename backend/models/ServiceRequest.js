import mongoose from 'mongoose';

const serviceRequestSchema = new mongoose.Schema({
    BookingCode: { type: String, required: true },
    Services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'HotelServices' }],
    Equipment: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' }],
    User: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    TotalAmount: { type: Number, default: 0 },
    Status: { type: String },
    CreatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);
export default ServiceRequest;

