// eslint-disable-next-line no-unused-vars
import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"

import HomeLeTan from './page/LeTan/Home/HomeLeTan.jsx'
import GetallMessage from './page/LeTan/GetAllMessage/GetallMessage.jsx'

import Home from './page/Home/Home.jsx'
import Login from './page/Login/Login.jsx'
import SignUp from './page/SignUp/SignUp.jsx'
import ForgotPassword from './page/Login/ForgotPassword.jsx'
import ResetPassword from './page/Login/ResetPassword.jsx'
import Room from './page/Room/Room.jsx'
import Service from './page/Services/Service.jsx'
import Brand from "./page/Brand/Brand.jsx";
import DetailService from './page/Services/DetailService.jsx'
import Contact from './page/Contact/Contact.jsx';
import Location from './page/Location/Location.jsx'
import RoomDetail from './page/Room/RoomDetail.jsx'
import Booking from './page/Booking/Booking.jsx'
import Profile from './page/Profile/Profile.jsx'
import ListBookingUser from './page/Booking/ListBookingUser.jsx'
import BookingUserDetail from './page/Booking/BookingUserDetail.jsx'
import RequestUserDetail from './page/Booking/RequestUserDetail.jsx'
import ListRequestUser from './page/Booking/ListRequestUser.jsx'
import InvoiceDetailUser from './page/Booking/InvoiceDetailUser.jsx'
import InvoiceUser from './page/Booking/InvoiceUser.jsx'
import ProfileAdmin from './page/Admin/Account/ProfileAdmin.jsx'
import UserManagerment from './page/Admin/AccountManager/UserManagerment.jsx'

import LoginAdmin from './page/LoginAdmin/LoginAdmin.jsx'
import HomeAdmin from './page/Admin/Home/HomeAdmin.jsx'
import ListBooking from './page/Admin/Booking/ListBooking.jsx'
import Daxacnhan from './page/Admin/Booking/Daxacnhan.jsx'
import DaCheckin from './page/Admin/Booking/Dacheckin.jsx'
import DaCheckout from './page/Admin/Booking/Dacheckout.jsx'
import DaHuy from './page/Admin/Booking/Dahuy.jsx'
import DetailDaxacnhan from './page/Admin/Booking/Detaildaxacnhan.jsx'
import DetailDaCheckin from './page/Admin/Booking/Detaildacheckin.jsx'
import DetailDaCheckout from './page/Admin/Booking/Detaildacheckout.jsx'
import DetailDaHuy from './page/Admin/Booking/Detaildahuy.jsx'
import BookingDetail from './page/Admin/Booking/BookingDetail.jsx'
import Detailycchuaxacnhan from './page/Admin/Booking/Detailycchuaxacnhan.jsx'
import Detailyc from './page/Admin/Booking/Detailyc.jsx'
import RoomTypeManager from './page/Admin/RoomTypeManager/RoomTypeManager.jsx'
import RoomManager from './page/Admin/RoomManager/RoomManager.jsx'
import SearchBar from './components/Search/SearchBar.jsx'
import PendingServiceRequests from './page/Admin/Booking/PendingServiceRequests.jsx'
import ListServiceRequests from './page/Admin/Booking/ListServiceRequests.jsx'
import HotelServicesManager from './page/Admin/HotelServices/HotelServicesManager.jsx'
import EquipmentManagement from './page/Admin/EquipmentManagement/EquipmentManagement.jsx'
import ListInvoice from './page/Admin/Booking/ListInvoice.jsx'
import UnconfirmedInvoiceList from './page/Admin/Booking/UnconfirmedInvoiceList.jsx'
import DetailInvoice from './page/Admin/Booking/DetailInvoice.jsx'
import Statistics from './page/Admin/ThongKe/Statistics.jsx'


import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./components/Translation/EN/global.json";
import vi from "./components/Translation/VN/global.json";
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    vi: { translation: vi },
  },
  lng: "vi", // Ngôn ngữ mặc định
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});




const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/roomlist" element={<Room />} />
        <Route path="/roomdetail/:roomId" element={<RoomDetail />} />
        <Route path="/booking/:id" element={<Booking />} />
        <Route path="/service" element={<Service />} />
        <Route path="/brand" element={<Brand />} />
        <Route path="/detail-service/:serviceId" element={<DetailService />} />
        <Route path="/contactus" element={<Contact />} />
        <Route path="/location" element={<Location />} />
        <Route path="/search" element={<SearchBar />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/history/bookingsuser/:id" element={<BookingUserDetail />} />
        <Route path="/history/bookingsuser" element={<ListBookingUser />} />
        <Route path="/history/bookingsycuser" element={<ListRequestUser />} />
        <Route path="/history/bookingsycuser/:id" element={<RequestUserDetail />} />
        <Route path="/history/invoice" element={<InvoiceUser />} />
        <Route path="/history/invoice/:id" element={<InvoiceDetailUser />} />
        <Route path="/accountmanager" element={<UserManagerment />} />
        <Route path="/profileAdmin" element={<ProfileAdmin />} />

        <Route path="/admin" element={<LoginAdmin />} />
        <Route path="/homeadmin" element={<HomeAdmin />} />
        <Route path="/homeadmin/chuaxacnhan" element={<ListBooking />} />
        <Route path="/bookingsyc/yeucauchuaxacnhan" element={<PendingServiceRequests />} />
        <Route path="/bookingsyc/yeucau" element={<ListServiceRequests />} />
        <Route path="/bookingsyc/:id" element={<Detailycchuaxacnhan />} />
        <Route path="/bookingsyc/:id" element={<Detailyc />} />
        <Route path="/homeadmin/daxacnhan" element={<Daxacnhan />} />
        <Route path="/homeadmin/dacheckin" element={<DaCheckin />} />
        <Route path="/homeadmin/dacheckout" element={<DaCheckout />} />
        <Route path="/homeadmin/huy" element={<DaHuy />} />
        <Route path="/homeadmin/:id" element={<BookingDetail />} />
        <Route path="/bookings1/:id" element={<DetailDaxacnhan />} />
        <Route path="/bookings2/:id" element={<DetailDaCheckin />} />
        <Route path="/bookings3/:id" element={<DetailDaCheckout />} />
        <Route path="/bookings4/:id" element={<DetailDaHuy />} />
        <Route path="/roomtypemanager" element={<RoomTypeManager />} />
        <Route path="/roommanager" element={<RoomManager />} />
        <Route path="/hotelservicesmanager" element={<HotelServicesManager />} />
        <Route path="/equipmentmanagement" element={<EquipmentManagement />} />
        <Route path="/invoiceadmin" element={<ListInvoice />} />
        <Route path="/invoiceadminchuatt" element={<UnconfirmedInvoiceList />} />
        <Route path="/invoiceadmin/:id" element={<DetailInvoice />} />
        <Route path="/statistics" element={<Statistics/>}/>

        <Route path="/homeletan" element={<HomeLeTan />} />
        <Route path="/getallmessage" element={<GetallMessage />} />


      </Routes>
    </BrowserRouter>
  )
}

export default App
