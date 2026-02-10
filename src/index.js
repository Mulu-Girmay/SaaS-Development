const path = require("path");
const dotenv = require("dotenv");
const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
dotenv.config({ path: path.join(__dirname, "..", envFile) });
const express = require("express");
const http = require("http");

const connectDB = require("./config/db");
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const { authLimiter, apiLimiter } = require("./middleware/rateLimiter");
const helmet = require("helmet");

const errorHandler = require("./middleware/errorHandler");
require("../socket")(server);
const authRoutes = require("./routes/authRoutes");
const inviteRoutes = require("./routes/inviteRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const teamRoutes = require("./routes/teamRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const auditRoutes = require("./routes/auditRoutes");
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/invites", inviteRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/audit", auditRoutes);
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

app.use(errorHandler);

app.use("/api/notes", require("./routes/note"));
app.use("/api/folders", require("./routes/folderRoutes"));
app.use("/api/files", require("./routes/fileRoutes"));
app.use(helmet());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      msg: "Invalid JSON payload. Ensure request body is valid JSON with double-quoted property names.",
    });
  }
  next(err);
});
if (process.env.NODE_ENV !== "test") {
  app.use("/api/auth", authLimiter);
  app.use("/api", apiLimiter);
}

app.use((err, req, res, next) => {
  console.error(err && err.stack ? err.stack : err);
  res
    .status(err && err.status ? err.status : 500)
    .json({ msg: err && err.message ? err.message : "Internal Server Error" });
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
  await connectDB();
  console.log(`server is running on port ${PORT}`);
});
module.exports = app;
