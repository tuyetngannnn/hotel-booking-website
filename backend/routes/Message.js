import express from "express";
import {getAllMessages, replyMessage, sendMessage}  from "../controllers/MessageController.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";


const Messagerouter = express.Router();


Messagerouter.post("/send", sendMessage);
Messagerouter.get("/getall",getAllMessages);
Messagerouter.put("/reply/:id",replyMessage);




const Messageroute = (app) => {
    app.use('/message', Messagerouter);
};


export default Messageroute;