const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const registry = require("../models/modelRegistry");
const Admin = require("../models/Admin");
const Stats = require("../models/Stats");

async function backup() {
  console.log("Starting Database Backup...");
  console.log("URI:", process.env.MONGO_URI);

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to Source Database.");

    const backupData = {};
    const allModels = {
      ...registry,
      admin: Admin,
      stats: Stats
    };

    for (const [key, model] of Object.entries(allModels)) {
      console.log(`Fetching ${key}...`);
      const data = await model.find({}).lean();
      backupData[key] = data;
      console.log(`- Found ${data.length} records.`);
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `backup_${timestamp}.json`;
    const backupPath = path.join(__dirname, "..", "..", "backups", filename);

    fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));
    console.log(`\n✔ Backup successful! Saved to: ${backupPath}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Backup Failed:", error);
    process.exit(1);
  }
}

backup();
