require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
connectDB();
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
