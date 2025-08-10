import mongoose from "mongoose";
import validator from "validator";


const messageSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      validate: [validator.isEmail, "Provide A Valid Email!"],
    },
    message: {
      type: String,
      required: true,
    },
  }, { timestamps: true });
export const Message = mongoose.model("Message", messageSchema);