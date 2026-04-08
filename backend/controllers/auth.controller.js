const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const env = require("../config/env");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../utils/tokens");

async function ensureAdminSeed() {
  const existing = await Admin.findOne({ email: env.adminEmail.toLowerCase() });
  if (existing) {
    return;
  }

  const passwordHash = await bcrypt.hash(env.adminPassword, 12);
  await Admin.create({ email: env.adminEmail.toLowerCase(), passwordHash });
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email: String(email).toLowerCase() });

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = { sub: String(admin._id), email: admin.email, role: "admin" };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    admin.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await admin.save();

    return res.json({ accessToken, refreshToken });
  } catch (error) {
    return next(error);
  }
}

async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    const payload = verifyRefreshToken(refreshToken);
    const admin = await Admin.findById(payload.sub);

    if (!admin || !admin.refreshTokenHash) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const ok = await bcrypt.compare(refreshToken, admin.refreshTokenHash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const nextPayload = { sub: String(admin._id), email: admin.email, role: "admin" };
    const accessToken = signAccessToken(nextPayload);
    const nextRefreshToken = signRefreshToken(nextPayload);

    admin.refreshTokenHash = await bcrypt.hash(nextRefreshToken, 10);
    await admin.save();

    return res.json({ accessToken, refreshToken: nextRefreshToken });
  } catch (error) {
    return next(error);
  }
}

async function logout(req, res, next) {
  try {
    const { adminId } = req.body;
    if (adminId) {
      await Admin.findByIdAndUpdate(adminId, { refreshTokenHash: null });
    }
    return res.json({ message: "Logged out" });
  } catch (error) {
    return next(error);
  }
}

async function updateMe(req, res, next) {
  try {
    const { currentPassword, newEmail, newPassword } = req.body;
    if (!currentPassword) {
      return res.status(400).json({ message: "Current password is required" });
    }

    const admin = await Admin.findById(req.admin.sub);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const currentOk = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!currentOk) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    if (newEmail) {
      const normalizedEmail = String(newEmail).toLowerCase().trim();
      const emailExists = await Admin.findOne({
        email: normalizedEmail,
        _id: { $ne: admin._id },
      });
      if (emailExists) {
        return res.status(409).json({ message: "Email already in use" });
      }
      admin.email = normalizedEmail;
    }

    if (newPassword) {
      if (String(newPassword).length < 8) {
        return res.status(400).json({ message: "New password must be at least 8 characters" });
      }
      admin.passwordHash = await bcrypt.hash(newPassword, 12);
      admin.refreshTokenHash = null;
    }

    await admin.save();
    return res.json({ message: "Admin profile updated", email: admin.email });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  ensureAdminSeed,
  login,
  refresh,
  logout,
  updateMe,
};
