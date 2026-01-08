const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// Import both old and new controllers
const { 
  zeroShot, 
  oneShot, 
  systemPrompt, 
  multiShot, 
  dynamicPrompt, 
  chainOfThought, 
  tokensAndTokenization 
} = require("../controllers/geminiController");

const {
  generateStudyNotes,
  generateQuiz,
  explainAnswer,
  ragQuery,
  createStudySession
} = require("../controllers/studyBuddyController");

// ========================================
// ORIGINAL ROUTES (for demonstration)
// ========================================
router.post("/zero-shot", zeroShot);
router.post("/one-shot", oneShot); 
router.post("/system-user", systemPrompt);
router.post("/multi-shot", multiShot);
router.post("/dynamic", dynamicPrompt);
router.post("/chain-of-thought", chainOfThought);
router.post("/tokens", tokensAndTokenization);

// ========================================
// NEW STUDYBUDDY ROUTES (main features)
// ========================================

// Generate study notes (structured output)
router.post("/study-notes", authMiddleware, generateStudyNotes);

// Generate quiz (structured output + function calling)
router.post("/quiz", authMiddleware, generateQuiz);

// Explain answer (chain of thought)
router.post("/explain", authMiddleware, explainAnswer);

// RAG query (retrieval augmented generation)
router.post("/rag", authMiddleware, ragQuery);

// Complete study session (combines everything)
router.post("/study-session", authMiddleware, createStudySession);

module.exports = router;