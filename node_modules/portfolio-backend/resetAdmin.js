import mongoose from "mongoose";
import User from "./models/User.js";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const resetAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const adminEmail = "admin@example.com";
    let admin = await User.findOne({ email: adminEmail.toLowerCase() });

    if (admin) {
      console.log("🔍 Admin user found. Current role:", admin.role);
      console.log("📝 Resetting password to 'Admin123!'...");
      admin.password = "Admin123!"; // plaintext - pre-save hook will hash it
      admin.role = "admin"; // ensure role is admin
      await admin.save();
      console.log("✅ Admin password has been reset successfully!");
      console.log("📧 Email:", admin.email);
      console.log("👤 Username:", admin.username);
    } else {
      console.log("❌ Admin user not found in database");
      console.log("Creating new admin account...");
      await User.create({
        fullname: "Admin User",
        username: "admin",
        email: adminEmail,
        password: "Admin123!", // plaintext - pre-save hook will hash it
        role: "admin",
      });
      console.log("✅ New admin account created!");
      console.log("📧 Email: admin@example.com");
      console.log("🔑 Password: Admin123!");
    }

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
};

resetAdmin();
