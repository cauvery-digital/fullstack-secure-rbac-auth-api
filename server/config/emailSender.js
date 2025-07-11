const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Uncomment the following line to verify the SMTP configuration
// This is useful for debugging purposes to ensure the SMTP settings are correct

// transporter.verify().then(()=> console.log("✔ SMTP Config. working")).catch((err)=> console.log("\n❌ SMTP Connection",err)); // Verify the connection configuration

module.exports = transporter;