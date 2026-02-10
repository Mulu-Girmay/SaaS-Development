const Folder = require("../models/Folder");
const User = require("../models/User");
const Note = require("../models/Note");
const { logActivity } = require("../utils/activityLogger");
exports.createFolder = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Folder name is required" });
    }
    const folder = await Folder.create({ name, user: req.user._id });
    await logActivity({
  action: "FOLDER_CREATED",
  user: req.user._id,
  meta: { folderName: folder.name },
});

    return res.status(201).json(folder);
  } catch (err) {
    return res.status(500).json({ message: "Folder not created" });
  }
};
exports.getFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ user: req.user._id }).sort("name");
    return res.status(200).json(folders);
  } catch (err) {
    return res.status(500).json({ message: "Folder not Found" });
  }
};
exports.deleteFolder = async (req, res) => {
  try {
    const folder = await Folder.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }
    await Note.updateMany({ folder: folder._id }, { $set: { folder: null } });
    res.json({ message: "Folder deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Error deleting folder" });
  }
};
