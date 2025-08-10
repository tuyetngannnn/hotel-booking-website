import express from 'express';
import { checkoutBooking, checkRoomAvailability, createBooking, deleteBooking, getAllBookings, getBookingByCode, getBookingDetails, getBookingForm, getBookings, getBookings1, getBookings2, getBookings3, getBookings4, getBookingUser, getInvoice, getInvoice1, getInvoiceUser, getRoomEquipmentServiceStatsAPI, updateBookingStatus, updateInvoiceStatus } from '../controllers/bookingController.js';

const router = express.Router();

router.get('/booking/:id', getBookingForm);
router.post('/create', createBooking);
//lấy hết
router.get('/allbookings', getAllBookings);
//chua xac nhan
router.get('/bookings', getBookings);
//xacnhan
router.get('/bookings1', getBookings1);
//checkin
router.get('/bookings2', getBookings2);
//checkout
router.get('/bookings3', getBookings3);
//huy
router.get('/bookings4', getBookings4);
router.get('/bookings/:id', getBookingDetails);
router.get('/bookingsuser/:id', getBookingUser);
router.get('/invoice/:id', getInvoiceUser);
router.get('/invoice', getInvoice);
//hóa đơn chưa xác nhận
router.get('/invoice1', getInvoice1);
router.get('/checkAvailability', checkRoomAvailability);
router.put('/bookings/:id/status', updateBookingStatus);
router.put('/bookings/:id/confirm-payment', updateInvoiceStatus);
router.get('/:bookingCode', getBookingByCode);
router.delete('/bookings/:id', deleteBooking); // Thêm route xóa đặt phòng
router.put('/bookings/:id/checkout', checkoutBooking);
router.get('/stats/:branchId/:month/:year', getRoomEquipmentServiceStatsAPI)
const BookingRouter = (app) => {
    app.use('/booking', router);
};
export default BookingRouter;

