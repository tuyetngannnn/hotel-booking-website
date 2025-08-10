import express from "express";
import path from "path";
import  { login, createUser, addNewAdmin, getAllLeTan,
          getUserDetails, logoutAdmin, logout,
          createReceptionist, forgotPassword,resetPassword, getCustomerAccounts,
          getLetanAccount,
          loginAdmin,
          updateReceptionist,
          deleteReceptionist} from "../controllers/UseControllers.js"; // Đảm bảo đổi đuôi sang .js
import { isAdminAuthenticated,isPatientAuthenticated } from "../middlewares/auth.js"; 
import {  getProfileAdmin, getUser, updateAdmin, updateUser } from "../controllers/ProfileControllers.js";
const router = express.Router();


const routes = (app) => {
    // Định nghĩa route cho việc tạo người dùng
    router.post("/createUser", createUser); // Đặt đây để đảm bảo route được thiết lập
    router.post("/login",login);
    router.post("/loginAdmin",loginAdmin);
    router.post("/admin/addnew", addNewAdmin);
    router.get("/LeTan",getAllLeTan);
    router.get("admin/me",isAdminAuthenticated,getUserDetails);
    router.get("/khachhang/me",isPatientAuthenticated,getUserDetails);
    router.post("/admin/logout",logoutAdmin);
    router.post("/khachhang/logout",logout);
    router.post("/letan/addnew",createReceptionist);
    router.put("/updateReceptionist/:id",updateReceptionist);
    router.delete("/deleteReceptionist/:id",deleteReceptionist);
    

    router.get("/account/khachhang",getCustomerAccounts);
    router.get("/account/letan",getLetanAccount);

    //test quên mật khẩu
    router.post("/forgot-password",forgotPassword);
    router.post("/reset-password/:token",resetPassword);


    //test thông tin cá nhân
    router.get("/profileuser/:id",getUser);
    router.put("/updateprofile/:id",updateUser);
    router.get("/profileAdmin/:id",getProfileAdmin);
    router.put("/updateprofileAdmin/:id",updateAdmin);


    app.use("/api/user", router); // Sử dụng controller để xử lý

    // Định nghĩa đường dẫn đến thư mục build của frontend
    const frontendSrcPath = path.join(process.cwd(), 'frontend/src'); // Thay đổi đường dẫn

    // Phân phát các tệp tĩnh từ thư mục src (nếu cần)
    app.use(express.static(frontendSrcPath));

    // Trả về tệp Login.jsx cho route /login
    app.get('/login', (req, res) => {
        res.sendFile(path.join(frontendSrcPath, 'Login/Login.jsx')); // Đường dẫn đến Login.jsx
    });
};

export default routes; // Sử dụng export mặc định
