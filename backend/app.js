const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const env = require("./config/env");
const authRoutes = require("./routes/auth.routes");
const contentRoutes = require("./routes/content.routes");
const contactRoutes = require("./routes/contact.routes");
const seoRoutes = require("./routes/seo.routes");
const uploadRoutes = require("./routes/upload.routes");
const statsRoutes = require("./routes/stats.routes");
const adminRoutes = require("./routes/admin.routes");
const { sitemap, robots } = require("./controllers/seo.controller");
const { connectDb, isDbReady } = require("./config/db");

// Database connection is managed by server initialization (local) 
// or by the auto-connect middleware below (serverless/Vercel)
const { notFound, errorHandler } = require("./middleware/error.middleware");

const { cacheMiddleware } = require("./middleware/cache.middleware");

const app = express();
app.set('etag', false); // Disable 304 responses as per user preference (prefers 200)

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow list including your custom domains and vercel subdomains
      const allowedPatterns = [
        /^https:\/\/engralamashik\.com$/,
        /^https:\/\/www\.engralamashik\.com$/,
        /^https:\/\/engralamashik\.vercel\.app$/,
        /^https:\/\/alamashik\.vercel\.app$/,
        /^http:\/\/localhost:\d+$/
      ];

      // Also allow any origins from the environment variable list
      const envOrigins = env.corsOrigin || [];
      
      const isAllowed = !origin || 
        allowedPatterns.some(pattern => pattern.test(origin)) ||
        envOrigins.some(eo => origin.startsWith(eo));

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(compression());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));

app.use(async (req, res, next) => {
  const isDbEndpoint = req.path.startsWith("/api/auth") || req.path.startsWith("/api/content") || req.path.startsWith("/api/stats") || req.path.startsWith("/api/contact") || req.path.startsWith("/api/upload") || req.path.startsWith("/api/seo") || req.path.startsWith("/api/admin") || req.path === "/sitemap.xml" || req.path === "/robots.txt";
  
  if (isDbEndpoint && req.path !== "/api/health") {
    try {
      // Instead of failing with 503, we WAIT for the connection to finish
      // This solves the cold-start race condition on Vercel
      await connectDb();
    } catch (err) {
      return res.status(503).json({
        message: "Database unavailable. Ensure MONGO_URI is correct and IP is whitelisted in Atlas.",
      });
    }
  }
  return next();
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "alam-ashik-portfolio-api", database: isDbReady() ? "connected" : "disconnected" });
});

app.use("/api/auth", authRoutes);
app.use("/api/content", cacheMiddleware(600), contentRoutes); // Cache for 10 mins
app.use("/api/contact", contactRoutes);
app.use("/api/seo", cacheMiddleware(3600), seoRoutes); // Cache SEO for 1 hour
app.use("/api/upload", uploadRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/admin", adminRoutes);
app.get("/sitemap.xml", sitemap);
app.get("/robots.txt", robots);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
