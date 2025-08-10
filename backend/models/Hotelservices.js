import { tr } from "framer-motion/client";
import mongoose from "mongoose";




const HotelservicesSchema = new mongoose.Schema({
    Nameservices: {
        type: String,
        required:true,
    },
    Describeservices:{
        type:String,
        required: true,
    },
    weekdays: {
        from: {
            type: String,
            required: true
        },  
        to: {
            type: String,
            required: true
        },    
        days: {
            type: String,
            required: true,
           
         }  
      },


    sunday: {
        from: {
            type: String,
            required: true
        },  
        to: {
            type: String,
            required: true
        },    
        day: {
            type: String,
            required: true
        }    
      },


    Locationservices: {
        type: String,
        required: true
    },
    Priceservices:{
        type: Number,
        required: true,
    },
    ServicesImage:[{
        public_id: String,
        url: String,
    }]


},{
    timestamps: true
});
HotelservicesSchema.methods.getFormattedPrice = function() {
    return (this.Priceservices / 100).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};
const Hotelservices = mongoose.model('HotelServices', HotelservicesSchema);
export default Hotelservices;