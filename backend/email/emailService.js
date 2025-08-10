import nodemailer from 'nodemailer';
import cron from 'node-cron';
import Booking from '../models/booking.js'; // Đảm bảo bạn đã import model Booking
// Import bất kỳ thư viện nào khác bạn cần
// Cấu hình Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'theroyalseahotel@gmail.com',
        pass: 'poes nmsb stdc bxgo'
        //pass: 'ikay iwso oabo uruv' của mk
    }
});
// Hàm gửi email
export const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: 'theroyalseahotel@gmail.com',
        to: to,
        subject: subject,
        text: text
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};
// Hàm gửi email
export const sendEmail1 = (to, subject, text) => {
    const mailOptions = {
        from: 'theroyalseahotel@gmail.com',
        to: to,
        subject: subject,
        html: text
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};
export const autoCancelBookings = async () => {
    try {
        const bookings = await Booking.find().populate('User'); // Lấy thông tin người dùng liên kết
        const now = new Date();
        for (const booking of bookings) {
            const checkInDate = new Date(booking.CheckInDate);
            if (booking.Status === 'Chưa xác nhận' && (checkInDate - now) <= 30 * 60 * 1000) {
                booking.Status = 'Hủy';
                await booking.save();
                if (booking.User?.email) { // Kiểm tra email người dùng
                    const subject = 'Đặt phòng đã bị hủy';
                    const message = `Xin chào ${booking.User.name},\n\nĐặt phòng của bạn đã bị hủy do không xác nhận trong thời gian quy định.`;
                    sendEmail(booking.User.email, subject, message);
                }
            }
            if (booking.Status === 'Xác nhận' && (now - checkInDate) > 30 * 60 * 1000) {
                booking.Status = 'Hủy';
                await booking.save();
                if (booking.User?.email) { // Kiểm tra email người dùng
                    const subject = 'Đặt phòng đã bị hủy';
                    const message = `Xin chào ${booking.User.name},\n\nĐặt phòng của bạn đã bị hủy do trễ giờ check-in.`;
                    sendEmail(booking.User.email, subject, message);
                }
            }
        }
    } catch (error) {
        console.error('Lỗi khi tự động hủy đặt phòng:', error);
    }
};
// Hàm kiểm tra và gửi email thông báo check-in
const checkAndSendCheckInEmails = async () => {
    try {
        const now = new Date(); // Lấy thời gian hiện tại
        const upcomingCheckIn = new Date(now.getTime() + 30 * 60000); // Thời gian check-in trong 30 phút tới


        // Tìm tất cả các booking có thời gian check-in trong 30 phút tới
        const bookings = await Booking.find({
            CheckInDate: { $gte: now, $lt: upcomingCheckIn },
            Status: 'Xác nhận' // Chỉ gửi cho các booking đã xác nhận
        }).populate('User', 'email name'); // Lấy thông tin người dùng
        const checkInDate = new Date(booking.CheckInDate); // Chuyển đổi sang đối tượng Date
        const formattedDate = checkInDate.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        const formattedTime = checkInDate.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
        });
        // Gửi email cho từng booking
        bookings.forEach(booking => {
            const userEmail = booking.User.email; // Lấy email của người dùng
            const userName = booking.User.name; // Lấy tên của người dùng
            const subject = 'Thông báo Check-in';
            const text = `Chào ${userName},\n\nBạn có một cuộc đặt phòng sắp đến vào ngày nhận phòng ${formattedDate} lúc ${formattedTime}!.. Mã đặt phòng của bạn là ${booking.BookingCode}, hãy lưu lại nó để sử Check in và làm nhiều thứ nữa!\nVui lòng đến check-in đúng giờ.\n\nCảm ơn!`;


            sendEmail(userEmail, subject, text); // Gửi email
        });
    } catch (error) {
        console.error('Error in checkAndSendCheckInEmails:', error);
    }
};
// Lên lịch chạy hàm autoCancelBookings mỗi phút
cron.schedule('* * * * *', autoCancelBookings);
cron.schedule('* * * * *', checkAndSendCheckInEmails);