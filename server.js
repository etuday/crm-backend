const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
console.log("MONGO_URI:", process.env.MONGO_URI);

const app = express();

// ========================
// Middleware
// ========================
app.use(cors());
app.use(express.json());

// ========================
// Routes
// ========================
const authRoutes = require("./routes/authRoutes");
const ticketRoutes = require("./routes/ticketRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);

// ========================
// Import Auth Middleware
// ========================
const { protect, authorize } = require("./middleware/authMiddleware");

// ========================
// Test Route
// ========================
app.get("/", (req, res) => {
  res.send("CRM Backend Running...");
});

// ========================
// Protected Route
// ========================
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "You accessed protected route",
    user: req.user,
  });
});

// ========================
// Admin Only Route
// ========================
app.get("/api/admin", protect, authorize("Admin"), (req, res) => {
  res.json({
    message: "Welcome Admin",
  });
});

// ========================
// Connect MongoDB & Start Server
// ========================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
  });