const express = require("express");
const uploadController = require("../controllers/upload.controller");
const { requireAdmin } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/image", requireAdmin, uploadController.uploadImage);

module.exports = router;
