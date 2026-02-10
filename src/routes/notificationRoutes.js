const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  listNotifications,
  markRead,
} = require("../controllers/notificationController");

router.get("/", protect, listNotifications);
router.post("/read", protect, markRead);

module.exports = router;
