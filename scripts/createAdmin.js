import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";

// Load environment variables
dotenv.config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");

    // Check if admin already exists
    const adminExists = await User.findOne({ email: "admin@nicehomes.com" });

    if (adminExists) {
      console.log("⚠️  Admin user already exists");
      console.log("Email:", adminExists.email);
      console.log("Role:", adminExists.role);

      // Update to admin if not already
      if (adminExists.role !== "admin") {
        adminExists.role = "admin";
        await adminExists.save();
        console.log("✅ Updated user to admin role");
      }
    } else {
      // Create new admin user
      const admin = await User.create({
        fullName: "Admin User",
        email: "admin@nicehomes.com",
        password: "admin@123",
        role: "admin",
      });

      console.log("✅ Admin user created successfully!");
      console.log("Email:", admin.email);
      console.log("Password: admin123");
      console.log("Role:", admin.role);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

createAdminUser();
