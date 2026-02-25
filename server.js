const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);


const ticketRoutes = require("./routes/ticketRoutes");
app.use("/api/tickets", ticketRoutes);


// Import middleware (ONLY ONCE)
const { protect, authorize } = require("./middleware/authMiddleware");

// Test route
app.get("/", (req, res) => {
  res.send("CRM Backend Running...");
});

// Protected route
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "You accessed protected route",
    user: req.user,
  });
});

// Admin-only route
app.get("/api/admin", protect, authorize("Admin"), (req, res) => {
  res.json({
    message: "Welcome Admin",
  });
});

// Connect MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
  });