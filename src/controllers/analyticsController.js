const AnalyticsEvent = require("../models/AnalyticsEvent");

exports.getSummary = async (req, res) => {
  try {
    const [totalEvents, recentEvents] = await Promise.all([
      AnalyticsEvent.countDocuments(),
      AnalyticsEvent.find().sort("-createdAt").limit(10),
    ]);
    res.json({ totalEvents, recentEvents });
  } catch (err) {
    res.status(500).json({ message: "Error fetching analytics" });
  }
};
