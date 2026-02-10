const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/role");
const { getSummary } = require("../controllers/analyticsController");

router.get("/summary", protect, authorizeRoles("admin"), getSummary);

module.exports = router;
