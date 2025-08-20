// controllers/geminiController.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// ZERO-SHOT PROMPT
exports.zeroShot = async (req, res) => {
  try {
    const { question } = req.body;
    const result = await model.generateContent(question);

    res.json({ response: result.response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating zero-shot response" });
  }
};

// ONE-SHOT PROMPT
exports.oneShot = async (req, res) => {
  try {
    const { question } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // One-shot example + user question
    const prompt = `
You are a study buddy AI. Answer questions simply.

Example:
Q: What is photosynthesis?
A: Photosynthesis is the process by which plants make food using sunlight.

Now answer:
Q: ${question}
    `;

    const result = await model.generateContent(prompt);

    res.json({ response: result.response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating one-shot response" });
  }
};
