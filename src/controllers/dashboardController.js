const Record = require("../models/Record");

// Get dashboard summary Totals and Category 
// GET /api/dashboard/summary
exports.getSummary = async (req, res) => {
  try {
    // Calculate Total Income and Total Expenses
    const totals = await Record.aggregate([
      {
        $group: {
          _id: "$type", // Group by income or expense
          totalAmount: { $sum: "$amount" }, // Add up the amounts
        },
      },
    ]);

    // Format the totals nicely
    let totalIncome = 0;
    let totalExpense = 0;

    totals.forEach((item) => {
      if (item._id === "income") totalIncome = item.totalAmount;
      if (item._id === "expense") totalExpense = item.totalAmount;
    });

    const netBalance = totalIncome - totalExpense;

    // Calculate totals per category e.g., Salary, Software, Rent
    const categoryTotals = await Record.aggregate([
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
        },
      },
      { $sort: { totalAmount: -1 } }, // Sort by highest amount first
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalIncome,
        totalExpense,
        netBalance,
        categoryTotals,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};
