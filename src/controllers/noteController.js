const User = require("../models/User");
const Note = require("../models/Note");
const Folder = require("../models/Folder");
const NoteVersion = require("../models/NoteVersion");
const { canReadNote } = require("../utils/permission");
const { canWriteNote } = require("../utils/permission");
const { logActivity } = require("../utils/activityLogger");
exports.createNote = async (req, res) => {
  try {
    let { title, content } = req.body;
    const newNote = await Note.create({ title, content, user: req.user._id });
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
    let notes = await Note.find({
      $or: [
        { user: req.user._id },
        { "collaborators.user": req.user._id },
      ],
    }).sort("-updatedAt");

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
    editedBy: req.user._id,
  })
    note.title = req.body.title ?? note.title;
    note.content = req.body.content ?? note.content;
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
      (c) => c.user.toString() === userToShare._id.toString()
    );

    if (alreadyShared) {
      return res.status(400).json({ message: "Already shared" });
    }

    note.collaborators.push({
      user: userToShare._id,
      permission: permission || "read",
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

    await note.save();

    res.json({ message: "Note shared successfully" });
  } catch (err) {
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

  // Save current as version before restoring
  await NoteVersion.create({
    note: note._id,
    title: note.title,
    content: note.content,
    editedBy: req.user._id,
  });

  note.title = version.title;
  note.content = version.content;
  await note.save();

  res.json({ message: "Version restored", note });
};
