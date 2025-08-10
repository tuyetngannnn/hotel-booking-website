import express from "express";
import { addRoom, deleteRoom, getallRoom, getRoomById, getRoomDetails, getRooms, updateRoom } from "../controllers/RoomControllers.js";

const Roomrouter = express.Router();

Roomrouter.post('/addroom',addRoom);
Roomrouter.put('/updateroom/:idroom',updateRoom);
Roomrouter.get('/getroomlist',getRooms)
Roomrouter.get('/roomdetail/:roomId',getRoomDetails);
Roomrouter.delete('/deleteroom/:idroom',deleteRoom);
Roomrouter.get('/getallroom',getallRoom);
Roomrouter.get('/getroom/:id', getRoomById);
const Roomroute = (app) => {
    app.use('/room', Roomrouter); 
};

export default Roomroute;
