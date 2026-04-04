const express = require("express");
const {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord,
} = require("../controllers/recordController.js");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateUser);

// Routes
router.post("/", authorizeRoles("Admin"), createRecord);
router.get("/", authorizeRoles("Admin", "Analyst"), getRecords);
router.put("/:id", authorizeRoles("Admin"), updateRecord);
router.delete("/:id", authorizeRoles("Admin"), deleteRecord);

module.exports = router;
