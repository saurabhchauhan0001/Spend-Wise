import express from "express";
import { categorize, insights } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.post("/categorize", categorize);
router.get("/insights", insights);

export default router;
