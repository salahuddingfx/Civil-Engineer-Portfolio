const mongoose = require("mongoose");
const net = require("net");
const env = require("./env");

let dbReady = false;
let connectionPromise = null;

async function connectDb() {
  if (connectionPromise) return connectionPromise;

  const options = {
    maxPoolSize: 10,
    minPoolSize: 2,
    socketTimeoutMS: 45000,
    serverSelectionTimeoutMS: 30000, // Increased for Vercel stability
    heartbeatFrequencyMS: 10000,
    retryWrites: true,
    connectTimeoutMS: 30000,
  };

  connectionPromise = (async () => {
    try {
      await mongoose.connect(env.mongoUri, options);
      dbReady = true;
      console.log("✔ MongoDB Atlas Connected Successfully");
      return mongoose.connection;
    } catch (error) {
      console.error(`✖ MongoDB Connection Failed: ${error.message}`);
      dbReady = false;
      connectionPromise = null;
      throw error;
    }
  })();

  return connectionPromise;
}

function setDbReady(value) {
  dbReady = value;
}

function isDbReady() {
  return dbReady;
}

function inspectMongoTarget(mongoUri) {
  if (!mongoUri || typeof mongoUri !== "string") {
    return { isSrv: false, isLocal: false, host: null, port: null };
  }

  if (mongoUri.startsWith("mongodb+srv://")) {
    const hostPart = mongoUri.replace("mongodb+srv://", "").split("/")[0].split("@").pop();
    const host = hostPart?.split(",")[0] || null;
    return { isSrv: true, isLocal: false, host, port: 27017 };
  }

  const noProto = mongoUri.replace("mongodb://", "").split("?")[0];
  const firstHost = noProto.split("/")[0].split("@").pop().split(",")[0];
  const [rawHost, rawPort] = firstHost.split(":");
  const host = rawHost || null;
  const port = Number(rawPort || 27017);
  const isLocal = ["localhost", "127.0.0.1", "::1"].includes(host);

  return { isSrv: false, isLocal, host, port };
}

function probeTcp(host, port, timeoutMs = 1200) {
  return new Promise((resolve) => {
    if (!host || !port) {
      resolve(false);
      return;
    }

    const socket = new net.Socket();
    let settled = false;

    const finish = (value) => {
      if (settled) {
        return;
      }
      settled = true;
      socket.destroy();
      resolve(value);
    };

    socket.setTimeout(timeoutMs);
    socket.once("connect", () => finish(true));
    socket.once("error", () => finish(false));
    socket.once("timeout", () => finish(false));
    socket.connect(port, host);
  });
}

async function disconnectDb() {
  await mongoose.disconnect();
  dbReady = false;
}

module.exports = { connectDb, disconnectDb, setDbReady, isDbReady, inspectMongoTarget, probeTcp };
