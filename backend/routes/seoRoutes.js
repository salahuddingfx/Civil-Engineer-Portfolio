const express = require("express");
const { sitemap, robots } = require("../controllers/seoController");

const router = express.Router();

router.get("/sitemap.xml", sitemap);
router.get("/robots.txt", robots);

module.exports = router;
