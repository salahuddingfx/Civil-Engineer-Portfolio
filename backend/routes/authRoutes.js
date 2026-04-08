const express = require("express");
const { login, refresh, logout, updateMe } = require("../controllers/authController");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.patch("/me", requireAdmin, updateMe);

module.exports = router;
