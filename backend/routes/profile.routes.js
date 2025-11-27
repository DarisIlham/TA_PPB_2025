import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import User from "../models/user.model.js";

const router = express.Router();

// Get user profile - endpoint: GET /api/profile
router.get("/", verifyToken, async (req, res) => { 
   try {
    const user = await User.findOne({ user_id: req.user.user_id });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        profile_picture: user.profile_picture,
        age: user.age,
        weight: user.weight,
        height: user.height,
        unit: user.unit,
        distanceUnit: user.distanceUnit,
        created_at: user.created_at,
        updated_at: user.updated_at
    });
   } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal Server Error' });
   }
});

// Update user profile - endpoint: PUT /api/profile
router.put("/", verifyToken, async (req, res) => {
  try {
    const { name, age, weight, height, unit, distanceUnit, profile_picture } = req.body;
    
    const updatedUser = await User.findOneAndUpdate(
      { user_id: req.user.user_id },
      {
        name,
        age,
        weight,
        height,
        unit,
        distanceUnit,
        profile_picture,
        updated_at: new Date()
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        user_id: updatedUser.user_id,
        name: updatedUser.name,
        email: updatedUser.email,
        profile_picture: updatedUser.profile_picture,
        age: updatedUser.age,
        weight: updatedUser.weight,
        height: updatedUser.height,
        unit: updatedUser.unit,
        distanceUnit: updatedUser.distanceUnit
      }
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;