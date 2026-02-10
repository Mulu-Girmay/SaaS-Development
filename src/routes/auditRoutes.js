const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/role");
const { getAuditLogs } = require("../controllers/auditController");

router.get("/", protect, authorizeRoles("admin"), getAuditLogs);

module.exports = router;
