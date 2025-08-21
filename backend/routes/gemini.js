const express = require("express");
const { zeroShot, oneShot, systemPrompt } = require("../controllers/geminiController");
const router = express.Router();

router.post("/zero-shot", zeroShot);

router.post("/one-shot", oneShot); 

router.post("/system-user", systemPrompt);

module.exports = router;
