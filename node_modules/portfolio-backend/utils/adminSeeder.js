import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

dotenv.config();

export const createDefaultAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const fullname = process.env.ADMIN_FULLNAME || "Admin";

    if (!email || !password) {
      console.warn(
        "ADMIN_EMAIL and ADMIN_PASSWORD are required to create default admin account.",
      );
      return;
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing && existing.role === "admin") return;

    if (!existing) {
      // Check if username "admin" is already taken
      const existingUsername = await User.findOne({ username: "admin" });
      const finalUsername = existingUsername ? "admin_user" : "admin";

      await User.create({
        fullname,
        username: finalUsername,
        email,
        password, // Plaintext - will be hashed by pre-save hook
        role: "admin",
      });
      console.log("Default admin account created:", email, `(username: ${finalUsername})`);
      return;
    }

    existing.role = "admin";
    await existing.save();
    console.log("Existing user promoted to admin:", email);
  } catch (error) {
    console.error("Admin seeder error:", error);
  }
};
