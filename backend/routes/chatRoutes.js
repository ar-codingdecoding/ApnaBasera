import express from "express";
import OpenAI from "openai"; 

const router = express.Router();

// Initialize the Groq client
const groq = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1", 
  apiKey: process.env.GROQ_API_KEY,
});

// --- AI Chatbot Endpoint ---
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Create a streaming chat completion request to Groq
    const stream = await groq.chat.completions.create({
      model: "llama3-8b-8192", // A powerful and fast model available on Groq
      messages: [
        { 
          role: "system", 
          content: "You are a helpful and friendly assistant for a student housing website called ApnaBasera. Your name is 'ApnaBot'. Answer questions concisely and professionally." 
        },
        { 
          role: "user", 
          content: message 
        }
      ],
      stream: true,
    });

    // Set headers for Server-Sent Events (SSE) streaming
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Stream the response chunks back to the frontend
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        res.write(`data: ${JSON.stringify({ text: content })}\n\n`);
      }
    }

    res.end();

  } catch (error) {
    console.error("Groq Chat Error:", error);
    res.status(500).json({ error: "Failed to get response from AI." });
  }
});

export default router;