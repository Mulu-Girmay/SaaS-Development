const Team = require("../models/Team");
const User = require("../models/User");

exports.createTeam = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Team name is required" });
    }
    const team = await Team.create({
      name,
      owner: req.user._id,
      members: [{ user: req.user._id, role: "owner" }],
    });
    await User.findByIdAndUpdate(req.user._id, { team: team._id });
    res.status(201).json(team);
  } catch (err) {
    res.status(500).json({ message: "Error creating team" });
  }
};

exports.getMyTeam = async (req, res) => {
  try {
    const team = await Team.findOne({
      "members.user": req.user._id,
    }).populate("members.user", "name email");
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: "Error fetching team" });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { email } = req.body;
    const team = await Team.findOne({ owner: req.user._id });
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const exists = team.members.find(
      (m) => m.user.toString() === user._id.toString()
    );
    if (exists) {
      return res.status(400).json({ message: "User already on team" });
    }

    team.members.push({ user: user._id, role: "member" });
    await team.save();
    await User.findByIdAndUpdate(user._id, { team: team._id });

    res.json({ message: "Member added", team });
  } catch (err) {
    res.status(500).json({ message: "Error adding member" });
  }
};
