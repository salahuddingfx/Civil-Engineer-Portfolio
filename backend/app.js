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

// Initialize Database Connection (Essential for Serverless/Vercel)
connectDb().catch(err => console.error("Database connection failed", err));
const { notFound, errorHandler } = require("./middleware/error.middleware");

const { cacheMiddleware } = require("./middleware/cache.middleware");

const app = express();
app.set('etag', false); // Force 200 OK instead of 304 Not Modified

app.use(helmet());
app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  })
);
app.use(compression());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json({ limit: "4mb" }));

app.use((req, res, next) => {
  const isDbEndpoint = req.path.startsWith("/api/auth") || req.path.startsWith("/api/content") || req.path.startsWith("/api/stats") || req.path.startsWith("/api/contact") || req.path.startsWith("/api/upload") || req.path.startsWith("/api/seo") || req.path.startsWith("/api/admin") || req.path === "/sitemap.xml" || req.path === "/robots.txt";
  if (!isDbReady() && isDbEndpoint && req.path !== "/api/health") {
    return res.status(503).json({
      message: "Database unavailable. Start MongoDB or update MONGO_URI to a reachable instance.",
    });
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
