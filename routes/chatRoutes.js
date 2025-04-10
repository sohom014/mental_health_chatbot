const express = require("express");
const router = express.Router();
const geminiChat = require("../controllers/geminiChatHandler");
const Chat = require("../models/Chat");
const { protect } = require("../middleware/authMiddleware");

// Process a new chat message
router.post("/message", protect, async (req, res) => {
  const { message } = req.body;
  const userId = req.user._id;

  if (!message || message.trim() === "") {
    return res.status(400).json({ 
      success: false,
      error: "Empty message not allowed." 
    });
  }

  try {
    // Get response from Gemini
    const reply = await geminiChat(message);
    
    // Create new chat entry
    const chatEntry = await Chat.create({
      user: userId,
      message,
      reply
    });

    res.status(200).json({
      success: true,
      data: {
        id: chatEntry._id,
        message,
        reply,
        timestamp: chatEntry.createdAt,
        flagged: false // You can implement flagging logic later
      }
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to process your message. Please try again later." 
    });
  }
});

// Get chat history for authenticated user
router.get("/history", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit) || 20;
    
    const chats = await Chat.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(limit);
      
    res.status(200).json({
      success: true,
      data: chats.map(chat => ({
        id: chat._id,
        message: chat.message,
        reply: chat.reply,
        timestamp: chat.createdAt,
        flagged: false // You can implement flagging logic later
      }))
    });
  } catch (error) {
    console.error("History fetch error:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to retrieve chat history." 
    });
  }
});

// Clear chat history for authenticated user
router.delete("/history", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    await Chat.deleteMany({ user: userId });
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error("History delete error:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to clear chat history." 
    });
  }
});

module.exports = router;