const mongoose = require("mongoose");

const NoteVersionSchema = new mongoose.Schema(
  {
    note: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
      required: true,
    },
    title: String,
    content: String,
    tags: [String],
    editedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("NoteVersion", NoteVersionSchema);
