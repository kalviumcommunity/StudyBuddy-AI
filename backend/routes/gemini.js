const express = require("express");
const { zeroShot, oneShot, systemPrompt, multiShot, dynamicPrompt, chainOfThought, tokensAndTokenization } = require("../controllers/geminiController");
const { askQuestion, generateQuiz, generateSummary } = require("../controllers/studyBuddyController");
const router = express.Router();

// Frontend routes
router.post("/ask", askQuestion);
router.post("/quiz", generateQuiz);
router.post("/summary", generateSummary);

// Existing routes
router.post("/zero-shot", zeroShot);

router.post("/one-shot", oneShot); 

router.post("/system-user", systemPrompt);

router.post("/multi-shot",multiShot);

router.post("/dynamic", dynamicPrompt);

router.post("/chain-of-thought", chainOfThought);

router.post("/tokens", tokensAndTokenization);

module.exports = router;
