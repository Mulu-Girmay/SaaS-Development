const User = require("../models/User");
const Note = require("../models/Note");
const Folder = require("../models/Folder");
const NoteVersion = require("../models/NoteVersion");
const ShareInvite = require("../models/ShareInvite");
const { createNotification } = require("../utils/notify");
const { sendMail } = require("../utils/mailer");
const { canReadNote } = require("../utils/permission");
const { canWriteNote } = require("../utils/permission");
const { logActivity } = require("../utils/activityLogger");
exports.createNote = async (req, res) => {
  try {
    let { title, content, tags, isTeamNote } = req.body;
    
    let noteData = {
      title,
      content,
      tags: Array.isArray(tags) ? tags : [],
      user: req.user._id,
    };

    if (isTeamNote && req.user.team) {
      noteData.team = req.user.team;
    }

    const newNote = await Note.create(noteData);
    await logActivity({
      action: "NOTE_CREATED",
      user: req.user._id,
      note: newNote._id,
    });
    res.status(201).json(newNote);
  } catch (err) {
    return res.status(404).json({ message: "Error creating note" });
  }
};
exports.getNotes = async (req, res) => {
  try {
    const { q, tag, type } = req.query;
    
    let query = {};

    if (type === "team") {
      if (!req.user.team) {
        return res.json([]); // User has no team
      }
      // Fetch notes belonging to the team
      query.team = req.user.team;
    } else {
      // Personal notes + Shared with me (collaborators)
      // AND ensure it's NOT a team note (unless I created it? stick to separation for now)
      query = {
         $or: [{ user: req.user._id }, { "collaborators.user": req.user._id }],
         team: null // Exclude team notes from personal view for clarity
      };
    }

    if (tag) query.tags = tag;
    if (q) query.$text = { $search: q };

    let notes = await Note.find(query).sort("-updatedAt").populate("user", "name"); // Populate creator for team notes

    res.json(notes);
  } catch (err) {
    return res.status(404).json({ message: "Error fetching notes" });
  }
};
exports.updateNote = async (req, res) => {
  try {
    let id = req.params.id;
    const note = await Note.findById(id);
    if (!note || !canWriteNote(note, req.user._id)) {
      return res.status(403).json({ message: "Write access denied" });
    }
    await NoteVersion.create({
      note: note._id,
      title: note.title,
      content: note.content,
      tags: note.tags,
      editedBy: req.user._id,
    });
    note.title = req.body.title ?? note.title;
    note.content = req.body.content ?? note.content;
    if (Array.isArray(req.body.tags)) {
      note.tags = req.body.tags;
    }
    await logActivity({
      action: "NOTE_UPDATED",
      user: req.user._id,
      note: note._id,
    });

    await note.save();
    res.json(note);
  } catch (err) {
    return res.status(404).json({ message: "Error fetching notes" });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting note" });
  }
};
exports.moveNoteToFolder = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.noteId,
      user: req.user._id,
    });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    note.folder = req.body.folderId || null;
    await note.save();
    res.json({ message: "Note moved", note });
  } catch (error) {
    res.status(500).json({ message: "Error moving note" });
  }
};
exports.getNotesByFolder = async (req, res) => {
  try {
    const notes = await Note.find({
      user: req.user._id,
      folder: req.params.folderId,
    });

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notes" });
  }
};

exports.shareNote = async (req, res) => {
  const { email, permission } = req.body;

  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    const userToShare = await User.findOne({ email });

    if (!userToShare) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadyShared = note.collaborators.find(
      (c) => c.user.toString() === userToShare._id.toString(),
    );

    if (alreadyShared) {
      // Update permission if already shared
      alreadyShared.permission = permission || "read";
      await note.save();
      return res.json({ message: "Permissions updated" });
    }

    // Direct Share - Add to collaborators immediately
    note.collaborators.push({
      user: userToShare._id,
      permission: permission || "read",
    });

    await note.save();

    await createNotification({
      user: userToShare._id,
      type: "invite", // Keep type or change to 'share'
      message: `${req.user.name || "Someone"} shared "${note.title}" with you.`,
      meta: { noteId: note._id },
    });
    
    await sendMail({
      to: userToShare.email,
      subject: "New Note Shared With You",
      text: `${req.user.name || "Someone"} shared "${note.title}" with you.`,
    });

    await logActivity({
      action: "NOTE_SHARED",
      user: req.user._id,
      note: note._id,
      meta: {
        sharedWith: userToShare.email,
        permission,
      },
    });

    res.json({ message: "Note shared successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sharing note" });
  }
};
exports.getNote = async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note || !canReadNote(note, req.user._id)) {
    return res.status(403).json({ message: "Access denied" });
  }

  res.json(note);
};
exports.getNoteVersions = async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note || !canReadNote(note, req.user._id)) {
    return res.status(403).json({ message: "Access denied" });
  }

  const versions = await NoteVersion.find({ note: note._id })
    .sort("-createdAt")
    .populate("editedBy", "name email");

  res.json(versions);
};
exports.restoreVersion = async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note || note.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Only owner can restore" });
  }

  const version = await NoteVersion.findById(req.params.versionId);

  if (!version) {
    return res.status(404).json({ message: "Version not found" });
  }

  await NoteVersion.create({
    note: note._id,
    title: note.title,
    content: note.content,
    tags: note.tags,
    editedBy: req.user._id,
  });

  note.title = version.title;
  note.content = version.content;
  if (Array.isArray(version.tags)) {
    note.tags = version.tags;
  }
  await note.save();

  res.json({ message: "Version restored", note });
};
