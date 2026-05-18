import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const registerUser = async (userData) => {
  const { name, email, password } = userData;

  // Check if email already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("Email already registered");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user in DB
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  };
};

export const loginUser = async (email, password) => {
  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  };
};

export const getAllUsers = async () => {
  return await User.find({}).select("-password");
};

export const getUserById = async (id) => {
  return await User.findById(id).select("-password");
};

export const updateUser = async (id, userData) => {
  // If updating password, hash it first
  if (userData.password) {
    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(userData.password, salt);
  }

  return await User.findByIdAndUpdate(id, userData, {
    new: true,
    runValidators: true,
  }).select("-password");
};

export const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};
