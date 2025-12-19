const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
  moveNoteToFolder,
  getNotesByFolder,
  shareNote,
  getNote,
  getNoteVersions,
  restoreVersion
} = require("../controllers/noteController");
router.post("/", protect, createNote);
router.get("/", protect, getNotes);
router.put("/:id", protect, updateNote);
router.delete("/:id", protect, deleteNote);
router.put("/:noteId/move", protect, moveNoteToFolder);
router.get("/folder/:folderId", protect, getNotesByFolder);
router.post("/:id/share", protect, shareNote);
router.get("/:id", protect, getNote);
router.get("/:id/versions", protect, getNoteVersions);
router.post("/:id/versions/:versionId/restore", protect, restoreVersion);

module.exports = router;
