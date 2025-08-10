import express from "express";
import { addEquipment, deleteEquipment, getallEquipment, getAllEquipment1, updateEquipment } from "../controllers/EquipmentControllers.js";




const Equipmenthotelrouter = express.Router();


Equipmenthotelrouter.post('/addequipment',addEquipment);
Equipmenthotelrouter.put('/updateequipment/:IDEquipment',updateEquipment);
Equipmenthotelrouter.delete('/deleteEquipment/:IDEquipment',deleteEquipment);
Equipmenthotelrouter.get('/getallEquipment',getallEquipment);
Equipmenthotelrouter.get('/getallEquipment1',getAllEquipment1);




const Equipmenthotelroute = (app) => {
    app.use('/equipment', Equipmenthotelrouter);
};


export default Equipmenthotelroute;