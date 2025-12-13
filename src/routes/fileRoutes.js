const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { protect } = require("../middleware/auth");
const { uploadFile, getFiles } = require("../controllers/fileController");

router.post("/", protect, upload.single("file"), uploadFile);
router.get("/", protect, getFiles);

module.exports = router;
