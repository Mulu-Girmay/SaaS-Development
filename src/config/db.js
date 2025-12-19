const mongoose = require("mongoose");
let uri = process.env.MONGO_URI;
const connectDB = async () => {
  try {
    
    await mongoose.connect(uri);
    console.log("MongoDB connected ");
  } catch (err) {
    console.log(err.message);
    process.exit(1)
  }
};
module.exports = connectDB;
