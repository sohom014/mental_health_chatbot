const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  reply: {
    type: String,
    required: true,
  },
  sentiment: {
    type: String,
    enum: ["neutral", "anxiety", "depression", "stress", null],
    default: null,
  },
  flagged: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;