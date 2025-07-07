const cron = require('node-cron');
const User = require('../models/User');

const deleteUnverifiedUsers = () => {cron.schedule('*/30 * * * *', async () => {
  const THIRTY_MINUTES_AGO = new Date(Date.now() - 30 * 60 * 1000);

  try {
    const result = await User.deleteMany({
      isVerified: false,
      createdAt: { $lt: THIRTY_MINUTES_AGO },
    });

    if (result.deletedCount > 0) {
      console.log(`🧹 Deleted ${result.deletedCount} unverified users`);
    }
  } catch (err) {
    console.error('❌ Error cleaning up unverified users:', err);
  }
});
};

module.exports = deleteUnverifiedUsers;

// Run every 10 minutes (adjustable)
// cron.schedule('*/10 * * * *', async () => {
//   const THIRTY_MINUTES_AGO = new Date(Date.now() - 30 * 60 * 1000);

//   try {
//     const result = await User.deleteMany({
//       isVerified: false,
//       createdAt: { $lt: THIRTY_MINUTES_AGO },
//     });

//     if (result.deletedCount > 0) {
//       console.log(`🧹 Deleted ${result.deletedCount} unverified users`);
//     }
//   } catch (err) {
//     console.error('❌ Error cleaning up unverified users:', err);
//   }
// });