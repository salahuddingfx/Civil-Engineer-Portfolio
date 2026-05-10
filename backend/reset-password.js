const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");

// Load env
dotenv.config({ path: path.join(__dirname, ".env") });

const Admin = require("./models/Admin");

async function reset() {
  const mongoUri = process.env.MONGO_URI;
  const email = process.env.ADMIN_EMAIL || "alamashik@gmail.com";
  const newPassword = process.env.ADMIN_PASSWORD || "Alam@786!";

  if (!mongoUri) {
    console.error("MONGO_URI not found in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB Atlas...");

    const passwordHash = await bcrypt.hash(newPassword, 12);
    
    const result = await Admin.findOneAndUpdate(
      { email: email.toLowerCase() },
      { passwordHash, refreshTokenHash: null },
      { new: true }
    );

    if (result) {
      console.log(`✔ Password successfully reset for ${email}`);
      console.log(`New Password: ${newPassword}`);
    } else {
      console.log(`✖ Admin user with email ${email} not found.`);
      console.log("Creating new admin user...");
      await Admin.create({ email: email.toLowerCase(), passwordHash });
      console.log(`✔ New Admin created with email: ${email}`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

reset();
