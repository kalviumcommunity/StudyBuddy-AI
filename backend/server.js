const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const dotenv=require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: ['https://yourstudymateaai.netlify.app/'],
  credentials: true
}));

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
const geminiRoutes = require("./routes/gemini");
app.use("/api/gemini", geminiRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on: http://localhost:${PORT}`));
