const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  listInvites,
  acceptInvite,
  declineInvite,
} = require("../controllers/inviteController");

router.get("/", protect, listInvites);
router.post("/:id/accept", protect, acceptInvite);
router.post("/:id/decline", protect, declineInvite);

module.exports = router;
