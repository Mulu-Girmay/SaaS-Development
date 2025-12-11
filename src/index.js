require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const app = express();
const authRoutes = require("./routes/authRoutes");
app.use(cors());
app.use(express.json());
connectDB();
app.use("/api/auth", authRoutes);
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
