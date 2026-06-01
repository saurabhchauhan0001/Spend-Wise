export const uploadReceipt = (req, res) => {
  const filename = req.file?.originalname || "";
  const lower = filename.toLowerCase();
  const category = lower.includes("fuel") ? "Transport" : lower.includes("food") ? "Food" : "Other";
  res.json({
    merchant: filename.split(".")[0] || "Receipt Merchant",
    amount: Number((Math.random() * 90 + 10).toFixed(2)),
    date: new Date().toISOString().slice(0, 10),
    category,
    title: `${category} receipt`,
    confidence: 0.82,
    note: "Mock OCR result generated from uploaded receipt metadata."
  });
};
