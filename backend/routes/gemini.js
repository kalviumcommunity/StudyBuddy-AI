const express = require("express");
const { zeroShot, oneShot } = require("../controllers/geminiController");
const router = express.Router();

router.post("/zero-shot", zeroShot);
// router.post("/one-shot", oneShot);
router.post("/one-shot", oneShot); // Assuming oneShot is the same as zeroShot for now

module.exports = router;
