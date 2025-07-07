// jobs/deleteUnverifiedUser.js
const User = require('../models/User');
const { sendUnverifiedReminder } = require('../utils/sendEmail');

module.exports = (agenda) => {
  agenda.define('delete-unverified-user', async (job) => {
    const { userId } = job.attrs.data;
    const user = await User.findById(userId);

    if (!user) return;
    if (user.isVerified) return;

    // Optionally: send final reminder before delete
    await sendUnverifiedReminder(user.email);

    // Wait 5 more minutes, then delete
    await new Promise(r => setTimeout(r, 5 * 60 * 1000));
    const stillUnverified = await User.findById(userId);
    if (stillUnverified && !stillUnverified.isVerified) {
      await stillUnverified.deleteOne();
      console.log(`Deleted unverified user: ${stillUnverified.email}`);
    }
  });
};

// Schedule Job on Registration In register controller
const agenda = require('../agenda');
require('../jobs/deleteUnverifiedUser')(agenda);

await agenda.start();
await agenda.schedule(`${process.env.DELETE_UNVERIFIED_AFTER_MIN} minutes from now`, 'delete-unverified-user', { userId: user._id });

// utils/sendEmail.js
exports.sendUnverifiedReminder = async (to) => {
  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to,
    subject: 'Your account will be deleted',
    html: `<p>Your account was not verified. Please verify it within the next 5 minutes or it will be deleted.</p>`,
  });
};


// Launch Agenda on App Start In server.js:

const agenda = require('./agenda');
require('./jobs/deleteUnverifiedUser')(agenda);

agenda.start().then(() => {
  console.log('Agenda started');
});

// Optional: Use Agendash for Visual UI

// npm install agendash

// In server.js:

const Agendash = require('agendash');
app.use('/dash', Agendash(agenda));

// Visit http://localhost:5000/dash to view jobs.