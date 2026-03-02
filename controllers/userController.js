const User = require("../models/User");

// GET ALL AGENTS (Admin Only)
exports.getAgents = async (req, res) => {
  try {
    const agents = await User.find({ role: "Agent" })
      .select("_id name email");

    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};