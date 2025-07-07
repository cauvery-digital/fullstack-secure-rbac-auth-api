const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify().then(()=> console.log("✔ SMTP Config. working")).catch((err)=> console.log("\n❌ SMTP Connection",err));

module.exports = async function sendEmail(to, subject, html) {
  await transporter.sendMail({
    from: process.env.EMAIL_SENDER,
    to,
    subject,
    html,
  });
};
