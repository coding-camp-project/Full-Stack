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
    profilePicture: user.profilePicture || "",
    isPersonalized: false,
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

  const isPersonalized = Boolean(user.height && user.weight && user.birthDate);

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    profilePicture: user.profilePicture || "",
    isPersonalized,
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
  const payload = { ...userData };

  // Normalize multi-select fields so empty selections overwrite old values.
  const arrayFields = [
    "healthConditions",
    "allergies",
    "foodRestrictions",
    "foodPreferences",
  ];
  for (const field of arrayFields) {
    if (Object.prototype.hasOwnProperty.call(userData, field)) {
      payload[field] = Array.isArray(userData[field]) ? userData[field] : [];
    }
  }

  // Enforce max 2 health conditions limit
  if (payload.healthConditions && payload.healthConditions.length > 2) {
    throw new Error("Maksimal penyakit/kondisi kesehatan yang dapat dipilih adalah 2.");
  }

  // If updating password, hash it first
  if (payload.password) {
    const salt = await bcrypt.genSalt(10);
    payload.password = await bcrypt.hash(payload.password, salt);
  }

  return await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).select("-password");
};

export const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

export const googleLoginUser = async (googleData) => {
  const { name, email, profilePicture } = googleData;

  // Find user by email
  let user = await User.findOne({ email });

  if (!user) {
    // Generate a secure random password
    const randomPassword = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(randomPassword, salt);

    user = await User.create({
      name: name || "Google User",
      email,
      password: hashedPassword,
      profilePicture: profilePicture || "",
    });
  }

  const isPersonalized = Boolean(user.height && user.weight && user.birthDate);

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    profilePicture: user.profilePicture || "",
    isPersonalized,
    token: generateToken(user._id),
  };
};
