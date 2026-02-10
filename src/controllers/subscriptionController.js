const Subscription = require("../models/Subscription");

exports.getMySubscription = async (req, res) => {
  try {
    let sub = await Subscription.findOne({ user: req.user._id });
    if (!sub) {
      sub = await Subscription.create({ user: req.user._id });
    }
    res.json(sub);
  } catch (err) {
    res.status(500).json({ message: "Error fetching subscription" });
  }
};

exports.updatePlan = async (req, res) => {
  try {
    const { plan } = req.body;
    if (!["free", "pro", "team"].includes(plan)) {
      return res.status(400).json({ message: "Invalid plan" });
    }
    let sub = await Subscription.findOne({ user: req.user._id });
    if (!sub) {
      sub = await Subscription.create({ user: req.user._id });
    }
    sub.plan = plan;
    sub.status = "active";
    await sub.save();
    res.json(sub);
  } catch (err) {
    res.status(500).json({ message: "Error updating subscription" });
  }
};
