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

// JSON parse error handler (catches invalid/malformed JSON sent to express.json)
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res
      .status(400)
      .json({
        msg: "Invalid JSON payload. Ensure request body is valid JSON with double-quoted property names.",
      });
  }
  next(err);
});

// Generic error handler
app.use((err, req, res, next) => {
  console.error(err && err.stack ? err.stack : err);
  res
    .status(err && err.status ? err.status : 500)
    .json({ msg: err && err.message ? err.message : "Internal Server Error" });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
