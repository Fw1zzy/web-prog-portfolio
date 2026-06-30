import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const testEmail = async () => {
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "[REDACTED]" : undefined);
  console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL);

  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: "Portfolio Email Test",
      text: "If you see this, nodemailer is working!",
    });
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Email failed:", error.message);
    if (error.code) console.error("Error code:", error.code);
  }
};

testEmail();
