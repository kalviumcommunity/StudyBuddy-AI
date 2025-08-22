
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

// Dynamic Prompting
exports.dynamicPrompt = async (req, res) => {
  try {
    const { topic, difficulty } = req.body;

    if (!topic || !difficulty) {
      return res.status(400).json({ message: "Topic and difficulty are required" });
    }

    // Dynamically build the prompt based on difficulty
    let prompt = `You are a Study Buddy AI. Explain the concept of ${topic}`;
    
    if (difficulty.toLowerCase() === 'easy') {
      prompt += ' in very simple terms, like teaching a beginner high school student. Use short sentences and everyday examples.';
    } else if (difficulty.toLowerCase() === 'medium') {
      prompt += ' with moderate details, suitable for someone with basic knowledge. Include key steps and one or two examples.';
    } else if (difficulty.toLowerCase() === 'hard') {
      prompt += ' in depth, for advanced learners. Cover technical details, formulas if applicable, and real-world applications.';
    } else {
      return res.status(400).json({ message: "Invalid difficulty level. Use 'easy', 'medium', or 'hard'." });
    }

    const result = await model.generateContent(prompt);

    res.json({ response: result.response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating dynamic response" });
  }
};

// Chain of Thought Prompting
exports.chainOfThought = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    const prompt = `
You are a Study Buddy AI. Solve the following question step by step, showing your reasoning process clearly before giving the final answer.

Question: ${question}

Instructions:
- Break down the problem into logical steps.
- Explain each step in simple language.
- Provide the final answer at the end.

Begin your response with 'Step 1:' and end with 'Final Answer:'.
`;

    const result = await model.generateContent(prompt);

    res.json({ response: result.response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating chain of thought response" });
  }
};