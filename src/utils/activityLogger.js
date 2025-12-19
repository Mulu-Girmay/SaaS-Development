const ActivityLog = require("../models/ActivityLog");

exports.logActivity = async ({ action, user, note, meta = {} }) => {
  try {
    await ActivityLog.create({
      action,
      user,
      note,
      meta,
    });
  } catch (err) {
    console.error("Activity log failed:", err.message);
  }
};
