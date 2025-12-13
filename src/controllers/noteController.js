const User = require("../models/User");
const Note = require("../models/Note");
const Folder = require("../models/Folder");

exports.createNote = async (req, res) => {
  try {
    let { title, content } = req.body;
    const newNote = await Note.create({ title, content, user: req.user._id });

    res.status(201).json(newNote);
  } catch (err) {
    return res.status(404).json({ message: "Error creating note" });
  }
};
exports.getNotes = async (req, res) => {
  try {
    let notes = await Note.find({ user: req.user._id }).sort("-updatedAt");
    res.json(notes);
  } catch (err) {
    return res.status(404).json({ message: "Error fetching notes" });
  }
};
exports.updateNote = async (req, res) => {
  try {
    let id = req.params.id;
    const note = await Note.findOne({ _id: id, user: req.user._id });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    note.title = req.body.title ?? note.title;
    note.content = req.body.content ?? note.content;
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
