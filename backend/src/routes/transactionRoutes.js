import express from "express";
import {
  createTransaction,
  deleteTransaction,
  exportCsv,
  getSummary,
  getTransactions,
  updateTransaction
} from "../controllers/transactionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/summary", getSummary);
router.get("/export", exportCsv);
router.route("/").get(getTransactions).post(createTransaction);
router.route("/:id").put(updateTransaction).delete(deleteTransaction);

export default router;
