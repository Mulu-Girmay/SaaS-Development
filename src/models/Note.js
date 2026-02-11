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
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    folder:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Folder",
      default:null
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },
    collaborators:[
      {user:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    permission:{
        type: String,
      enum: ["read", "write"],
      default: "read",
    }
  }
  ]
  },
  { timestamps: true }
);
NoteSchema.index({ title: "text", content: "text", tags: "text" });
module.exports = mongoose.model("Note", NoteSchema);
