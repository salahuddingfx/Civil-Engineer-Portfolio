const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const registry = require("../models/modelRegistry");
const Admin = require("../models/Admin");
const Stats = require("../models/Stats");

// Update this with the latest backup file name
const BACKUP_FILENAME = "backup_2026-04-10T11-58-54-642Z.json"; 

async function restore() {
  const backupPath = path.join(__dirname, "..", "..", "backups", BACKUP_FILENAME);
  
  if (!fs.existsSync(backupPath)) {
    console.error("Backup file not found at:", backupPath);
    process.exit(1);
  }

  const backupData = JSON.parse(fs.readFileSync(backupPath, "utf-8"));
  
  console.log("Starting Database Restore...");
  console.log("Target URI:", process.env.MONGO_URI);

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to Target Database.");

    const allModels = {
      ...registry,
      admin: Admin,
      stats: Stats
    };

    for (const [key, model] of Object.entries(allModels)) {
      const data = backupData[key];
      if (!data) {
        console.log(`Skipping ${key} (no data in backup).`);
        continue;
      }

      console.log(`Restoring ${key} (${data.length} records)...`);
      
      // Clear existing data in target
      await model.deleteMany({});
      
      if (data.length > 0) {
        // Insert data
        await model.insertMany(data);
        console.log(`- ✔ ${key} restored.`);
      } else {
        console.log(`- (No records to insert)`);
      }
    }

    console.log("\n✔ Restore successful! All data migrated to Mumbai Cluster.");
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Restore Failed:", error);
    process.exit(1);
  }
}

restore();
