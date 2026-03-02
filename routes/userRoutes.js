const express = require("express");
const router = express.Router();

const { getAgents } = require("../controllers/userController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/agents", protect, authorize("Admin"), getAgents);

module.exports = router;