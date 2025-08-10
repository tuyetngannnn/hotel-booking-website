import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
//import bodyParser from "body-parser"; // Chỉ import bodyParser
//import { json } from "bodyParser"; // Lấy json từ bodyParser
import fileUpload from "express-fileupload";
import cloudinary from "cloudinary";
import routes from './routes/index.js'; // Import routes from routes file
import Branchroute from "./routes/branch.js";
import RoomTyperoute from "./routes/roomtype.js";
import Roomroute from "./routes/room.js";
import HotelServicesroute from "./routes/Hotelservices.js";
import Equipmenthotelroute from "./routes/Equipment.js";
import BookingRouter from "./routes/bookingRoutes.js";
import ServiceRequest from "./routes/serviceRequests.js";
import SearchRoomroute from "./routes/search.js";
//import bodyParser from "body-parser";
import session from 'express-session'; // Đã thêm dòng này
import MongoStore from 'connect-mongo';
import Messageroute from "./routes/Message.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL], // Make sure these variables are set in your .env file
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));


app.use(
    session({
        secret: process.env.SESSION_SECRET || 'secret',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.MONGO_db }),
        cookie: {
            secure: false,
            maxAge: 1000 * 60 * 60 * 24, // 1 ngày
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        },
    })
);
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
    })
);
app.use(express.json()); // Sử dụng bodyParser.json() như trước
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Connect to MongoDB
mongoose.connect(`${process.env.MONGO_db}`)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB:", err));

// Default route
app.get("/", (req, res) => {
    res.send("Express App is Running");
});

// Define API routes
routes(app); 
Branchroute(app);
RoomTyperoute(app);
Roomroute(app);
HotelServicesroute(app);
Equipmenthotelroute(app);
BookingRouter(app);
SearchRoomroute(app);
ServiceRequest(app);
Messageroute(app);

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Start the server
const port = process.env.PORT || 7003;
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

export default app; // Export app for use in other files
