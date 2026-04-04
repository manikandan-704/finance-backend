const Record = require("../models/Record.js");

// Create a new financial record
// POST /api/records

exports.createRecord = async (req, res) => {
  try {
    const { amount, type, category, date, notes } = req.body;

    const newRecord = await Record.create({
      userId: req.user.userId, // Pulled securely from the JWT token
      amount,
      type,
      category,
      date: date || Date.now(),
      notes,
    });

    res.status(201).json({ success: true, data: newRecord });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

//  Get all financial records with optional filtering
//  GET /api/records

exports.getRecords = async (req, res) => {
  try {
    const { type, category } = req.query;
    let query = {};

    // If user passes query params (e.g., /api/records?type=income)
    if (type) query.type = type;
    if (category) query.category = category;

    const records = await Record.find(query).sort({ date: -1 }); // Sort newest first

    res
      .status(200)
      .json({ success: true, count: records.length, data: records });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

//  Update a record
//  PUT /api/records/:id

exports.updateRecord = async (req, res) => {
  try {
    const record = await Record.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Returns the updated document
      runValidators: true, // Ensures the update matches our Mongoose schema
    });

    if (!record) {
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
    }

    res.status(200).json({ success: true, data: record });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// Delete a record
// DELETE /api/records/:id

exports.deleteRecord = async (req, res) => {
  try {
    const record = await Record.findByIdAndDelete(req.params.id);

    if (!record) {
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Record deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};
