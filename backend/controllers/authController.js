import asyncHandler from "express-async-handler";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import validator from "validator";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const registerUser = asyncHandler(async (req, res) => {
  const { fullname, username, email, password } = req.body;

  if (!fullname || !username || !email || !password) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  if (!validator.isEmail(email)) {
    res.status(400);
    throw new Error("Invalid email address");
  }

  const emailExists = await User.findOne({ email: email.toLowerCase() });
  const usernameExists = await User.findOne({ username });

  if (emailExists) {
    res.status(400);
    throw new Error("An account with this email already exists");
  }

  if (usernameExists) {
    res.status(400);
    throw new Error("This username is already taken");
  }

  const user = await User.create({
    fullname,
    username,
    email: email.toLowerCase(),
    password,
  });

  if (!user) {
    res.status(500);
    throw new Error("Unable to create user");
  }

  res.status(201).json({
    user: {
      id: user._id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    token: generateToken(user._id),
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json({
    user: {
      id: user._id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    token: generateToken(user._id),
  });
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.json({ message: "Logged out successfully" });
});

export const googleAuth = asyncHandler(async (req, res) => {
  const { tokenId } = req.body;
  if (!tokenId) {
    res.status(400);
    throw new Error("Google token is required");
  }

  const ticket = await client.verifyIdToken({
    idToken: tokenId,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();

  if (!payload || !payload.email_verified) {
    res.status(401);
    throw new Error("Google authentication failed");
  }

  const { email, name, sub } = payload;
  let user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    user = await User.create({
      fullname: name,
      username: email.split("@")[0],
      email: email.toLowerCase(),
      password: crypto.randomBytes(20).toString("hex"),
      googleId: sub,
    });
  } else if (!user.googleId) {
    user.googleId = sub;
    await user.save();
  }

  res.json({
    user: {
      id: user._id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    token: generateToken(user._id),
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email || !validator.isEmail(email)) {
    res.status(400);
    throw new Error("Please provide a valid email address");
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    res.status(404);
    throw new Error("No account found for this email");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.resetPasswordExpires = Date.now() + 1000 * 60 * 30;
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  res.json({ message: "Password reset token created", resetUrl });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token || !password) {
    res.status(400);
    throw new Error("Token and new password are required");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired password reset token");
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: "Password has been reset successfully" });
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select(
    "-password -resetPasswordToken -resetPasswordExpires",
  );
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json(user);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { fullname, email, profilePicture } = req.body;

  if (!fullname || !email) {
    res.status(400);
    throw new Error("Name and email are required");
  }

  if (!validator.isEmail(email)) {
    res.status(400);
    throw new Error("Invalid email address");
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const existingEmailUser = await User.findOne({
    email: email.toLowerCase(),
    _id: { $ne: req.user.id },
  });
  if (existingEmailUser) {
    res.status(400);
    throw new Error("Email already exists");
  }

  user.fullname = fullname;
  user.email = email.toLowerCase();
  if (profilePicture !== undefined) {
    user.profilePicture = profilePicture;
  }

  await user.save();

  res.json({
    id: user._id,
    fullname: user.fullname,
    username: user.username,
    email: user.email,
    role: user.role,
    profilePicture: user.profilePicture,
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error("Current and new password are required");
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid current password");
  }

  user.password = newPassword;
  await user.save();

  res.json({ message: "Password changed successfully" });
});
