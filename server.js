require("dotenv").config();

const express = require("express");

const connectDB = require("./src/config/db.js");

const authRoutes=require('./src/routes/authRoutes.js');

const app = express();

connectDB();

app.use(express.json());


// Routes
app.use('/api/auth', authRoutes);

app.get("/", (req, res) => {
  res.send("Finance API is Running....");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
