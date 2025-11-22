import { Router } from "express";
const router = Router();
import {
  createFeedback,
  getAllFeedback,
  getFeedbackById,
  deleteFeedback

} from "../controllers/kontak.controller.js";
import validateKontak from "../middleware/validate.kontak.js";


// Public routes
router.post("/", validateKontak, createFeedback);  
router.get("/", getAllFeedback);                  
router.get("/:id", getFeedbackById);              
router.delete("/:id", deleteFeedback);            

export default router;