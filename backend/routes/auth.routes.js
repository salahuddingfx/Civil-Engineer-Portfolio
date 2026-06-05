const express = require("express");
const rateLimit = require("express-rate-limit");
const { login, refresh, logout, updateMe, forgotPassword, resetPassword } = require("../controllers/auth.controller");
const { requireAdmin } = require("../middleware/auth.middleware");

const router = express.Router();

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many password reset requests. Please try again later." },
});

router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/reset-password", forgotPasswordLimiter, resetPassword);
router.patch("/me", requireAdmin, updateMe);

module.exports = router;
