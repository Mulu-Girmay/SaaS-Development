const mongoose = require("mongoose");

const AnalyticsEventSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    event: { type: String, required: true },
    meta: { type: Object },
  },
  { timestamps: true }
);

AnalyticsEventSchema.index({ event: 1, createdAt: -1 });

module.exports = mongoose.model("AnalyticsEvent", AnalyticsEventSchema);
