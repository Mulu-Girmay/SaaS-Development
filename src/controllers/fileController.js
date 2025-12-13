const File = require("../models/File");

// UPLOAD FILE
exports.uploadFile = async (req, res) => {
  try {
    const file = await File.create({
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      user: req.user._id,
      note: req.body.noteId || null,
    });

    res.status(201).json(file);
  } catch (error) {
    res.status(500).json({ message: "File upload failed" });
  }
};
exports.getFiles = async (req, res) => {
  try {
    const files = await File.find({ user: req.user._id }).sort("-createdAt");
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: "Error fetching files" });
  }
};
