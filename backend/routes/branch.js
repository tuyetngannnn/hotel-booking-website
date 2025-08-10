import express from "express";
import { createDefaultBranches, addBranch, updateBranch, deleteBranch, getallBranch } from "../controllers/BranchControllers.js";

const Branchrouter = express.Router();


Branchrouter.get("/default", createDefaultBranches);
Branchrouter.post("/add", addBranch);
Branchrouter.put('/updatebranch/:branchId', updateBranch);
Branchrouter.delete('/deletebranch/:branchId', deleteBranch);
Branchrouter.get('/getallbranch',getallBranch);

const Branchroute = (app) => {
    app.use('/branch', Branchrouter); 
};

export default Branchroute;
