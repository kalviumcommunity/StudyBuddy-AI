const express = require("express");
const router = express.Router();

// Import GROQ controller (main)
const { 
  askQuestion, 
  generateQuiz, 
  generateSummary,
  generateStudyNotes,
  explainAnswer,
  ragQuery,
  createStudySession
} = require("../controllers/studyBuddyController");

// Import old Gemini controller for demo routes (optional)
const { 
  zeroShot, 
  oneShot, 
  systemPrompt, 
  multiShot, 
  dynamicPrompt, 
  chainOfThought, 
  tokensAndTokenization 
} = require("../controllers/geminiController");

// ========================================
// MAIN FRONTEND ROUTES (GROQ - Fast & Free)
// ========================================
router.post("/ask", askQuestion);
router.post("/quiz", generateQuiz);
router.post("/summary", generateSummary);

// ========================================
// ADVANCED FEATURES (GROQ)
// ========================================
router.post("/study-notes", generateStudyNotes);
router.post("/explain", explainAnswer);
router.post("/rag", ragQuery);
router.post("/study-session", createStudySession);

// ========================================
// OLD DEMO ROUTES (Gemini - keep if needed)
// ========================================
router.post("/zero-shot", zeroShot);
router.post("/one-shot", oneShot); 
router.post("/system-user", systemPrompt);
router.post("/multi-shot", multiShot);
router.post("/dynamic", dynamicPrompt);
router.post("/chain-of-thought", chainOfThought);
router.post("/tokens", tokensAndTokenization);

module.exports = router;