const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  getMySubscription,
  updatePlan,
} = require("../controllers/subscriptionController");

router.get("/me", protect, getMySubscription);
router.post("/plan", protect, updatePlan);

module.exports = router;
