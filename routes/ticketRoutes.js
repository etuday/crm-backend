const express = require("express");
const router = express.Router();

const {
  createTicket,
  getTickets,
  updateTicketStatus,
  assignTicket,
} = require("../controllers/ticketController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Create ticket (User)
router.post("/", protect, createTicket);

// Get tickets
router.get("/", protect, getTickets);

// Update status
router.put("/:id/status", protect, updateTicketStatus);

// Assign ticket (Admin only)
router.put("/:id/assign", protect, authorize("Admin"), assignTicket);

module.exports = router;