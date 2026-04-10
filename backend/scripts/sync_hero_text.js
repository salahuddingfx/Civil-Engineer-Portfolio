const mongoose = require("mongoose");
const { HomeContent } = require("../models/contentModels");
const dotenv = require("dotenv");
const path = require("path");

// Load backend env
dotenv.config({ path: path.join(__dirname, "../.env") });

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://alamashik:Alam2026@alamashik.e0xtuoh.mongodb.net/?appName=AlamAshik";

async function syncHeroText() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected.");

    const enTitle = "Hi, I'm Alam Ashik | I Engineer Structural Foundations";
    const enSummary = "A passionate Civil Engineer & Structural Consultant with over 11 years of experience in technical consultancy. I specialize in blending architectural brilliance with unyielding structural integrity, crafting precise landmarks and professional infrastructure solutions across Cox's Bazar and beyond.";

    const bnTitle = "হাই, আমি আলম আশিক | আমি কাঠামোগত ভিত্তি প্রকৌশল করি";
    const bnSummary = "স্থাপত্য সৌন্দর্যের সাথে অনমনীয় কাঠামোগত অখণ্ডতার সংমিশ্রণে বিশেষজ্ঞ, কক্সবাজার ও এর বাইরে নির্ভুল ল্যান্ডমার্ক এবং পেশাদার অবকাঠামো সমাধান তৈরির ১১ বছরেরও বেশি অভিজ্ঞতা সম্পন্ন একজন নিবেদিতপ্রাণ সিভিল ইঞ্জিনিয়ার এবং স্ট্রাকচারাল কনসালট্যান্ট।";

    // Update or Create the 'home' slug entry
    const result = await HomeContent.findOneAndUpdate(
      { slug: "home" },
      {
        title: { en: enTitle, bn: bnTitle },
        summary: { en: enSummary, bn: bnSummary },
        isPublished: true
      },
      { upsert: true, new: true }
    );

    console.log("Sync Complete:", result.slug);
    process.exit(0);
  } catch (err) {
    console.error("Sync Failed:", err);
    process.exit(1);
  }
}

syncHeroText();
