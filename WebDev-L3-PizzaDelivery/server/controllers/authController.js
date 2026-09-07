import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import { randomBytes } from "crypto";
import {sendEmail} from '../utils/sendEmail.js'

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
     console.log("BODY:", req.body);
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const verificationToken = randomBytes(32).toString("hex");

    const role = (email === process.env.ADMIN_EMAIL) ? "admin" : "user";

    const user = await User.create({
      name,
      email,
      password: hashed,
      verificationToken,
      role: role,
      isVerified: role === "admin" ? true : false,
    });

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
    await sendEmail({
      to: email,
      subject: "Verify your Pizza Delivery account",
      html: `<p>Hi ${name},</p><p>Click <a href="${verifyUrl}">here</a> to verify your email.</p>`,
    });

    res.status(201).json({ message: "Registered. Check your email to verify your account.", userId: user._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// GET /api/auth/verify-email/:token
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });
    if (!user) return res.status(400).json({ message: "Invalid or expired verification link" });

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ message: "Email verified successfully. You can now log in." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in" });
    }

    const token = signToken(user);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/admin-login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role: "admin" });
    if (!user) return res.status(400).json({ message: "Invalid admin credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid admin credentials" });

    const token = signToken(user);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /auth/api/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("🔑 Forgot password OTP request for email:", email);
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email." });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordToken = otp;
    user.resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 10); // 10 mins
    await user.save();
    console.log(`✅ Reset OTP generated for ${email}: ${otp}`);

    await sendEmail({
      to: email,
      subject: "Your PizzaHub Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #1e293b;">
          <h2>Password Reset OTP</h2>
          <p>You requested to reset your password. Use the following 6-digit OTP:</p>
          <div style="font-size: 32px; font-weight: bold; color: #ea580c; letter-spacing: 6px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="color: #64748b; font-size: 13px;">This OTP will expire in 10 minutes. Please do not share it with anyone.</p>
        </div>
      `,
    });

    res.json({ success: true, message: "6-digit OTP has been sent to your email!" });
  } catch (err) {
    console.error("❌ Forgot password error:", err);
    res.status(500).json({ message: err.message });
  }
};

// POST /auth/api/reset-password or /auth/api/reset-password/:token
export const resetPassword = async (req, res) => {
  try {
    const token = req.params.token || req.body.otp || req.body.token;
    const { email, password } = req.body;
    console.log("🔑 Reset password attempt with OTP/Token:", token, "email:", email);

    if (!token || !password) {
      return res.status(400).json({ message: "OTP and new password are required." });
    }

    const query = {
      resetPasswordToken: token.toString().trim(),
      resetPasswordExpires: { $gt: new Date() },
    };
    if (email) query.email = email.toLowerCase().trim();

    const user = await User.findOne(query);
    if (!user) {
      console.log("❌ OTP lookup failed or expired for:", token);
      return res.status(400).json({ message: "Invalid or expired OTP. Please try again." });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    console.log("✅ Password successfully updated via OTP for:", user.email);

    res.json({ success: true, message: "Password reset successfully! You can now log in." });
  } catch (err) {
    console.error("❌ Reset password error:", err);
    res.status(500).json({ message: err.message });
  }
};
 