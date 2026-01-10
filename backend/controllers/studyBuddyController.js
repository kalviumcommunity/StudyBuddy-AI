const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

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
      "question": "Question text?",
      "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
      "answer": "A"
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    const data = JSON.parse(text);
    res.status(200).json(data);

  } catch (err) {
    console.error("Quiz Error:", err);
    res.status(500).json({ error: "Failed to generate quiz" });
  }
};

/* =========================
   SUMMARY GENERATION
========================= */
exports.generateSummary = async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic required" });
    }

    const prompt = `Provide a concise, easy-to-understand summary of "${topic}" in 200-300 words. Focus on key concepts and important details.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.status(200).json({ summary: response });

  } catch (err) {
    console.error("Summary Error:", err);
    res.status(500).json({ error: "Failed to generate summary" });
  }
};

// ========================================
// 1. GENERATE STUDY NOTES (Structured Output)
// ========================================
exports.generateStudyNotes = async (req, res) => {
  try {
    const { topic, difficulty } = req.body;

    if (!topic || !difficulty) {
      return res.status(400).json({ message: "Topic and difficulty are required" });
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 500,
        topP: 0.8,
      }
    });

    const prompt = `You are a Study Buddy AI. Generate concise study notes on the topic: "${topic}" at ${difficulty} difficulty level.

Return ONLY valid JSON in this exact format (no markdown, no extra text):
{
  "title": "Topic Name",
  "summary": "2-3 sentence overview",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "examples": ["example 1", "example 2"]
}`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text().trim();
    
    // Clean up markdown code blocks if present
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    const parsedNotes = JSON.parse(responseText);

    res.json({
      success: true,
      topic,
      difficulty,
      notes: parsedNotes
    });

  } catch (error) {
    console.error("Error generating study notes:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error generating study notes",
      error: error.message 
    });
  }
};

// ========================================
// 2. GENERATE QUIZ (Structured Output + Function Calling)
// ========================================
exports.generateQuiz = async (req, res) => {
  try {
    const { topic, difficulty, numQuestions = 5 } = req.body;

    if (!topic || !difficulty) {
      return res.status(400).json({ message: "Topic and difficulty are required" });
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      }
    });

    const prompt = `You are a Study Buddy AI quiz generator. Create ${numQuestions} multiple-choice questions on "${topic}" at ${difficulty} difficulty.

Return ONLY valid JSON in this exact format (no markdown):
{
  "quiz": [
    {
      "question": "Question text here?",
      "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
      "correctAnswer": "A",
      "explanation": "Why this is correct"
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text().trim();
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    const parsedQuiz = JSON.parse(responseText);

    res.json({
      success: true,
      topic,
      difficulty,
      quiz: parsedQuiz.quiz
    });

  } catch (error) {
    console.error("Error generating quiz:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error generating quiz",
      error: error.message 
    });
  }
};

// ========================================
// 3. EXPLAIN ANSWER (Chain of Thought)
// ========================================
exports.explainAnswer = async (req, res) => {
  try {
    const { question, userAnswer } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 400,
      }
    });

    const prompt = `You are a Study Buddy AI. Explain the answer to this question step-by-step.

Question: ${question}
${userAnswer ? `Student's Answer: ${userAnswer}` : ''}

Provide:
1. Step-by-step reasoning
2. The correct answer
3. Why it's correct
4. Common mistakes to avoid

Be concise and use simple language.`;

    const result = await model.generateContent(prompt);

    res.json({
      success: true,
      question,
      explanation: result.response.text()
    });

  } catch (error) {
    console.error("Error explaining answer:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error generating explanation",
      error: error.message 
    });
  }
};

// ========================================
// 4. RAG - Retrieval Augmented Generation
// ========================================
// Simple in-memory knowledge base (you can replace with vector DB later)
const knowledgeBase = [
  {
    id: 1,
    topic: "photosynthesis",
    content: "Photosynthesis is the process by which green plants use sunlight to synthesize nutrients from carbon dioxide and water. It occurs in chloroplasts and produces glucose and oxygen. The equation is: 6CO2 + 6H2O + light energy → C6H12O6 + 6O2."
  },
  {
    id: 2,
    topic: "newton's laws",
    content: "Newton's Three Laws of Motion: 1) An object at rest stays at rest unless acted upon by force. 2) Force equals mass times acceleration (F=ma). 3) For every action there is an equal and opposite reaction. These laws form the foundation of classical mechanics."
  },
  {
    id: 3,
    topic: "world war 2",
    content: "World War II (1939-1945) was a global conflict involving most of the world's nations. It began with Germany's invasion of Poland and ended with the surrender of Japan after atomic bombs were dropped on Hiroshima and Nagasaki. Major events include the Holocaust, D-Day, and the Battle of Stalingrad."
  },
  {
    id: 4,
    topic: "pythagorean theorem",
    content: "The Pythagorean theorem states that in a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides: a² + b² = c². It's used to find distances, in construction, navigation, and computer graphics."
  }
];

// Simple keyword-based retrieval (you can upgrade to embeddings later)
function retrieveRelevantDocs(query, topK = 2) {
  const queryLower = query.toLowerCase();
  const scored = knowledgeBase.map(doc => {
    const relevance = doc.topic.split(' ').filter(word => 
      queryLower.includes(word)
    ).length;
    return { ...doc, relevance };
  });
  
  return scored
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, topK)
    .filter(doc => doc.relevance > 0);
}

exports.ragQuery = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    // Step 1: Retrieve relevant documents
    const relevantDocs = retrieveRelevantDocs(question);

    if (relevantDocs.length === 0) {
      return res.json({
        success: true,
        question,
        answer: "I don't have specific information about that topic in my knowledge base. Let me try to answer based on my general knowledge.",
        sources: []
      });
    }

    // Step 2: Augment prompt with retrieved context
    const context = relevantDocs.map(doc => doc.content).join('\n\n');
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 400,
      }
    });

    const prompt = `You are a Study Buddy AI. Use the following context to answer the question accurately.

Context:
${context}

Question: ${question}

Instructions:
- Base your answer primarily on the provided context
- Add simple examples if helpful
- Keep it concise and student-friendly
- If the context doesn't fully answer the question, say so`;

    const result = await model.generateContent(prompt);

    res.json({
      success: true,
      question,
      answer: result.response.text(),
      sources: relevantDocs.map(doc => ({ id: doc.id, topic: doc.topic }))
    });

  } catch (error) {
    console.error("Error in RAG query:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error processing RAG query",
      error: error.message 
    });
  }
};

// ========================================
// 5. COMPLETE STUDY SESSION (Combines everything)
// ========================================
exports.createStudySession = async (req, res) => {
  try {
    const { topic, difficulty } = req.body;

    if (!topic || !difficulty) {
      return res.status(400).json({ message: "Topic and difficulty are required" });
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 1000,
      }
    });

    const prompt = `You are a Study Buddy AI. Create a complete study session on "${topic}" at ${difficulty} level.

Return ONLY valid JSON (no markdown):
{
  "notes": {
    "title": "Topic name",
    "summary": "Brief overview",
    "keyPoints": ["point1", "point2", "point3"]
  },
  "quiz": [
    {
      "question": "Question?",
      "options": ["A) opt1", "B) opt2", "C) opt3", "D) opt4"],
      "correctAnswer": "A"
    }
  ],
  "studyTips": ["tip1", "tip2"]
}`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text().trim();
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    const session = JSON.parse(responseText);

    res.json({
      success: true,
      topic,
      difficulty,
      session
    });

  } catch (error) {
    console.error("Error creating study session:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error creating study session",
      error: error.message 
    });
  }
};