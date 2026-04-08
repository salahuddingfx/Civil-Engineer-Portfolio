const express = require("express");
const { requireAdmin } = require("../middleware/auth");
const { uploadImage } = require("../controllers/uploadController");

const router = express.Router();

router.post("/image", requireAdmin, uploadImage);

module.exports = router;
