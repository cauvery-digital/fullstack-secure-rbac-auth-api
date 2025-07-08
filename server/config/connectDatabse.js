const mongoose = require('mongoose');

 const connectDatabse = async () => {
await mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log(`✔ ⫷ DB⫸  Connected: ${mongoose.connection.host}\n✔ [Name]: ${mongoose.connection.name}\n✔ [Port]: ${mongoose.connection.port}`);
  })
  .catch(err => console.error('\n❌ DB Connection', err));
  };

  module.exports = connectDatabse