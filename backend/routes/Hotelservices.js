import express from "express";
import { addHotelServices, deleteHotelservices, getallHotelServices, getHotelServices, getHotelServices1, getServicesDetails, updateHotelServices } from "../controllers/HotelServicesControllers.js";


const HotelServicesrouter = express.Router();


HotelServicesrouter.post('/addservices', addHotelServices);
HotelServicesrouter.put('/updateservices/:id',updateHotelServices);
HotelServicesrouter.get('/getallservices',getHotelServices);
HotelServicesrouter.delete('/deleteservices/:IDHotelServices',deleteHotelservices);
HotelServicesrouter.get('/hotelservicesdetail/:serviceId',getServicesDetails);
HotelServicesrouter.get('/getallservices1',getHotelServices1);
HotelServicesrouter.get('/getallHotelservices',getallHotelServices);




const HotelServicesroute = (app) => {
    app.use('/hotelservices', HotelServicesrouter);
};


export default HotelServicesroute;