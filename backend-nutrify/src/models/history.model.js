import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    foodName: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    calories: {
      type: Number,
      default: 0,
    },
    protein: {
      type: Number,
      default: 0,
    },
    carbs: {
      type: Number,
      default: 0,
    },
    fat: {
      type: Number,
      default: 0,
    },
    fiber: {
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
    confidence: {
      type: Number,
      default: 0,
    },
    recommendation: {
      type: String,
      default: "",
    },
    healthAnalysis: {
      type: [String],
      default: [],
    },
    healthScore: {
      type: Number,
      default: 0,
    },
    components: {
      type: Number,
      default: 1,
    },
    serving_size_g: {
      type: Number,
      default: 100,
    },
    serving_unit: {
      type: String,
      default: "porsi",
    },
  },
  {
    timestamps: true,
  }
);

historySchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

const History = mongoose.model("History", historySchema);

export default History;
