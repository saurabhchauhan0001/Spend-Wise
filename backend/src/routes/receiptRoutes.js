import express from "express";
import multer from "multer";
import { uploadReceipt } from "../controllers/receiptController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 2 * 1024 * 1024 } });

router.post("/upload", protect, upload.single("receipt"), uploadReceipt);

export default router;
