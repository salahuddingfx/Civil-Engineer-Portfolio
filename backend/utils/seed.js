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
  SeoMeta,
  Skill,
  TimelineEntry,
  TeamMember,
  GalleryItem
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
  },
  {
    slug: "engineering-consultancy",
    title: { en: "Engineering Consultancy", bn: "ইঞ্জিনিয়ারিং কনসালট্যান্সি" },
    summary: { en: "Expert advice on structural integrity and technical feasibility.", bn: "কাঠামোগত অখণ্ডতা এবং প্রযুক্তিগত সম্ভাব্যতা সম্পর্কে বিশেষজ্ঞের পরামর্শ।" },
    icon: "Shield",
    category: "Consultancy",
    order: 4
  },
  {
    slug: "soil-test-survey",
    title: { en: "Soil Test & Survey", bn: "মাটি পরীক্ষা ও জরিপ" },
    summary: { en: "Rigorous site analysis to determine foundation depth and load capacity.", bn: "ভিত্তির গভীরতা এবং লোড ক্ষমতা নির্ধারণের জন্য কঠোর সাইট বিশ্লেষণ।" },
    icon: "Navigation",
    category: "Engineering",
    order: 5
  },
  {
    slug: "estimating-costing",
    title: { en: "Estimating & Costing", bn: "অনুমান ও খরচ নির্ধারণ" },
    summary: { en: "Precise material take-offs and budgeting for infrastructure projects.", bn: "অবকাঠামো প্রকল্পের জন্য নির্ভুল উপাদান গ্রহণ এবং বাজেট নির্ধারণ।" },
    icon: "Calculator",
    category: "Management",
    order: 6
  },
  {
    slug: "site-supervision",
    title: { en: "Site Supervision", bn: "সাইট তদারকি" },
    summary: { en: "Ensuring design compliance and quality control during construction.", bn: "নির্মাণের সময় নকশা সম্মতি এবং গুণমান নিয়ন্ত্রণ নিশ্চিত করা।" },
    icon: "Eye",
    category: "Management",
    order: 7
  }
];

const testimonials = [
  {
    slug: "sarah-chen",
    title: { en: "Sarah Chen", bn: "সারাহ চেন" },
    summary: { en: "Director of Engineering @ NexaCore", bn: "ইঞ্জিনিয়ারিং ডিরেক্টর @ নেক্সাকোর" },
    body: { en: "Working with Ashik was a game-changer for our structural projects. His attention to detail in seismic analysis is unparalleled.", bn: "আশিকের সাথে কাজ করা আমাদের কাঠামোগত প্রকল্পের জন্য একটি গেম-চেঞ্জার ছিল। সিসমিক বিশ্লেষণে তার বিশদ মনোযোগ অতুলনীয়।" },
    isFeatured: true,
    rating: 5,
    featuredImage: { url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80" },
    order: 1
  },
  {
    slug: "david-rodriguez",
    title: { en: "David Rodriguez", bn: "ডেভিড রদ্রিগেজ" },
    summary: { en: "Principal Architect @ Studio-V", bn: "প্রিন্সিপাল আর্কিটেক্ট @ স্টুডিও-ভি" },
    body: { en: "The level of precision in the 3D BIM models provided by Alam's team saved us weeks of onsite coordination.", bn: "আলমের টিমের দেওয়া থ্রিডি বিআইএম মডেলের নির্ভুলতা আমাদের অনসাইট সমন্বয়ের সপ্তাহ বাঁচিয়েছে।" },
    isFeatured: true,
    rating: 5,
    featuredImage: { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80" },
    order: 2
  }
];

const skills = [
  { slug: "structural-analysis", title: { en: "Structural Analysis", bn: "কাঠামোগত বিশ্লেষণ" }, category: "technical", proficiency: 95, icon: "Layers", order: 1 },
  { slug: "bim-modeling", title: { en: "BIM & 3D Modeling", bn: "বিআইএম এবং ৩ডি মডেলিং" }, category: "software", proficiency: 90, icon: "Box", order: 2 },
  { slug: "seismic-design", title: { en: "Seismic Design", bn: "সিসমিক ডিজাইন" }, category: "technical", proficiency: 88, icon: "Activity", order: 3 },
  { slug: "project-management", title: { en: "Project Management", bn: "প্রকল্প ব্যবস্থাপনা" }, category: "soft-skills", proficiency: 85, icon: "Users", order: 4 },
];

const timeline = [
  { slug: "founded-studio", year: "2020", title: { en: "Studio Foundation", bn: "স্টুডিও প্রতিষ্ঠা" }, description: { en: "Established primary architectural consultancy node.", bn: "প্রাথমিক স্থাপত্য পরামর্শ কেন্দ্র প্রতিষ্ঠিত।" }, category: "Experience", order: 1 },
  { slug: "leed-certification", year: "2022", title: { en: "LEED Certification", bn: "লিড শংসাপত্র" }, description: { en: "Certified global sustainable design expert.", bn: "প্রত্যয়িত বৈশ্বিক টেকসই নকশা বিশেষজ্ঞ।" }, category: "Award", order: 2 },
];

const team = [
  { 
    slug: "alam-ashik", 
    name: "Engr. Alam Ashik", 
    designation: { en: "Principal Engineer", bn: "প্রধান প্রকৌশলী" }, 
    bio: { en: "Leading structural and architectural innovations.", bn: "কাঠামোগত এবং স্থাপত্য উদ্ভাবনের নেতৃত্ব দিচ্ছেন।" },
    order: 1,
    isPublished: true
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
  phone: "+880 1813135400",
  email: "alam.ashik@gmail.com",
  whatsapp: "+8801813135400",
  address: { en: "Cox's Bazar, Bangladesh", bn: "কক্সবাজার, বাংলাদেশ" },
  socialLinks: {
    facebook: "https://facebook.com",
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
    twitter: "https://twitter.com",
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
      SeoMeta.deleteMany({}),
      Skill.deleteMany({}),
      TimelineEntry.deleteMany({}),
      TeamMember.deleteMany({}),
      GalleryItem.deleteMany({})
    ]);

    // Insert new data
    console.log("Initializing Migration...");
    await Promise.all([
      Project.insertMany(projects),
      Service.insertMany(services),
      Testimonial.insertMany(testimonials),
      Skill.insertMany(skills),
      TimelineEntry.insertMany(timeline),
      TeamMember.insertMany(team),
      AboutContent.create(aboutContent),
      HomeContent.create(homeContent),
      ContactDetail.create(contactDetails)
    ]);

    console.log("COMPLETED: Database Infrastructure Synchronized.");
    process.exit(0);
  } catch (err) {
    console.error("MIGRATION_FAILED:", err);
    process.exit(1);
  }
}

seed();
