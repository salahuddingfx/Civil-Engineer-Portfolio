const app = require("./app");
const env = require("./config/env");
const { connectDb, setDbReady, inspectMongoTarget, probeTcp } = require("./config/db");
const { clearCache } = require("./middleware/cache.middleware");

// Purge cache on startup
clearCache();

// Routes
app.use("/api/content", require("./routes/content.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/stats", require("./routes/stats.routes"));
app.use("/api/auth", require("./routes/auth.routes"));

const { ensureAdminSeed } = require("./controllers/auth.controller");

function printBanner({ dbState, mongoTarget, mongoReachable }) {
  const lines = [
    "",
    "==============================",
    " Alam Ashik Portfolio API",
    "==============================",
    `Environment : ${env.nodeEnv}`,
    `API URL     : http://localhost:${env.port}`,
    `Mongo Host  : ${mongoTarget.host || "unknown"}${mongoTarget.port ? `:${mongoTarget.port}` : ""}`,
    `Mongo URI   : ${mongoTarget.isSrv ? "mongodb+srv://<hidden>" : env.mongoUri}`,
    `Database    : ${dbState}`,
  ];

  if (mongoTarget.isLocal) {
    lines.push(`Mongo Reach : ${mongoReachable ? "reachable" : "unreachable"}`);
  }

  lines.push("==============================");
  console.log(lines.join("\n"));
}

async function start() {
  const mongoTarget = inspectMongoTarget(env.mongoUri);
  let dbState = "connected";
  let mongoReachable = true;

  try {
    await connectDb();
    await ensureAdminSeed();
  } catch (error) {
    setDbReady(false);
    dbState = "degraded (db unavailable)";
    if (mongoTarget.isLocal) {
      mongoReachable = await probeTcp(mongoTarget.host, mongoTarget.port);
    }
    console.warn("MongoDB connection unavailable. Starting API in degraded mode.");
    console.warn(error.message);
    if (mongoTarget.isLocal && !mongoReachable) {
      console.warn("Tip: Start local MongoDB service or set MONGO_URI to MongoDB Atlas.");
    }
  }

  const server = app.listen(env.port, () => {
    printBanner({ dbState, mongoTarget, mongoReachable });
  });

  // Graceful Shutdown
  const shutdown = async (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      console.log("HTTP server closed.");
      try {
        const { disconnectDb } = require("./config/db");
        await disconnectDb();
        console.log("Database disconnected.");
        process.exit(0);
      } catch (err) {
        console.error("Error during disconnection", err);
        process.exit(1);
      }
    });

    // Force shutdown after 10s
    setTimeout(() => {
      console.error("Could not close connections in time, forcefully shutting down");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

start().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
