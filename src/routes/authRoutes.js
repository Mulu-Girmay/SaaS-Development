const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/role");
router.get("/profile", protect, (req, res) => {
  res.json({ user: req.user });
});
router.get("/admin-data", protect, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Admin route working" });
});
router.post("/register", register);
router.post("/login", login);
module.exports = router;
