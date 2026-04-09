const express = require("express");
const { translate } = require("../services/translation.service");
const { requireAdmin } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/translate", requireAdmin, async (req, res) => {
  const { text, targetLang } = req.body;
  try {
    const translatedText = await translate(text, targetLang);
    res.json({ translatedText });
  } catch (err) {
    res.status(500).json({ error: "Translation failed" });
  }
});

module.exports = router;
