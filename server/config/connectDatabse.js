const mongoose = require("mongoose");

const connectDatabse = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✔ ⫷ DB⫸  Connected: ${conn.connection.host}`);
    // console.log(
    //   `✔ ⫷ DB⫸  Connected: ${conn.connection.host}\n✔ [Name]: ${conn.connection.name}\n✔ [Port]: ${conn.connection.port}`
    // );
  } catch (err) {
    console.error("\n❌ DB Connection", err);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDatabse;

// const connectDatabse = async () => {
//   await mongoose
//     .connect(process.env.MONGO_URI)
//     .then(() => {
//       console.log(
//         `✔ ⫷ DB⫸  Connected: ${mongoose.connection.host}\n✔ [Name]: ${mongoose.connection.name}\n✔ [Port]: ${mongoose.connection.port}`
//       );
//     })
//     .catch((err) => console.error("\n❌ DB Connection", err));
// };