const express = require("express");
const rateLimit = require("express-rate-limit");
const contactController = require("../controllers/contact.controller");
const uploadController = require("../controllers/upload.controller");
const { requireAdmin } = require("../middleware/auth.middleware");

const router = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/submit", limiter, contactController.submitContact);

module.exports = router;
