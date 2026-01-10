const express = require("express");
const router = express.Router();

const {
  askQuestion,
  generateQuiz,
  generateSummary,
} = require("../controllers/studyBuddyController");

router.post("/ask", askQuestion);
router.post("/quiz", generateQuiz);
router.post("/summary", generateSummary);

module.exports = router;