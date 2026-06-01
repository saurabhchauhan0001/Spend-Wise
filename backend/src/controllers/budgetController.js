import Budget from "../models/Budget.js";

export const getBudgets = async (req, res, next) => {
  try {
    res.json(await Budget.find({ user: req.user._id }).sort("-month category"));
  } catch (error) {
    next(error);
  }
};

export const upsertBudget = async (req, res, next) => {
  try {
    const { month, category = "overall", limit } = req.body;
    const budget = await Budget.findOneAndUpdate(
      { user: req.user._id, month, category },
      { limit },
      { new: true, upsert: true, runValidators: true }
    );
    res.status(201).json(budget);
  } catch (error) {
    next(error);
  }
};

export const deleteBudget = async (req, res, next) => {
  try {
    await Budget.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: "Budget deleted" });
  } catch (error) {
    next(error);
  }
};
