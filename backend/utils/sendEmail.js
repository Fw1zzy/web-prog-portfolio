import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "emmanuelpascua.ph@gmail.com";

const buildContactEmail = ({ fullname, email, subject, message }) => ({
  from: process.env.EMAIL_USER || email,
  to: ADMIN_EMAIL,
  subject: `New Contact Message: ${subject}`,
  text: `You have received a new message from your portfolio contact form.\n\nFrom: ${fullname} <${email}>\nSubject: ${subject}\nMessage:\n${message}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333;">New Portfolio Message</h2>
      <p><strong>From:</strong> ${escapeHtml(fullname)} &lt;${escapeHtml(email)}&gt;</p>
      <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
      <hr style="border: 1px solid #eee; margin: 20px 0;" />
      <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
      <hr style="border: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #999;">Received on ${new Date().toLocaleString()}</p>
    </div>
  `,
});

const buildUserCopyEmail = ({ fullname, email, subject, message }) => ({
  from: process.env.EMAIL_USER || ADMIN_EMAIL,
  to: email,
  subject: `We received your message: ${subject}`,
  text: `Hi ${fullname},\n\nThank you for reaching out! We have received your message and will get back to you as soon as possible.\n\nHere is a copy of your message:\n\nSubject: ${subject}\nMessage:\n${message}\n\nBest regards,\nEmmanuel Pascua`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333;">Message Received</h2>
      <p>Hi ${escapeHtml(fullname)},</p>
      <p>Thank you for reaching out! We have received your message and will get back to you as soon as possible.</p>
      <p>Here is a copy of your message:</p>
      <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
      <hr style="border: 1px solid #eee; margin: 20px 0;" />
      <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
      <hr style="border: 1px solid #eee; margin: 20px 0;" />
      <p>Best regards,<br>Emmanuel Pascua</p>
    </div>
  `,
});

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export const sendContactEmails = async (data) => {
  const hasUser = !!process.env.EMAIL_USER;
  const hasPass = !!process.env.EMAIL_PASS;
  console.log("[sendContactEmails] Config loaded:", {
    hasUser,
    hasPass,
    adminEmail: process.env.ADMIN_EMAIL,
    service: process.env.EMAIL_SERVICE || "gmail",
  });

  if (!hasUser || !hasPass) {
    console.warn("Email credentials not configured. Skipping contact email send.");
    return;
  }

  try {
    console.log("[sendContactEmails] Sending admin notification...");
    await transporter.sendMail(buildContactEmail(data));

    if (data.sendUserCopy) {
      console.log("[sendContactEmails] Sending user copy...");
      await transporter.sendMail(buildUserCopyEmail(data));
    }

    console.log("[sendContactEmails] All emails sent successfully.");
  } catch (error) {
    console.error("[sendContactEmails] Failed to send email:", {
      message: error.message,
      code: error.code,
      response: error.response,
      stack: error.stack,
    });
    throw error;
  }
};

export default transporter;
