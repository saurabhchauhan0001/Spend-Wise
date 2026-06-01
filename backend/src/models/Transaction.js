import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    account: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    type: { type: String, enum: ["income", "expense"], required: true },
    category: { type: String, required: true },
    icon: { type: String, default: "💸" },
    date: { type: Date, default: Date.now },
    note: { type: String, default: "" },
    recurring: {
      enabled: { type: Boolean, default: false },
      frequency: { type: String, enum: ["weekly", "monthly", "yearly"], default: "monthly" },
      nextRun: Date
    }
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
