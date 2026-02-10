const ShareInvite = require("../models/ShareInvite");
const Note = require("../models/Note");
const { createNotification } = require("../utils/notify");

exports.listInvites = async (req, res) => {
  try {
    const invites = await ShareInvite.find({
      toUser: req.user._id,
      status: "pending",
    })
      .populate("note", "title")
      .populate("fromUser", "name email")
      .sort("-createdAt");
    res.json(invites);
  } catch (err) {
    res.status(500).json({ message: "Error fetching invites" });
  }
};

exports.acceptInvite = async (req, res) => {
  try {
    const invite = await ShareInvite.findOne({
      _id: req.params.id,
      toUser: req.user._id,
      status: "pending",
    });
    if (!invite) {
      return res.status(404).json({ message: "Invite not found" });
    }

    const note = await Note.findById(invite.note);
    if (!note) {
      invite.status = "declined";
      await invite.save();
      return res.status(404).json({ message: "Note no longer exists" });
    }

    const alreadyShared = note.collaborators.find(
      (c) => c.user.toString() === req.user._id.toString()
    );
    if (!alreadyShared) {
      note.collaborators.push({
        user: req.user._id,
        permission: invite.permission,
      });
      await note.save();
    }

    invite.status = "accepted";
    await invite.save();
    await createNotification({
      user: invite.fromUser,
      type: "invite_accepted",
      message: `${req.user.name || "A user"} accepted your invite`,
      meta: { noteId: invite.note },
    });

    res.json({ message: "Invite accepted" });
  } catch (err) {
    res.status(500).json({ message: "Error accepting invite" });
  }
};

exports.declineInvite = async (req, res) => {
  try {
    const invite = await ShareInvite.findOne({
      _id: req.params.id,
      toUser: req.user._id,
      status: "pending",
    });
    if (!invite) {
      return res.status(404).json({ message: "Invite not found" });
    }

    invite.status = "declined";
    await invite.save();
    await createNotification({
      user: invite.fromUser,
      type: "invite_declined",
      message: `${req.user.name || "A user"} declined your invite`,
      meta: { noteId: invite.note },
    });

    res.json({ message: "Invite declined" });
  } catch (err) {
    res.status(500).json({ message: "Error declining invite" });
  }
};
