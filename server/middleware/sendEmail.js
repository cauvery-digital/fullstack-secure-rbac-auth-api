const transporter = require('../config/emailSender.js');

const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: process.env.EMAIL_SENDER,
    to,
    subject,
    html,
  });
};
module.exports = sendEmail;