import express from "express";
import cors from "cors";
import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Razorpay from "razorpay";
import rateLimit from "express-rate-limit"; 

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

import authRoutes from "./routes/authRoutes.js";
import houseRoutes from "./routes/houseRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const app = express();

// --- Middleware ---
// CORS: Allow requests from your frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://apnabasera-frontend.onrender.com", 
    credentials: true,
  })
);

app.use(express.json());

// --- Connect to MongoDB and Cloudinary ---
connectDB();
connectCloudinary();


// Razorpay
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
export const chat = model.startChat({
  history: [
    {
      role: "user",
      parts: [
        {
          text: "You are a helpful and friendly assistant for a student housing website called ApnaBasera. Your name is 'ApnaBot'.",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: "Hello! I'm ApnaBot, the virtual assistant for ApnaBasera. I'm ready to help you find your perfect home.",
        },
      ],
    },
  ],
});

// --- Security Middleware ---
// Rate Limiter for auth routes to prevent brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  },
});

// --- Routes ---
app.use("/api/auth", authLimiter, authRoutes); 
app.use("/api/houses", houseRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/payment", paymentRoutes);

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "ApnaBasera API is running!" });
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
