const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { createTeam, getMyTeam, addMember } = require("../controllers/teamController");

router.post("/", protect, createTeam);
router.get("/me", protect, getMyTeam);
router.post("/members", protect, addMember);

module.exports = router;
