import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateToken } from "../utils/generateToken.js";

const formatAuthResponse = (user) => ({
  token: generateToken(user),
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  },
});

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password || !phone) {
    res.status(400);
    throw new Error("Please provide name, email, phone, and password.");
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    res.status(409);
    throw new Error("An account with this email already exists.");
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    phone,
    role: "user",
  });

  res.status(201).json(formatAuthResponse(user));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required.");
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password.");
  }

  if (role && user.role !== role) {
    res.status(403);
    throw new Error(`This account does not have ${role} access.`);
  }

  res.json(formatAuthResponse(user));
});

export const getProfile = asyncHandler(async (req, res) => {
  res.json({
    user: req.user,
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    res.status(400);
    throw new Error("Current password, new password, and confirm password are required.");
  }

  if (newPassword.length < 6) {
    res.status(400);
    throw new Error("New password must be at least 6 characters long.");
  }

  if (newPassword !== confirmPassword) {
    res.status(400);
    throw new Error("New password and confirm password do not match.");
  }

  if (currentPassword === newPassword) {
    res.status(400);
    throw new Error("New password must be different from the current password.");
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User account not found.");
  }

  const isCurrentPasswordValid = await user.matchPassword(currentPassword);

  if (!isCurrentPasswordValid) {
    res.status(401);
    throw new Error("Current password is incorrect.");
  }

  user.password = newPassword;
  await user.save();

  res.json({
    message: "Password changed successfully.",
  });
});
