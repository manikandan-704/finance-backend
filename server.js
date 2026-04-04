require("dotenv").config();

const express = require("express");

const connectDB = require("./src/config/db.js");

const authRoutes=require('./src/routes/authRoutes.js');
const recordRoutes = require('./src/routes/recordRoutes.js');       
const dashboardRoutes = require('./src/routes/dashboardRoutes.js');

// Error Handler
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();

connectDB();

app.use(express.json());


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/records', recordRoutes);       
app.use('/api/dashboard', dashboardRoutes);

app.use(errorHandler);


app.get("/", (req, res) => {
  res.send("Finance API is Running....");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
