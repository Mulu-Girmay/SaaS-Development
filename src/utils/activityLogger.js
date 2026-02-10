const ActivityLog = require("../models/ActivityLog");
const AnalyticsEvent = require("../models/AnalyticsEvent");

exports.logActivity = async ({ action, user, note, meta = {} }) => {
  try {
    await ActivityLog.create({
      action,
      user,
      note,
      meta,
    });
    await AnalyticsEvent.create({
      user,
      event: action,
      meta,
    });
  } catch (err) {
    console.error("Activity log failed:", err.message);
  }
};
