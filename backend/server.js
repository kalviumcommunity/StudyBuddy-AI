const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // dotenv setup

const app = express();

// CORS setup
// If you want to allow only your frontend:
app.use(cors({
  origin: ['https://yourstudymateaai.netlify.app/'],
  credentials: true
}));
// To allow all origins, just use: app.use(cors());

// Parse JSON requests
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err.message));

// Test route
app.get("/", (req, res) => {
  res.json({ message: "StudyBuddy API running" });
});

// Routes
app.use("/gemini", require("./routes/gemini"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
