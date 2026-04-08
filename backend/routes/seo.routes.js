const express = require("express");
const seoController = require("../controllers/seo.controller");
const { requireAdmin } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/sitemap.xml", seoController.sitemap);
router.get("/robots.txt", seoController.robots);

module.exports = router;
