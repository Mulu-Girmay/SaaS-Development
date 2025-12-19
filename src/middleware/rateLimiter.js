const rateLimit = require("express-rate-limit");

authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10, // 10 requests
  message: "Too many attempts. Try again later.",
});

apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
module.exports = { authLimiter, apiLimiter };
