
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

    // One-shot example +user question
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

//System &User Prompt
exports.systemPrompt=async (req, res) => {
  try {
    const { userQuestion } = req.body;
    
    //System Prompt (role instruction)
    const systemPrompt = "You are a Study Buddy AI. Explain concepts in a simple, clear way that a high school student can understand. Use short paragraphs, bullet points, and simple language.";
    //User Prompt (actual question)
    const finalPrompt=`${systemPrompt}\n\nUser Question: ${userQuestion}`;

    const model=genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(finalPrompt);

    res.json({
      success:true,
      question: userQuestion,
      answer: result.response.text(),
    });
  }catch(error){
    console.error("Error:",error);
    res.status(500).json({ success: false, error: error.message });
  }

  };

  //Multi-shot Prompt
exports.multiShot = async (req, res) => {
  try {
    const { question } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
You are a helpful study buddy that explains step by step.

Example 1:
Q: What is 12 + 7?
A: 12 + 7 = 19.

Example 2:
Q: When did World War II end?
A: 1945.

Example 3:
Q: What is gravity?
A: It's the force that pulls objects toward the Earth.

Now, answer this question:
Q: ${question}
`;
   const result = await model.generateContent(prompt);
    res.json({ response: result.response.text() });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating response" });
  }
};
