import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    food_name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    serving_size_g: {
      type: Number,
      default: 100,
    },
    calories: {
      type: Number,
      default: 0,
    },
    protein: {
      type: Number,
      default: 0,
    },
    fat: {
      type: Number,
      default: 0,
    },
    carbohydrates: {
      type: Number,
      default: 0,
    },
    sugar: {
      type: Number,
      default: 0,
    },
    sodium: {
      type: Number,
      default: 0,
    },
    fiber: {
      type: Number,
      default: 0,
    },
    calories_from_macro: {
      type: Number,
      default: 0,
    },
    protein_per_calorie: {
      type: Number,
      default: 0,
    },
    fat_per_calorie: {
      type: Number,
      default: 0,
    },
    carbs_per_calorie: {
      type: Number,
      default: 0,
    },
    calorie_category: {
      type: String,
      default: "sedang",
    },
    is_high_protein: {
      type: Number,
      default: 0,
    },
    is_high_fiber: {
      type: Number,
      default: 0,
    },
    is_high_sodium: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Add text index for autocomplete search
foodSchema.index({ food_name: "text" });

const Food = mongoose.model("Food", foodSchema);

export default Food;
