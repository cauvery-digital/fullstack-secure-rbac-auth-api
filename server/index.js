require("dotenv").config();
const express = require("express");
const connecDatabase = require('./config/connectDatabse.js')
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require('./routes/auth.js');
const deleteUnverifiedUsers = require("./jobs/deleteUnverifiedUsers");


const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);

connecDatabase();
deleteUnverifiedUsers()
app.listen(process.env.PORT, () => {
  console.log(`\n✔ Server running on http://localhost:${process.env.PORT} 🚀`);
});
