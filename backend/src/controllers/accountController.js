import Account from "../models/Account.js";

export const getAccounts = async (req, res, next) => {
  try {
    res.json(await Account.find({ user: req.user._id }).sort("-createdAt"));
  } catch (error) {
    next(error);
  }
};

export const createAccount = async (req, res, next) => {
  try {
    const account = await Account.create({ ...req.body, user: req.user._id });
    res.status(201).json(account);
  } catch (error) {
    next(error);
  }
};
