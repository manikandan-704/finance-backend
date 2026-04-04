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
const { validate, recordSchema } = require('../middlewares/validator');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateUser);

// Routes
router.post("/", authorizeRoles("Admin"), validate(recordSchema), createRecord);
router.get("/", authorizeRoles("Admin", "Analyst"), getRecords);
router.put("/:id", authorizeRoles("Admin"), validate(recordSchema), updateRecord);
router.delete("/:id", authorizeRoles("Admin"), deleteRecord);

module.exports = router;
