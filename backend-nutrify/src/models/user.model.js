import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    // Personalization Fields
    birthDate: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      default: "",
    },
    height: {
      type: Number,
      default: 0,
    },
    weight: {
      type: Number,
      default: 0,
    },
    activityLevel: {
      type: String,
      default: "",
    },
    healthConditions: {
      type: [String],
      default: [],
    },
    otherConditions: {
      type: String,
      default: "",
    },
    allergies: {
      type: [String],
      default: [],
    },
    foodRestrictions: {
      type: [String],
      default: [],
    },
    primaryGoal: {
      type: String,
      default: "",
    },
    foodPreferences: {
      type: [String],
      default: [],
    },
    additionalNotes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
