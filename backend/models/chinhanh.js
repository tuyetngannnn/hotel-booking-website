import mongoose from "mongoose";

const branchSchema = new mongoose.Schema({
    branchname: {
        type: String,
        required: true,
        unique: true,
    },
    branchlocation: {
        type: String,
        required: true
    }
},{
    timestamps: true
});

export default mongoose.model('Branch', branchSchema);
