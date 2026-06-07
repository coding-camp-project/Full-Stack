import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendVerificationEmail } from "./email.service.js";

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
    if (userExists.isVerified) {
      throw new Error("Email already registered");
    }

    // If the email exists but is NOT verified, we update the existing record
    // and resend the verification email (allows user to try registering again or fix typo)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    userExists.name = name;
    userExists.password = hashedPassword;
    userExists.verificationToken = verificationToken;
    await userExists.save();

    try {
      await sendVerificationEmail(userExists.email, verificationToken);
    } catch (error) {
      console.error("Failed to send verification email during re-registration:", error);
      throw new Error(`Gagal mengirim email verifikasi: ${error.message}`);
    }

    return {
      _id: userExists._id,
      name: userExists.name,
      email: userExists.email,
      profilePicture: userExists.profilePicture || "",
      isPersonalized: false,
      isVerified: false,
      message: "Registrasi ulang berhasil! Silakan verifikasi email Anda untuk mengaktifkan akun.",
    };
  }

  // Hash password for new registration
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Generate verification token
  const verificationToken = crypto.randomBytes(32).toString("hex");

  // Create user in DB with isVerified: false
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    isVerified: false,
    verificationToken,
  });

  // Send verification email and await it for Serverless compatibility (like Vercel)
  try {
    await sendVerificationEmail(user.email, verificationToken);
  } catch (error) {
    console.error("Failed to send verification email:", error);
    throw new Error(`Gagal mengirim email verifikasi: ${error.message}`);
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    profilePicture: user.profilePicture || "",
    isPersonalized: false,
    isVerified: false,
    message: "Registrasi berhasil! Silakan verifikasi email Anda untuk mengaktifkan akun.",
  };
};

export const loginUser = async (email, password) => {
  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Check if email is verified
  if (!user.isVerified) {
    throw new Error("Email Anda belum diverifikasi. Silakan periksa inbox/spam email Anda.");
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

  // Find user by email (don't use lean() because we might need to call save())
  let user = await User.findOne({ email });

  if (!user) {
    // Generate a secure random password for new Google users
    const randomPassword = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(randomPassword, salt);

    user = await User.create({
      name: name || "Google User",
      email,
      password: hashedPassword,
      profilePicture: profilePicture || "",
      isVerified: true, // Google login verified email automatically
    });
  } else if (!user.isVerified) {
    // If user registered manually but never verified, mark them verified since they verified ownership via Google
    user.isVerified = true;
    user.verificationToken = "";
    await user.save();
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

export const verifyEmail = async (token) => {
  const user = await User.findOne({ verificationToken: token });
  if (!user) {
    throw new Error("Token verifikasi tidak valid atau sudah kedaluwarsa.");
  }

  user.isVerified = true;
  user.verificationToken = "";
  await user.save();

  return user;
};
