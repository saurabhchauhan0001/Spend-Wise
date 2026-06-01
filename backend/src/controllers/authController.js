import { createHash, randomBytes } from "node:crypto";
import nodemailer from "nodemailer";
import Account from "../models/Account.js";
import User from "../models/User.js";
import { generateToken } from "../utils/token.js";

const GOOGLE_TOKEN_INFO_URL = "https://oauth2.googleapis.com/tokeninfo";
const RESET_OTP_TTL_MS = 10 * 60 * 1000;

const userResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  token: generateToken(user._id)
});

const normalizeOtp = (otp) => String(otp || "").replace(/\D/g, "");

const hashToken = (token) => createHash("sha256").update(token).digest("hex");

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

const createMailer = () => {
  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;
  if (EMAIL_HOST && EMAIL_PORT && EMAIL_USER && EMAIL_PASS) {
    return {
      configured: true,
      transporter: nodemailer.createTransport({
        host: EMAIL_HOST,
        port: Number(EMAIL_PORT),
        secure: String(EMAIL_PORT) === "465",
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS
        }
      })
    };
  }

  return {
    configured: false,
    transporter: nodemailer.createTransport({
      jsonTransport: true
    })
  };
};

const sendOtpEmail = async (to, otp) => {
  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;
  const { transporter, configured } = createMailer();
  const info = await transporter.sendMail({
    from,
    to,
    subject: "SpendWise AI password reset OTP",
    text: `Your password reset OTP is ${otp}. It expires in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Password reset OTP</h2>
        <p>Your one-time password is:</p>
        <p style="font-size: 28px; font-weight: 800; letter-spacing: 0.25em;">${otp}</p>
        <p>This code expires in 10 minutes.</p>
      </div>
    `
  });
  if (!configured) {
    console.warn(`Email service is not configured. OTP for ${to}: ${otp}`);
  }
  return info;
};

const verifyGoogleCredential = async (credential) => {
  const response = await fetch(`${GOOGLE_TOKEN_INFO_URL}?id_token=${encodeURIComponent(credential)}`);
  if (!response.ok) return null;
  return response.json();
};

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Name, email and password are required");
    }

    const exists = await User.findOne({ email });
    if (exists) {
      res.status(409);
      throw new Error("Email already registered");
    }

    const user = await User.create({ name, email, password });
    await Account.create({ user: user._id, name: "Main Account", type: "bank" });
    res.status(201).json(userResponse(user));
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error("Invalid email or password");
    }
    res.json(userResponse(user));
  } catch (error) {
    next(error);
  }
};

export const googleLogin = async (req, res, next) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      res.status(400);
      throw new Error("Google credential is required");
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      res.status(500);
      throw new Error("Google login is not configured");
    }

    let googleProfile;
    try {
      googleProfile = await verifyGoogleCredential(credential);
    } catch {
      res.status(502);
      throw new Error("Unable to verify Google credential");
    }

    const emailVerified = googleProfile?.email_verified === true || googleProfile?.email_verified === "true";
    if (!googleProfile || googleProfile.aud !== process.env.GOOGLE_CLIENT_ID || !googleProfile.email || !emailVerified) {
      res.status(401);
      throw new Error("Invalid Google credential");
    }

    const email = googleProfile.email.toLowerCase();
    let user = await User.findOne({ email });
    let statusCode = 200;

    if (!user) {
      user = await User.create({
        name: googleProfile.name || email.split("@")[0],
        email,
        password: randomBytes(32).toString("hex")
      });
      await Account.create({ user: user._id, name: "Main Account", type: "bank" });
      statusCode = 201;
    }

    res.status(statusCode).json(userResponse(user));
  } catch (error) {
    next(error);
  }
};

export const me = (req, res) => {
  res.json({ _id: req.user._id, name: req.user.name, email: req.user.email });
};

export const forgotPassword = async (req, res, next) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    if (!email) {
      res.status(400);
      throw new Error("Email is required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        message: "If an account exists for that email, an OTP has been prepared."
      });
    }

    const otp = generateOtp();
    user.resetPasswordOtpHash = hashToken(otp);
    user.resetPasswordOtpExpires = new Date(Date.now() + RESET_OTP_TTL_MS);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateModifiedOnly: true });

    await sendOtpEmail(user.email, otp);

    res.json({
      message: "OTP sent to your email.",
      email
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const otp = normalizeOtp(req.body.otp);
    const password = String(req.body.password || "").trim();

    if (!email || !otp || !password) {
      res.status(400);
      throw new Error("Email, OTP and new password are required");
    }

    const user = await User.findOne({ email }).select("+resetPasswordOtpHash +resetPasswordOtpExpires");
    const hashedOtp = hashToken(otp);

    if (!user || user.resetPasswordOtpHash !== hashedOtp || !user.resetPasswordOtpExpires || user.resetPasswordOtpExpires <= new Date()) {
      res.status(400);
      throw new Error("OTP is invalid or has expired");
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.resetPasswordOtpHash = undefined;
    user.resetPasswordOtpExpires = undefined;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};
