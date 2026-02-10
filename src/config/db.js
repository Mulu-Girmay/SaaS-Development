const mongoose = require("mongoose");
let uri = process.env.MONGO_URI;
const connectDB = async () => {
  try {
    if (!uri) {
      throw new Error("MONGO_URI is not set");
    }
    await mongoose.connect(uri);
    console.log("MongoDB connected ");
  } catch (err) {
    console.log(err.message);
    process.exit(1)
  }
};
module.exports = connectDB;
