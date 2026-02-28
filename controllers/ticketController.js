const Ticket = require("../models/Ticket");


// ============================
// CREATE TICKET (User Only)
// ============================
exports.createTicket = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const ticket = await Ticket.create({
      title,
      description,
      createdBy: req.user.id,
      status: "Open",
    });

    res.status(201).json(ticket);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ============================
// GET TICKETS (Role Based)
// ============================
exports.getTickets = async (req, res) => {
  try {
    let filter = {};

    // 🔥 Role-based filtering
    if (req.user.role === "User") {
      filter.createdBy = req.user.id;
    }

    if (req.user.role === "Agent") {
      filter.assignedTo = req.user.id;
    }

    // Optional status filter
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const tickets = await Ticket.find(filter)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.json(tickets);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ============================
// UPDATE TICKET STATUS (Agent)
// ============================
exports.updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Only assigned agent can update
    if (
      req.user.role === "Agent" &&
      ticket.assignedTo?.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    ticket.status = status;

    // If closing ticket → store resolved time
    if (status === "Closed") {
      ticket.resolvedAt = new Date();
    }

    await ticket.save();

    res.json(ticket);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ============================
// ASSIGN TICKET (Admin Only)
// ============================
exports.assignTicket = async (req, res) => {
  try {
    const { assignedTo } = req.body;

    if (!assignedTo) {
      return res.status(400).json({ message: "Agent ID is required" });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    ticket.assignedTo = assignedTo;
    ticket.assignedAt = new Date();
    ticket.status = "In Progress";

    await ticket.save();

    res.json(ticket);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ============================
// DELETE TICKET (Admin Only)
// ============================
exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    await ticket.deleteOne();

    res.json({ message: "Ticket deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};