const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const env = require("./config/env");
const authRoutes = require("./routes/authRoutes");
const contentRoutes = require("./routes/contentRoutes");
const contactRoutes = require("./routes/contactRoutes");
const seoRoutes = require("./routes/seoRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const { sitemap, robots } = require("./controllers/seoController");
const { isDbReady } = require("./config/db");
const { notFound, errorHandler } = require("./middleware/error");

const { cacheMiddleware } = require("./middleware/cache");

const app = express();

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
  const isDbEndpoint = req.path.startsWith("/api/auth") || req.path.startsWith("/api/content") || req.path.startsWith("/api/contact") || req.path.startsWith("/api/upload") || req.path.startsWith("/api/seo") || req.path === "/sitemap.xml" || req.path === "/robots.txt";
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
app.get("/sitemap.xml", sitemap);
app.get("/robots.txt", robots);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
