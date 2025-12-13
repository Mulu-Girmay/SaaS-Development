const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { createFolder, getFolders, deleteFolder } = require("../controllers/folderControllers");
router.post("/", protect, createFolder);
router.get("/", protect, getFolders);
router.delete("/:id", protect, deleteFolder);

module.exports = router;