import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import houseModel from "../models/HouseModel.js";
import { adminCheck, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// Helper function to upload image to Cloudinary
const uploadToCloudinary = async (buffer, originalname) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "image",
          folder: "apnabasera/houses",
          public_id: `house_${Date.now()}_${originalname.split(".")[0]}`,
          format: "jpg",
          transformation: [
            { width: 800, height: 600, crop: "fill", quality: "auto" },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url);
        }
      )
      .end(buffer);
  });
};

// Get all houses with filtering and pagination
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      location,
      minPrice,
      maxPrice,
      beds,
      baths,
      search,
    } = req.query;

    // Build filter object
    const filter = {};

    if (type && type !== "all") filter.type = type;
    if (location) filter.location = { $regex: location, $options: "i" };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (beds) filter.beds = Number(beds);
    if (baths) filter.baths = Number(baths);

    // Search in title and description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const houses = await houseModel
      .find(filter)
      .sort({ _id: -1 }) 
      .skip(skip)
      .limit(Number(limit));

    const total = await houseModel.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      houses,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalHouses: total,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Get houses error:", error);
    res.status(500).json({ message: "Error fetching houses" });
  }
});

// Get single house by ID
router.get("/:id", async (req, res) => {
  try {
    const house = await houseModel.findById(req.params.id);
    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }
    res.status(200).json({ success: true, house });
  } catch (error) {
    console.error("Get house error:", error);
    res.status(500).json({ message: "Error fetching house" });
  }
});

// Add new house
router.post(
  "/",
  protect,
  adminCheck,
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, location, price, description, type, beds, baths } =
        req.body;

      // Validate required fields
      if (!title || !location || !price || !type || !beds || !baths) {
        return res.status(400).json({
          message:
            "All required fields must be provided (title, location, price, type, beds, baths)",
        });
      }

      // Validate enum values
      if (!["PG", "Flat", "Hostel"].includes(type)) {
        return res.status(400).json({
          message: "Type must be one of: PG, Flat, Hostel",
        });
      }

      // Validate numeric values
      if (isNaN(price) || price <= 0) {
        return res
          .status(400)
          .json({ message: "Price must be a positive number" });
      }
      if (isNaN(beds) || beds <= 0) {
        return res
          .status(400)
          .json({ message: "Beds must be a positive number" });
      }
      if (isNaN(baths) || baths <= 0) {
        return res
          .status(400)
          .json({ message: "Baths must be a positive number" });
      }

      let imageUrl = "";

      // Upload image to Cloudinary if provided
      if (req.file) {
        try {
          imageUrl = await uploadToCloudinary(
            req.file.buffer,
            req.file.originalname
          );
        } catch (uploadError) {
          console.error("Image upload error:", uploadError);
          return res.status(500).json({ message: "Error uploading image" });
        }
      }

      const newHouse = new houseModel({
        title,
        location,
        price: Number(price),
        description: description || "",
        type,
        beds: Number(beds),
        baths: Number(baths),
        img: imageUrl,
      });

      await newHouse.save();

      res.status(201).json({
        success: true,
        message: "House added successfully!",
        house: newHouse,
      });
    } catch (error) {
      console.error("Add house error:", error);
      res.status(500).json({ message: "Error adding house" });
    }
  }
);

// Update house
router.put(
  "/:id",
  protect,
  adminCheck,
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, location, price, description, type, beds, baths } =
        req.body;
      const houseId = req.params.id;

      const house = await houseModel.findById(houseId);
      if (!house) {
        return res.status(404).json({ message: "House not found" });
      }

      // Validate enum values if provided
      if (type && !["PG", "Flat", "Hostel"].includes(type)) {
        return res.status(400).json({
          message: "Type must be one of: PG, Flat, Hostel",
        });
      }

      // Validate numeric values if provided
      if (price !== undefined && (isNaN(price) || price <= 0)) {
        return res
          .status(400)
          .json({ message: "Price must be a positive number" });
      }
      if (beds !== undefined && (isNaN(beds) || beds <= 0)) {
        return res
          .status(400)
          .json({ message: "Beds must be a positive number" });
      }
      if (baths !== undefined && (isNaN(baths) || baths <= 0)) {
        return res
          .status(400)
          .json({ message: "Baths must be a positive number" });
      }

      // Update fields
      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (location !== undefined) updateData.location = location;
      if (price !== undefined) updateData.price = Number(price);
      if (description !== undefined) updateData.description = description;
      if (type !== undefined) updateData.type = type;
      if (beds !== undefined) updateData.beds = Number(beds);
      if (baths !== undefined) updateData.baths = Number(baths);

      // Handle image update
      if (req.file) {
        try {
          // Delete old image from Cloudinary if exists
          if (house.img) {
            const publicId = house.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(`apnabasera/houses/${publicId}`);
          }

          // Upload new image
          updateData.img = await uploadToCloudinary(
            req.file.buffer,
            req.file.originalname
          );
        } catch (uploadError) {
          console.error("Image upload error:", uploadError);
          return res.status(500).json({ message: "Error uploading image" });
        }
      }

      const updatedHouse = await houseModel.findByIdAndUpdate(
        houseId,
        updateData,
        { new: true, runValidators: true }
      );

      res.status(200).json({
        success: true,
        message: "House updated successfully!",
        house: updatedHouse,
      });
    } catch (error) {
      console.error("Update house error:", error);
      res.status(500).json({ message: "Error updating house" });
    }
  }
);

// Delete house
router.delete("/:id", protect, adminCheck, async (req, res) => {
  try {
    const house = await houseModel.findById(req.params.id);
    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }

    // Delete image from Cloudinary if exists
    if (house.img) {
      try {
        const publicId = house.img.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`apnabasera/houses/${publicId}`);
      } catch (deleteError) {
        console.error("Error deleting image from Cloudinary:", deleteError);
        // Continue with house deletion even if image deletion fails
      }
    }

    await houseModel.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "House deleted successfully!",
    });
  } catch (error) {
    console.error("Delete house error:", error);
    res.status(500).json({ message: "Error deleting house" });
  }
});

// Get house statistics (for admin dashboard)
router.get("/stats/overview", protect, adminCheck, async (req, res) => {
  try {
    const totalHouses = await houseModel.countDocuments();
    const typeStats = await houseModel.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]);

    const priceStats = await houseModel.aggregate([
      {
        $group: {
          _id: null,
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalHouses,
        typeDistribution: typeStats,
        priceStats: priceStats[0] || { avgPrice: 0, minPrice: 0, maxPrice: 0 },
      },
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ message: "Error fetching statistics" });
  }
});

export default router;
