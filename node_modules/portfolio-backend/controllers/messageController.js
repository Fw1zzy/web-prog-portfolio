import asyncHandler from "express-async-handler";
import Message from "../models/Message.js";

export const createMessage = asyncHandler(async (req, res) => {
  const { fullname, email, subject, message } = req.body;
  if (!fullname || !email || !subject || !message) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const newMessage = await Message.create({
    fullname,
    email,
    subject,
    message,
    user: req.user?.id,
  });

  res
    .status(201)
    .json({ message: "Message sent successfully", data: newMessage });
});

export const getMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 });
  res.json(messages);
});
