const Subscription = require("../models/Subscription");

const Team = require("../models/Team");

exports.getMySubscription = async (req, res) => {
  try {
    // If user is in a team, check if they "inherit" the plan
    if (req.user.team) {
      const team = await Team.findById(req.user.team);
      if (team && team.owner.toString() !== req.user._id.toString()) {
        // I am a member, fetch owner's sub
        const ownerSub = await Subscription.findOne({ user: team.owner });
        if (ownerSub) {
           return res.json({ ...ownerSub.toObject(), inherited: true });
        }
      }
    }

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
