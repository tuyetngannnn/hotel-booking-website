import express from "express";
import { addRoomType, deleteRoomType, getallRoomtype, updateRoomType } from "../controllers/RoomTypeControllers.js";

const RoomTyperouter = express.Router();


RoomTyperouter.post('/addnewRoomtype', addRoomType);
RoomTyperouter.put('/updateroomtype/:IDRoomtype',updateRoomType);
RoomTyperouter.delete('/deleteroomtype/:IDRoomtype',deleteRoomType);
RoomTyperouter.get('/getallroomtype',getallRoomtype);

const RoomTyperoute = (app) => {
    app.use('/roomtype', RoomTyperouter); 
};

export default RoomTyperoute;
