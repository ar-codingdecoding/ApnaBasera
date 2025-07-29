import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { check, validationResult } from "express-validator";
import userModel from "../models/UserModel.js";
import { OAuth2Client } from "google-auth-library";

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// --- Input Validation Rules ---
const registerValidationRules = [
  check("name", "Name is required").not().isEmpty().trim().escape(),
  check("email", "Please include a valid email").isEmail().normalizeEmail(),
  check("password", "Password must be 6 or more characters").isLength({ min: 6 }),
];
const loginValidationRules = [
  check("email", "Please include a valid email").isEmail().normalizeEmail(),
  check("password", "Password is required").exists(),
];
const forgotPasswordValidationRules = [
  check("email", "Please include a valid email").isEmail().normalizeEmail(),
];
const resetPasswordValidationRules = [
  check("password", "Password must be 6 or more characters").isLength({ min: 6 }),
];

// --- Routes ---

// User Registration
router.post("/register", registerValidationRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  try {
    const { name, email, password } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email." });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new userModel({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({
      message: "User registered successfully! Please login.",
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration." });
  }
});

// User Login
router.post("/login", loginValidationRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const adminUser = { id: "admin_user", name: "Admin", email: process.env.ADMIN_EMAIL, role: "admin" };
      const token = jwt.sign({ id: adminUser.id, email: adminUser.email, role: adminUser.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
      return res.status(200).json({ message: "Admin login successful!", token, user: adminUser });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials. Please try again." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials. Please try again." });
    }

    const regularUser = { id: user._id, name: user.name, email: user.email, role: "user" };
    const token = jwt.sign({ id: regularUser.id, email: regularUser.email, role: regularUser.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(200).json({ message: "Login successful!", token, user: regularUser });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
});

// Google Login/Register
router.post("/google", async (req, res) => {
    try {
        const { credential } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { name, email } = payload;
        let user = await userModel.findOne({ email });

        if (!user) {
            const randomPassword = Math.random().toString(36).slice(-8);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(randomPassword, salt);
            user = new userModel({ name, email, password: hashedPassword });
            await user.save();
        }

        const userPayload = { id: user._id, name: user.name, email: user.email, role: "user" };
        const token = jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({ message: "Google sign-in successful!", token, user: userPayload });
    } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(400).json({ message: "Google authentication failed." });
    }
});

// Forgot Password
router.post("/forgot-password", forgotPasswordValidationRules, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { email } = req.body;
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(200).json({
          message:
            "If a user with that email exists, a password reset link has been sent.",
        });
      }

      const secret = process.env.JWT_SECRET + user.password;
      const token = jwt.sign({ email: user.email, id: user._id }, secret, {
        expiresIn: "15m",
      });

      const resetLink = `${process.env.FRONTEND_URL}/reset-password/${user._id}/${token}`;

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: `"ApnaBasera" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Password Reset for ApnaBasera",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
                <h2>Password Reset Request</h2>
                <p>Hello ${user.name},</p>
                <p>You requested a password reset. Click the button below to set a new password.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">Reset Password</a>
                </div>
                <p>This link is valid for 15 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
            </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      res.status(200).json({
        message:
          "If a user with that email exists, a password reset link has been sent.",
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "Error processing request." });
    }
  }
);

// Reset Password
router.post("/reset-password/:id/:token", resetPasswordValidationRules, async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ message: validationErrors.array()[0].msg });
    }

    const { id, token } = req.params;
    const { password } = req.body;

    try {
      const user = await userModel.findById(id);
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired reset link." });
      }

      const secret = process.env.JWT_SECRET + user.password;
      jwt.verify(token, secret);

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({
        message: "Password has been reset successfully. You can now login.",
      });
    } catch (error) {
      if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
        return res.status(400).json({ message: "Invalid or expired reset link." });
      }
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Error resetting password." });
    }
  }
);

export default router;