import express from "express";
import { searchRoom } from "../controllers/SearchController.js";


const SearchRoomrouter = express.Router();


SearchRoomrouter.get('/searchroom',searchRoom);




const SearchRoomroute = (app) => {
    app.use('/search', SearchRoomrouter); 
};

export default SearchRoomroute;