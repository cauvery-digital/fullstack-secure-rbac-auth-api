const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify().then(()=> console.log("✔ SMTP Config. working")).catch((err)=> console.log("\n❌ SMTP Connection",err)); // Verify the connection configuration
// Log the verification result
module.exports = transporter;