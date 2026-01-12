const Groq = require("groq-sdk");
require("dotenv").config();

const groq = new Groq({ 
  apiKey: process.env.GROQ_API_KEY 
});

// Best models: llama3-70b-8192 (smartest) or llama3-8b-8192 (fastest)
const MODEL = "llama-3.3-70b-versatile";

// ========================================
// ASK QUESTION
// ========================================
exports.askQuestion = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question required" });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful study assistant. Provide clear, concise, and accurate answers to help students learn."
        },
        {
          role: "user",
          content: question
        }
      ],
      model: MODEL,
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 0.9
    });

    const answer = completion.choices[0].message.content;

    res.status(200).json({ answer });

  } catch (err) {
    console.error("Ask Error:", err);
    res.status(500).json({ 
      error: "Failed to get answer: " + err.message 
    });
  }
};

// ========================================
// QUIZ GENERATION
// ========================================
exports.generateQuiz = async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic required" });
    }

    const prompt = `Create a 5-question multiple-choice quiz on "${topic}".

Return ONLY valid JSON in this exact format (no markdown, no extra text):
{
  "quiz": [
    {
      "question": "Question text?",
      "options": ["option1", "option2", "option3", "option4"],
      "answer": "A"
    }
  ]
}`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a quiz generator. Always respond with valid JSON only, no markdown formatting."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: MODEL,
      temperature: 0.8,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });

    let text = completion.choices[0].message.content.trim();
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    const data = JSON.parse(text);
    
    res.status(200).json(data);

  } catch (err) {
    console.error("Quiz Error:", err);
    res.status(500).json({ 
      error: "Failed to generate quiz: " + err.message 
    });
  }
};

// ========================================
// SUMMARY GENERATION
// ========================================
exports.generateSummary = async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic required" });
    }

    const prompt = `Provide a concise, easy-to-understand summary of "${topic}" in 200-300 words. Focus on key concepts and important details that students should know.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert educator who explains topics clearly and concisely."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: MODEL,
      temperature: 0.6,
      max_tokens: 800
    });

    const summary = completion.choices[0].message.content;

    res.status(200).json({ summary });

  } catch (err) {
    console.error("Summary Error:", err);
    res.status(500).json({ 
      error: "Failed to generate summary: " + err.message 
    });
  }
};

// ========================================
// GENERATE STUDY NOTES
// ========================================
exports.generateStudyNotes = async (req, res) => {
  try {
    const { topic, difficulty } = req.body;

    if (!topic || !difficulty) {
      return res.status(400).json({ 
        message: "Topic and difficulty are required" 
      });
    }

    const prompt = `Generate concise study notes on "${topic}" at ${difficulty} difficulty level.

Return ONLY valid JSON in this exact format (no markdown):
{
  "title": "Topic Name",
  "summary": "2-3 sentence overview",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "examples": ["example 1", "example 2"]
}`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a study notes generator. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: MODEL,
      temperature: 0.6,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    let text = completion.choices[0].message.content.trim();
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    const notes = JSON.parse(text);

    res.json({
      success: true,
      topic,
      difficulty,
      notes
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
// EXPLAIN ANSWER
// ========================================
exports.explainAnswer = async (req, res) => {
  try {
    const { question, userAnswer } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    const prompt = `Explain the answer to this question step-by-step:

Question: ${question}
${userAnswer ? `Student's Answer: ${userAnswer}` : ''}

Provide:
1. Step-by-step reasoning
2. The correct answer
3. Why it's correct
4. Common mistakes to avoid

Be concise and use simple language.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a patient teacher who explains concepts step-by-step."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: MODEL,
      temperature: 0.6,
      max_tokens: 1000
    });

    const explanation = completion.choices[0].message.content;

    res.json({
      success: true,
      question,
      explanation
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
// RAG - Retrieval Augmented Generation
// ========================================

// Simple in-memory knowledge base
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
  },
  {
    id: 5,
    topic: "gravity",
    content: "Gravity is a natural phenomenon by which objects with mass are attracted to one another. On Earth, gravity gives weight to physical objects and causes them to fall toward the ground when dropped. The gravitational force is described by Newton's law of universal gravitation: F = G(m1*m2)/r²."
  }
];

// Simple keyword-based retrieval
function retrieveRelevantDocs(query, topK = 2) {
  const queryLower = query.toLowerCase();
  const scored = knowledgeBase.map(doc => {
    const topicWords = doc.topic.toLowerCase().split(' ');
    const contentWords = doc.content.toLowerCase();
    
    let relevance = 0;
    
    // Check topic match
    topicWords.forEach(word => {
      if (queryLower.includes(word)) relevance += 3;
    });
    
    // Check content match
    const queryWords = queryLower.split(' ').filter(w => w.length > 3);
    queryWords.forEach(word => {
      if (contentWords.includes(word)) relevance += 1;
    });
    
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
      // No relevant docs found, use general knowledge
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a helpful study assistant."
          },
          {
            role: "user",
            content: question
          }
        ],
        model: MODEL,
        temperature: 0.7,
        max_tokens: 800
      });

      return res.json({
        success: true,
        question,
        answer: completion.choices[0].message.content,
        sources: []
      });
    }

    // Step 2: Augment prompt with retrieved context
    const context = relevantDocs.map(doc => 
      `Topic: ${doc.topic}\n${doc.content}`
    ).join('\n\n');
    
    const prompt = `Use the following context to answer the question accurately.

Context:
${context}

Question: ${question}

Instructions:
- Base your answer primarily on the provided context
- Add simple examples if helpful
- Keep it concise and student-friendly
- If the context doesn't fully answer the question, say so`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a study assistant that answers questions based on provided context."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: MODEL,
      temperature: 0.5,
      max_tokens: 800
    });

    res.json({
      success: true,
      question,
      answer: completion.choices[0].message.content,
      sources: relevantDocs.map(doc => ({ 
        id: doc.id, 
        topic: doc.topic 
      }))
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
// CREATE STUDY SESSION
// ========================================
exports.createStudySession = async (req, res) => {
  try {
    const { topic, difficulty } = req.body;

    if (!topic || !difficulty) {
      return res.status(400).json({ 
        message: "Topic and difficulty are required" 
      });
    }

    const prompt = `Create a complete study session on "${topic}" at ${difficulty} level.

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

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a study session creator. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: MODEL,
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });

    let text = completion.choices[0].message.content.trim();
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    const session = JSON.parse(text);

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