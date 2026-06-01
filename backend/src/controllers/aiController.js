import Transaction from "../models/Transaction.js";

const rules = [
  { category: "Food", icon: "🍔", words: ["restaurant", "cafe", "pizza", "grocery", "food"] },
  { category: "Transport", icon: "🚕", words: ["uber", "taxi", "fuel", "metro", "bus"] },
  { category: "Bills", icon: "🧾", words: ["electric", "internet", "rent", "phone", "bill"] },
  { category: "Shopping", icon: "🛍️", words: ["amazon", "mall", "clothes", "store"] },
  { category: "Salary", icon: "💼", words: ["salary", "payroll", "stipend"] }
];

export const categorize = (req, res) => {
  const text = `${req.body.title || ""} ${req.body.note || ""}`.toLowerCase();
  const match = rules.find((rule) => rule.words.some((word) => text.includes(word)));
  res.json(match || { category: "Other", icon: "💸" });
};

export const insights = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort("-date").limit(200);
    const expenses = transactions.filter((item) => item.type === "expense");
    const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
    const categoryTotals = expenses.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      return acc;
    }, {});
    const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
    const tips = [
      topCategory ? `Your biggest spend is ${topCategory[0]}. Try setting a dedicated monthly cap for it.` : "Add more transactions to unlock sharper insights.",
      totalExpense > 0 ? "Move a fixed amount to savings right after income arrives." : "Track expenses consistently for two weeks to reveal patterns.",
      "Review recurring subscriptions monthly and cancel anything unused."
    ];
    res.json({
      summary: topCategory
        ? `${topCategory[0]} accounts for ${Math.round((topCategory[1] / totalExpense) * 100)}% of tracked expenses.`
        : "No expense pattern detected yet.",
      tips,
      categoryTotals
    });
  } catch (error) {
    next(error);
  }
};
