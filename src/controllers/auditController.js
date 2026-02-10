const ActivityLog = require("../models/ActivityLog");

exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .sort("-createdAt")
      .limit(100)
      .populate("user", "name email");
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching audit logs" });
  }
};
