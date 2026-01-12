const express = require("express");
const router = express.Router();

const { 
  askQuestion, 
  generateQuiz, 
  generateSummary,
  generateStudyNotes,
  explainAnswer,
  ragQuery,
  createStudySession
} = require("../controllers/groqController");

// Main routes
router.post("/ask", askQuestion);
router.post("/quiz", generateQuiz);
router.post("/summary", generateSummary);
router.post("/study-notes", generateStudyNotes);
router.post("/explain", explainAnswer);
router.post("/rag", ragQuery);
router.post("/study-session", createStudySession);

module.exports = router;