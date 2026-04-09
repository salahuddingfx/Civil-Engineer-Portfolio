const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load env
dotenv.config({ path: path.join(__dirname, ".env") });

const { Project } = require("./models/contentModels");

async function seed() {
  try {
    console.log("Connecting to Neural Database...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connection Established.");

    const projects = [
      {
        slug: "bayline-villa",
        title: { en: "Bayline Luxury Villa", bn: "বেলাইন লাক্সারি ভিলা" },
        summary: { en: "A premium 5-story residential masterpiece in Cox's Bazar.", bn: "কক্সবাজারে একটি প্রিমিয়াম ৫-তলা আবাসিক মাস্টারপিস।" },
        category: "Residential",
        tags: ["2024", "Cox's Bazar", "Structural"],
        featuredImage: { url: "https://images.unsplash.com/photo-1600607686527-6fb886090705" },
        isPublished: true,
        order: 1
      },
      {
        slug: "vertex-tower",
        title: { en: "Vertex Corporate Tower", bn: "ভার্টেক্স কর্পোরেট টাওয়ার" },
        summary: { en: "Advanced commercial workspace with sustainable infrastructure.", bn: "টেকসই অবকাঠামো সহ উন্নত বাণিজ্যিক কর্মক্ষেত্র।" },
        category: "Commercial",
        tags: ["2023", "Dhaka", "BIM"],
        featuredImage: { url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab" },
        isPublished: true,
        order: 2
      },
      {
        slug: "marine-drive-resort",
        title: { en: "Marine Drive Resort", bn: "মেরিন ড্রাইভ রিসোর্ট" },
        summary: { en: "Coastal hospitality architecture designed for extreme weather.", bn: "চরম আবহাওয়ার জন্য ডিজাইন করা উপকূলীয় আতিথেয়তা স্থাপত্য।" },
        category: "Hospitality",
        tags: ["2024", "Cox's Bazar", "Coastal"],
        featuredImage: { url: "https://images.unsplash.com/photo-1582610116397-ed860c29415c" },
        isPublished: true,
        order: 3
      },
      {
        slug: "central-bridge",
        title: { en: "Central Urban Bridge", bn: "সেন্ট্রাল আরবান ব্রিজ" },
        summary: { en: "Heavy-duty infrastructure bridging urban connectivity.", bn: "শহুরে সংযোগকারী ভারী শুল্ক অবকাঠামো ব্রিজ।" },
        category: "Infrastructure",
        tags: ["2022", "Chittagong", "Bridge"],
        featuredImage: { url: "https://images.unsplash.com/photo-1513828583688-c52646db42da" },
        isPublished: true,
        order: 4
      }
    ];

    console.log("Purging existing project cache...");
    await Project.deleteMany({});
    
    console.log("Injecting categorize Project Assets...");
    await Project.insertMany(projects);

    console.log("Project Registry Synchronized Successfully.");
    process.exit(0);
  } catch (err) {
    console.error("DATA_INJECTION_FAILED:", err);
    process.exit(1);
  }
}

seed();
