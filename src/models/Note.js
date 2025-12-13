const mongoose = require("mongoose");
const NoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      default: "",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    folder:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Folder",
      default:null
    }
  },
  { timestamps: true }
);
module.exports = mongoose.model("Note", NoteSchema);
