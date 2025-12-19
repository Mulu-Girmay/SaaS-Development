const mongoose = require("mongoose");

const ActivityLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true, 
     
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    note: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
    },
    meta: {
      type: Object,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ActivityLog", ActivityLogSchema);
