// routes/chatRoutes.js
import express from "express";
import { chat } from "../server.js";

const router = express.Router();

// AI Chatbot
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message is required" });
    }

    const result = await chat.sendMessageStream(message);

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
    }

    res.write(`data: ${JSON.stringify({ text: " " })}\n\n`);
    res.end();
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to get response from AI" });
  }
});

// Get chat history (if you want to implement chat history storage)
router.get("/history", async (req, res) => {
  try {
    // This is a placeholder for chat history functionality
    // You can implement this based on your requirements
    res.status(200).json({
      message: "Chat history endpoint - implement based on your needs",
      history: [],
    });
  } catch (error) {
    console.error("Chat history error:", error);
    res.status(500).json({ error: "Failed to get chat history" });
  }
});

export default router;
