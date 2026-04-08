const { verifyAccessToken } = require("../utils/tokens");

function requireAdmin(req, res, next) {
  const bearer = req.headers.authorization;
  const token = bearer?.startsWith("Bearer ") ? bearer.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Missing access token" });
  }

  try {
    const payload = verifyAccessToken(token);
    req.admin = payload;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired access token" });
  }
}

module.exports = { requireAdmin };
