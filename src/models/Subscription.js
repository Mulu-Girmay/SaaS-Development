const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    plan: { type: String, enum: ["free", "pro", "team"], default: "free" },
    status: {
      type: String,
      enum: ["active", "past_due", "canceled"],
      default: "active",
    },
    provider: { type: String, default: "stub" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscription", SubscriptionSchema);
