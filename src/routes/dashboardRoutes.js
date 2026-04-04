const express = require("express");
const { getSummary } = require("../controllers/dashboardController");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

const router = express.Router();

// Only Admins and Analysts can view the dashboard
router.get(
  "/summary",
  authenticateUser,
  authorizeRoles("Admin", "Analyst"),
  getSummary,
);

module.exports = router;
