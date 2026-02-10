const Notification = require("../models/Notification");

exports.createNotification = async ({ user, type, message, meta = {} }) => {
  try {
    await Notification.create({ user, type, message, meta });
  } catch (err) {
    console.error("Notification create failed:", err.message);
  }
};
