const express = require("express");
const { zeroShot, oneShot, systemPrompt, multiShot } = require("../controllers/geminiController");
const router = express.Router();

router.post("/zero-shot", zeroShot);

router.post("/one-shot", oneShot); 

router.post("/system-user", systemPrompt);

router.post("/multi-shot",multiShot);

module.exports = router;
