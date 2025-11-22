import { Router } from "express";
const router = Router();
import {
  getFooterContent,
  updateFooterContent,
  deleteFooterContent
} from "../controllers/footer.controller.js";
import validateFooter from "../middleware/validate.footer.js";
import { verifyToken } from "../middleware/auth.middleware.js";

// Public route
router.get("/", getFooterContent);

// Admin-only routes
router.put("/", verifyToken, validateFooter, updateFooterContent);
router.delete("/", verifyToken, deleteFooterContent);

// Add this route above the exports
router.get("/logo", async (req, res) => {
  try {
    const footer = await FooterModel.findOne({}, 'logo');
    res.json(footer || { logo: '' });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch logo", error: error.message });
  }
});

export default router;