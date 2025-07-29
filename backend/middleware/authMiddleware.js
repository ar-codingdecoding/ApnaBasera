import jwt from "jsonwebtoken";
import userModel from "../models/UserModel.js";

// Middleware to protect routes by verifying JWT
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // --- NEW LOGIC: Handle Admin vs. Regular User ---
      if (decoded.role === "admin" && decoded.id === "admin_user") {
        // This is the admin. Manually attach user object to the request.
        // We trust the token because it has been verified.
        req.user = {
          _id: decoded.id,
          name: "Admin",
          email: decoded.email,
          role: "admin",
        };
      } else {
        // This is a regular user. Find them in the database.
        req.user = await userModel.findById(decoded.id).select("-password");

        if (!req.user) {
          return res
            .status(401)
            .json({ message: "Not authorized, user not found" });
        }
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Middleware to check for admin role (This remains unchanged and is correct)
export const adminCheck = (req, res, next) => {
  // This middleware should run AFTER the 'protect' middleware
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin resource. Access denied." });
  }
};
