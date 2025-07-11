require("dotenv").config();
const express = require("express");
const connecDatabase = require("./config/connectDatabse.js");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
// const xss = require("xss-clean");
const authRoutes = require("./routes/auth.js");
const deleteUnverifiedUsers = require("./jobs/deleteUnverifiedUsers");

const app = express();
// 🌐 Security Middlewares
app.use(helmet()); // Sets secure headers
app.use(
  cors({
    origin: process.env.CLIENT_URL, // Frontend origin
    credentials: true,
  })
);
app.use(hpp());                            // Prevent HTTP Param Pollution
//app.use(xss());                            // Sanitize user input
app.use(cookieParser());                   // Read cookies
app.use(express.json());                   // JSON body parser

app.use("/api/auth", authRoutes);

connecDatabase();
deleteUnverifiedUsers();
app.listen(process.env.PORT, () => {
  console.log(`\n✔ Server running on http://localhost:${process.env.PORT} 🚀`);
});
