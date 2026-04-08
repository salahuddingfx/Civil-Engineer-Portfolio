const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const { 
  Project, 
  Service, 
  Testimonial, 
  AboutContent, 
  HomeContent, 
  ContactDetail,
  SeoMeta 
} = require("../models/contentModels");

dotenv.config({ path: path.join(__dirname, "../.env") });

const MONGO_URI = process.env.MONGO_URI;

const projects = [
  {
    slug: "bayline-villa",
    title: { en: "Bayline Villa", bn: "বেলাইন ভিলা" },
    summary: { en: "A premium residential project in Cox's Bazar.", bn: "কক্সবাজারের একটি প্রিমিয়াম আবাসিক প্রকল্প।" },
    body: { en: "Luxury waterfront residence with structural resilience against coastal soil erosion.", bn: "উপকূলীয় মাটির ক্ষয় রোধে কাঠামোগত স্থিতিস্থাপকতা সহ বিলাসবহুল ওয়াটারফ্রন্ট বাসস্থান।" },
    category: "Residential",
    tags: ["2024", "Coastal", "Luxury"],
    featuredImage: { url: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=1000&q=80", alt: { en: "Bayline Villa", bn: "বেলাইন ভিলা" } },
    order: 1
  },
  {
    slug: "vertex-corporate-tower",
    title: { en: "Vertex Corporate Tower", bn: "ভার্টেক্স কর্পোরেট টাওয়ার" },
    summary: { en: "High-rise commercial tower in the heart of Dhaka.", bn: "ঢাকার প্রাণকেন্দ্রে উচ্চ-তলার বাণিজ্যিক টাওয়ার।" },
    body: { en: "Modern architectural steel structure with optimized workspace efficiency.", bn: "অপ্টিমাইজড ওয়ার্কস্পেস কার্যক্ষমতা সহ আধুনিক স্থাপত্য ইস্পাত কাঠামো।" },
    category: "Commercial",
    tags: ["2023", "High-rise", "Corporate"],
    featuredImage: { url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80", alt: { en: "Vertex Corporate Tower", bn: "ভার্টেক্স কর্পোরেট টাওয়ার" } },
    order: 2
  },
  {
    slug: "marine-drive-resort",
    title: { en: "Marine Drive Resort", bn: "মেরিন ড্রাইভ রিসোর্ট" },
    summary: { en: "Luxury hospitality project on the world's longest beach.", bn: "বিশ্বের দীর্ঘতম সমুদ্র সৈকতে বিলাসবহুল হসপিটালিটি প্রকল্প।" },
    body: { en: "Eco-friendly design language combined with seismic-resistant structural foundations.", bn: "সিসমিক-প্রতিরোধী কাঠামোগত ভিত্তির সাথে পরিবেশ বান্ধব নকশা।" },
    category: "Hospitality",
    tags: ["2024", "Tourism", "Resort"],
    featuredImage: { url: "https://images.unsplash.com/photo-1582610116397-ed860c29415c?auto=format&fit=crop&w=1000&q=80", alt: { en: "Marine Drive Resort", bn: "মেরিন ড্রাইভ রিসোর্ট" } },
    order: 3
  }
];

const services = [
  {
    slug: "architectural-design",
    title: { en: "Architectural Design", bn: "স্থাপত্য নকশা" },
    summary: { en: "Conceptual development and spatial planning for modern living.", bn: "আধুনিক বসবাসের জন্য ধারণাগত উন্নয়ন ও স্থানিক পরিকল্পনা।" },
    icon: "Home",
    category: "Design",
    order: 1
  },
  {
    slug: "structural-drawing",
    title: { en: "Structural Drawing", bn: "কাঠামোগত অঙ্কন" },
    summary: { en: "Precise detailing ensuring compliance and structural safety.", bn: "সম্মতি ও কাঠামোগত নিরাপত্তা নিশ্চিতকরণে নির্ভুল বিবরণ।" },
    icon: "Layers",
    category: "Engineering",
    order: 2
  },
  {
    slug: "cad-3d-plans",
    title: { en: "3D CAD Plans", bn: "থ্রিডি ক্যাড পরিকল্পনা" },
    summary: { en: "High-fidelity 2D/3D modeling for seamless architectural visualization.", bn: "নিরবচ্ছিন্ন স্থাপত্য ভিজ্যুয়ালাইজেশনের জন্য উচ্চ-মানের ২ডি/থ্রিডি মডেলিং।" },
    icon: "Activity",
    category: "Software",
    order: 3
  }
];

const testimonials = [
  {
    slug: "sarah-chen",
    title: { en: "Sarah Chen", bn: "সারাহ চেন" },
    summary: { en: "Director of Engineering @ NexaCore", bn: "ইঞ্জিনিয়ারিং ডিরেক্টর @ নেক্সাকোর" },
    body: { en: "The integration of structural integrity with modern architectural design was seamless.", bn: "আধুনিক স্থাপত্য নকশার সাথে কাঠামোগত অখণ্ডতার সংহতকরণটি ছিল নিরবচ্ছিন্ন।" },
    rating: 5,
    featuredImage: { url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80" }
  }
];

const homeContent = {
  slug: "home",
  title: { en: "I Build Structural Foundations", bn: "আমি কাঠামোগত ভিত্তি তৈরি করি" },
  summary: { en: "Hi, I'm Engr. Alam Ashik. Professional Civil Engineer & Architectural Designer in Cox's Bazar.", bn: "হাই, আমি ইঞ্জিনিয়ার আলম আশিক। কক্সবাজারের একজন পেশাদার সিভিল ইঞ্জিনিয়ার এবং আর্কিটেকচারাল ডিজাইনার।" },
  body: { en: "Crafting technical legacies with precision, safety, and modern architectural vision.", bn: "নির্ভুলতা, নিরাপত্তা এবং আধুনিক স্থাপত্য দৃষ্টিভঙ্গির সাথে প্রযুক্তিগত উত্তরাধিকার তৈরি করছি।" }
};

const aboutContent = {
  slug: "about",
  title: { en: "Engr. Alam Ashik", bn: "ইঞ্জিনিয়ার আলম আশিক" },
  summary: { en: "Founder & Chief Structural Consultant", bn: "প্রতিষ্ঠাতা ও প্রধান কাঠামোগত পরামর্শদাতা" },
  body: { en: "With over a decade of experience, we pioneer sustainable building techniques and precision structural solutions in Cox's Bazar.", bn: "এক দশকেরও বেশি অভিজ্ঞতার সাথে, আমরা কক্সবাজারে টেকসই নির্মাণ কৌশল ও নির্ভুল কাঠামোগত সমাধানের প্রবর্তক।" }
};

const contactDetails = {
  slug: "primary",
  phone: "+880 18XXXXXXX",
  email: "alam.ashik@gmail.com",
  whatsapp: "+88018XXXXXXX",
  address: { en: "Cox's Bazar, Bangladesh", bn: "কক্সবাজার, বাংলাদেশ" },
  socialLinks: {
    facebook: "https://facebook.com",
    linkedin: "https://linkedin.com",
    youtube: "https://youtube.com"
  }
};

async function seed() {
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(MONGO_URI);
    console.log("Database Connected Successfully.");

    // Clear existing data
    console.log("Clearing Existing Records...");
    await Promise.all([
      Project.deleteMany({}),
      Service.deleteMany({}),
      Testimonial.deleteMany({}),
      AboutContent.deleteMany({}),
      HomeContent.deleteMany({}),
      ContactDetail.deleteMany({}),
      SeoMeta.deleteMany({})
    ]);

    // Insert new data
    console.log("Initializing Migration...");
    await Promise.all([
      Project.insertMany(projects),
      Service.insertMany(services),
      Testimonial.insertMany(testimonials),
      AboutContent.create(aboutContent),
      HomeContent.create(homeContent),
      ContactDetail.create(contactDetails)
    ]);

    console.log("COMPLETED: 12 Structural Assets Synchronized.");
    process.exit(0);
  } catch (err) {
    console.error("MIGRATION_FAILED:", err);
    process.exit(1);
  }
}

seed();
