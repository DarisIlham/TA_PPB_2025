import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import User from "../models/user.model.js";

const router = express.Router()
router.get("/profile", verifyToken, async (req, res) =>{ 
   try {
    const user = await User.findOne({user_id: req.user.user_id})
    if(!user) {
        return res.status(404).json({message: 'Usern not found'})
    }
    res.json({
        user_id: req.user.user_id,
        name: req.user.name,
        email: req.user.email,
    })
   }catch(err){
    console.log(err);
    res.status(500).json({message: 'Internal Server Error'})
   }
});
export default router