import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    conversationId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

chatSchema.index({ conversationId: 1, timestamp: 1 });
chatSchema.index({ userId: 1, timestamp: 1 });

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
