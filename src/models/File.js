const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema(
  {
    originalName: String,
    fileName: String,
    filePath: String,
    fileType: String,
    fileSize: Number,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    note: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", FileSchema);

