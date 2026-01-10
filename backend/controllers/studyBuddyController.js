const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

/* =========================
   GEMINI SETUP
========================= */
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

/* =========================
   ASK QUESTION
========================= */
exports.askQuestion = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question required" });
    }

    const result = await model.generateContent(question);
    const response = result.response.text();

    res.status(200).json({ answer: response });

  } catch (err) {
    console.error("Ask Error:", err);
    res.status(500).json({ error: "Gemini failed" });
  }
};

/* =========================
   QUIZ GENERATION
========================= */
exports.generateQuiz = async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic required" });
    }

    const prompt = `
Create a 5-question multiple-choice quiz on "${topic}".

Return ONLY valid JSON in this format:
{
  "quiz": [
    {
      "question": "",
      "options": ["", "", "", ""],
      "answer": ""
    }
  ]
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Extract JSON safely
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;
    const quizData = JSON.parse(text.slice(jsonStart, jsonEnd));

    res.status(200).json(quizData);

  } catch (err) {
    console.error("Quiz Error:", err);
    res.status(500).json({ error: "Quiz failed" });
  }
};

/* =========================
   SUMMARY
========================= */
exports.generateSummary = async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic required" });
    }

    const result = await model.generateContent(
      `Explain "${topic}" in simple terms for a student.`
    );

    res.status(200).json({
      summary: result.response.text(),
    });

  } catch (err) {
    console.error("Summary Error:", err);
    res.status(500).json({ error: "Summary failed" });
  }
};
