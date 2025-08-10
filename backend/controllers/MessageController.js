import {Message} from "../models/message.js";
import ErrorHandler from "../middlewares/error.js";


import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";






export const sendMessage = async (req, res, next) => {
  const { name,  email, message } = req.body;
  if (!name ||  !email  || !message) {
    return next(new ErrorHandler("Please fill full form", 400))
  }
  await Message.create({ name, email, message });
  res.status(200).json({
    success: true,
    message: "Message Sent!",
  });
};


export const getAllMessages = catchAsyncErrors(async (req, res, next) => {
    const messages = await Message.find().sort({ createdAt: -1 }); // Sắp xếp theo ngày tạo giảm dần
    res.status(200).json({
      success: true,
      message: messages,
    });
  });
 


  // controller
export const replyMessage = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;  // ID của tin nhắn cần trả lời
 
    // Cập nhật trạng thái isReplied thành true
    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      { isReplied: true },
      { new: true } // Trả về đối tượng tin nhắn đã cập nhật
    );
 
    if (!updatedMessage) {
      return next(new ErrorHandler("Message not found", 404));
    }
 
    res.status(200).json({
      success: true,
      message: updatedMessage,
    });
  });
 