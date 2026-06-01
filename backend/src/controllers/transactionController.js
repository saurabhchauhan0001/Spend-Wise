import Account from "../models/Account.js";
import Budget from "../models/Budget.js";
import Transaction from "../models/Transaction.js";

const categoryIcons = {
  Food: "🍔",
  Transport: "🚕",
  Shopping: "🛍️",
  Bills: "🧾",
  Salary: "💼",
  Freelance: "🧑‍💻",
  Health: "🏥",
  Travel: "✈️",
  Entertainment: "🎬",
  Other: "💸"
};

const buildFilter = (userId, query) => {
  const filter = { user: userId };
  if (query.type) filter.type = query.type;
  if (query.category) filter.category = query.category;
  if (query.account) filter.account = query.account;
  if (query.search) filter.title = { $regex: query.search, $options: "i" };
  if (query.startDate || query.endDate) {
    filter.date = {};
    if (query.startDate) filter.date.$gte = new Date(query.startDate);
    if (query.endDate) filter.date.$lte = new Date(query.endDate);
  }
  return filter;
};

export const getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find(buildFilter(req.user._id, req.query))
      .populate("account", "name type")
      .sort("-date");
    res.json(transactions);
  } catch (error) {
    next(error);
  }
};

export const createTransaction = async (req, res, next) => {
  try {
    const account = await Account.findOne({ _id: req.body.account, user: req.user._id });
    if (!account) {
      res.status(404);
      throw new Error("Account not found");
    }
    const category = req.body.category || "Other";
    const transaction = await Transaction.create({
      ...req.body,
      user: req.user._id,
      category,
      icon: req.body.icon || categoryIcons[category] || categoryIcons.Other
    });
    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
};

export const updateTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id });
    if (!transaction) {
      res.status(404);
      throw new Error("Transaction not found");
    }
    Object.assign(transaction, req.body);
    if (req.body.category && !req.body.icon) {
      transaction.icon = categoryIcons[req.body.category] || categoryIcons.Other;
    }
    res.json(await transaction.save());
  } catch (error) {
    next(error);
  }
};

export const deleteTransaction = async (req, res, next) => {
  try {
    const deleted = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deleted) {
      res.status(404);
      throw new Error("Transaction not found");
    }
    res.json({ message: "Transaction deleted" });
  } catch (error) {
    next(error);
  }
};

export const getSummary = async (req, res, next) => {
  try {
    const transactions = await Transaction.find(buildFilter(req.user._id, req.query));
    const income = transactions.filter((item) => item.type === "income").reduce((sum, item) => sum + item.amount, 0);
    const expenses = transactions.filter((item) => item.type === "expense").reduce((sum, item) => sum + item.amount, 0);
    const categoryTotals = transactions.reduce((acc, item) => {
      if (item.type === "expense") acc[item.category] = (acc[item.category] || 0) + item.amount;
      return acc;
    }, {});
    const monthlyTrends = transactions.reduce((acc, item) => {
      const key = item.date.toISOString().slice(0, 7);
      acc[key] ||= { month: key, income: 0, expense: 0 };
      acc[key][item.type] += item.amount;
      return acc;
    }, {});
    const month = req.query.month || new Date().toISOString().slice(0, 7);
    const budgets = await Budget.find({ user: req.user._id, month });
    const warnings = budgets
      .map((budget) => {
        const spent = budget.category === "overall" ? expenses : categoryTotals[budget.category] || 0;
        return { category: budget.category, limit: budget.limit, spent, exceeded: spent > budget.limit };
      })
      .filter((warning) => warning.exceeded);

    res.json({
      income,
      expenses,
      balance: income - expenses,
      categoryTotals,
      monthlyTrends: Object.values(monthlyTrends).sort((a, b) => a.month.localeCompare(b.month)),
      warnings
    });
  } catch (error) {
    next(error);
  }
};

export const exportCsv = async (req, res, next) => {
  try {
    const transactions = await Transaction.find(buildFilter(req.user._id, req.query)).sort("-date");
    const rows = ["Date,Title,Type,Category,Account,Amount,Note,Recurring"];
    transactions.forEach((item) => {
      rows.push([
        `\t${item.date.toISOString().slice(0, 10)}`,
        item.title,
        item.type,
        item.category,
        item.account,
        item.amount.toFixed(2),
        item.note,
        item.recurring?.enabled ? item.recurring.frequency : "no"
      ].map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(","));
    });
    res.header("Content-Type", "text/csv");
    res.attachment("transactions.csv");
    res.send(`\uFEFF${rows.join("\n")}`);
  } catch (error) {
    next(error);
  }
};
