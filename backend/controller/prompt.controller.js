import dotenv from "dotenv";
import { Prompt } from "../model/prompt.model.js";

// Node 18+ ke liye built-in fetch available hai
dotenv.config();

export const sendPrompt = async (req, res) => {
  try {
    const userMessage = req.body.prompt;
    const userId=req.userId

    if (!userMessage) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Save user prompt to DB
    const savedUserPrompt = await Prompt.create({
      userId,
      role: "user",
      content: userMessage,
    });

    // Make POST request to OpenRouter using native fetch
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.DEEPSEEK_KEY}`,
        "Content-Type": "application/json",// Change if needed
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1:free",
        messages: [{ role: "user", content: userMessage }],
      }),
    });
    console.log("Using API key:", process.env.DEEPSEEK_KEY ? "Loaded" : "Not found");


    const data = await response.json();

    // If response has error
    if (!response.ok || !data.choices || !data.choices[0]) {
      console.error("API error:", data);
      return res.status(500).json({ error: "AI response error", details: data });
    }

    const aiMessage = data.choices[0].message.content;

    // Save AI response to DB
    const savedAiPrompt = await Prompt.create({
      userId,
      role: "assistant",
      content: aiMessage,
    });

    res.json({
      success: true,
      userPrompt: savedUserPrompt,
      assistantReply: savedAiPrompt,
    });

  } catch (error) {
    console.error("Prompt error:", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};



export const getTodayPrompt = async (req, res) => {
  try {
    const userId = req.userId;
   console.log("userId from getTodayPrompt:", userId); 

    // Get start and end of today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Get FIRST prompt of today by this user
    const firstPrompt = await Prompt.findOne({
      userId,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    }).sort({ createdAt: 1 });

    if (!firstPrompt) {
      return res.status(404).json({ message: "No prompt found for today." });
    }

    res.json({ prompt: firstPrompt });
  } catch (error) {
    console.error("Error fetching today's prompt:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

