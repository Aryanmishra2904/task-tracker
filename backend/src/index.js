import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

connectDB();

const PORT = 5000;

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});