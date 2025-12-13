const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
  moveNoteToFolder,
  getNotesByFolder
} = require("../controllers/noteController");
router.post("/", protect, createNote);
router.get("/", protect, getNotes);
router.put("/:id", protect, updateNote);
router.delete("/:id", protect, deleteNote);
router.put("/:noteId/move", protect, moveNoteToFolder);
router.get("/folder/:folderId", protect, getNotesByFolder);

module.exports = router;
