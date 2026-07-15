require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const rescueRoutes = require("./routes/rescueRoutes");

const app = express();

connectDB();

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded photos statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API routes
app.use("/api/requests", rescueRoutes);

app.get("/", (req, res) => {
  res.send("Animal Rescue Request Board API is running");
});

// Basic error handler (e.g. multer file type errors)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
