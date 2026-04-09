const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load env
dotenv.config({ path: path.join(__dirname, ".env") });

const { AboutContent, Skill, TimelineEntry, TeamMember } = require("./models/contentModels");

async function seed() {
  try {
    console.log("Connecting to Neural Database...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connection Established.");

    // 1. Seed About Bio
    console.log("Seeding Identity Bio...");
    await AboutContent.deleteMany({});
    await AboutContent.create({
      slug: "about",
      title: { en: "CRAFTING THE FUTURE", bn: "ভবিষ্যতের নকশা" },
      summary: { 
        en: "Principal Structural Consultant with a legacy of engineering precision and architectural integrity.",
        bn: "প্রধান কাঠামোগত পরামর্শদাতা, যার রয়েছে ইঞ্জিনিয়ারিংগত নির্ভুলতা এবং স্থাপত্য অখণ্ডতার ঐতিহ্য।"
      },
      body: { 
        en: "With over 11 years of dedicated experience in the structural landscape of Cox's Bazar and beyond, Engr. Alam Ashik has established a reputation for uncompromising safety and aesthetic elegance. Our studio focuses on high-performance structural analysis and modern architectural blueprinting.",
        bn: "কক্সবাজার এবং এর বাইরে কাঠামোগত প্রকৌশল ক্ষেত্রে ১১ বছরেরও বেশি নিবেদিত অভিজ্ঞতার সাথে, ইঞ্জিনিয়ার আলম আশিক আপোষহীন নিরাপত্তা এবং নান্দনিক আভিজাত্যের জন্য একটি খ্যাতি প্রতিষ্ঠা করেছেন। আমাদের স্টুডিও উচ্চ-মানের কাঠামোগত বিশ্লেষণ এবং আধুনিক স্থাপত্য নীল নকশার উপর আলোকপাত করে।"
      },
      featuredImage: { url: "https://images.unsplash.com/photo-1503387762-592dea58ef21" },
      isPublished: true
    });

    // 2. Seed Skills
    console.log("Seeding Technical Nodes (Skills)...");
    await Skill.deleteMany({});
    const skills = [
      { slug: "autocad", title: { en: "AutoCAD", bn: "অটোক্যাড" }, proficiency: 95, icon: "Code", order: 1, category: "technical" },
      { slug: "etabs", title: { en: "ETABS", bn: "ইট্যাবস" }, proficiency: 92, icon: "Zap", order: 2, category: "technical" },
      { slug: "sap2000", title: { en: "SAP2000", bn: "স্যাপ২০০০" }, proficiency: 88, icon: "Cpu", order: 3, category: "technical" },
      { slug: "safe", title: { en: "SAFE", bn: "সেফ" }, proficiency: 85, icon: "Shield", order: 4, category: "technical" },
      { slug: "revit", title: { en: "Revit BIM", bn: "রেভিট" }, proficiency: 80, icon: "Layers", order: 5, category: "technical" },
      { slug: "sketchup", title: { en: "SketchUp", bn: "স্কেচআপ" }, proficiency: 82, icon: "PenTool", order: 6, category: "software" },
    ];
    await Skill.insertMany(skills);

    // 3. Seed Timeline
    console.log("Seeding Career Timeline...");
    await TimelineEntry.deleteMany({});
    const timeline = [
      { 
        slug: "identity-est", 
        year: "2013", 
        title: { en: "Identity Established", bn: "প্রতিষ্ঠা" }, 
        description: { 
          en: "Initiated professional structural consultancy operations in Cox's Bazar.",
          bn: "কক্সবাজারে পেশাদার কাঠামোগত পরামর্শ সেবা চালু করা হয়।"
        },
        category: "Experience",
        order: 1
      },
      { 
        slug: "cuet-degree", 
        year: "2015", 
        title: { en: "Engineering Excellence", bn: "ইঞ্জিনিয়ারিং এক্সিলেন্স" }, 
        description: { 
          en: "Achieved specialized structural engineering certifications and degree from CUET.",
          bn: "চুয়েট থেকে বিশেষায়িত কাঠামোগত ইঞ্জিনিয়ারিং সার্টিফিকেট এবং ডিগ্রি অর্জন।"
        },
        category: "Education",
        order: 2
      },
      { 
        slug: "senior-role", 
        year: "2019", 
        title: { en: "Structural Specialist", bn: "কাঠামোগত বিশেষজ্ঞ" }, 
        description: { 
          en: "Appointed as lead consultant for major hospitality infrastructure projects.",
          bn: "প্রধান আতিথেয়তা অবকাঠামো প্রকল্পের জন্য প্রধান পরামর্শদাতা হিসেবে নিযুক্ত।"
        },
        category: "Experience",
        order: 3
      },
      { 
        slug: "principal-engr", 
        year: "2024", 
        title: { en: "Principal Consultant", bn: "প্রধান পরামর্শদাতা" }, 
        description: { 
          en: "Heading a full-scale architectural and structural studio with 150+ assets deployed.",
          bn: "১৫০টিরও বেশি সম্পন্ন প্রকল্পের সাথে একটি পূর্ণ-স্কেল স্থাপত্য এবং কাঠামোগত স্টুডিও পরিচালনা করা হচ্ছে।"
        },
        category: "Experience",
        order: 4
      },
    ];
    await TimelineEntry.insertMany(timeline);

    // 4. Seed Team
    console.log("Seeding Personnel Registry...");
    await TeamMember.deleteMany({});
    const team = [
      {
        slug: "alam-ashik",
        name: "Engr. Alam Ashik",
        designation: { en: "Principal Structural Engineer", bn: "প্রধান কাঠামোগত ইঞ্জিনিয়ার" },
        bio: { en: "The visionary behind the studio with 11+ years of infrastructure experience.", bn: "১১ বছরেরও বেশি অবকাঠামোগত অভিজ্ঞতাসম্পন্ন এই স্টুডিওর স্বপ্নদ্রষ্টা।" },
        image: { url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7" },
        socialLinks: { linkedin: "https://linkedin.com/in/alamashik" },
        order: 1
      },
      {
        slug: "drafter-1",
        name: "S. Hassan",
        designation: { en: "Head of Drafting", bn: "ড্রাফটিং প্রধান" },
        bio: { en: "Expert in high-precision CAD blueprinting and structural detailing.", bn: "উচ্চ-নির্ভুল ক্যাড ব্লু-প্রিন্টিং এবং কাঠামোগত ডিটেইলিং বিশেষজ্ঞ।" },
        image: { url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e" },
        socialLinks: { linkedin: "#" },
        order: 2
      },
      {
        slug: "artist-1",
        name: "R. Karim",
        designation: { en: "3D Visualization Lead", bn: "থ্রিডি ভিজুয়ালাইজেশন লিড" },
        bio: { en: "Specializing in photorealistic architectural renderings and BIM modeling.", bn: "ফটোরিয়ালিস্টিক স্থাপত্য রেন্ডারিং এবং বিআইএম মডেলিংয়ে বিশেষায়িত।" },
        image: { url: "https://images.unsplash.com/photo-1580489944761-15a19d654956" },
        socialLinks: { linkedin: "#" },
        order: 3
      }
    ];
    await TeamMember.insertMany(team);

    console.log("About Identity Records Synchronized.");
    process.exit(0);
  } catch (err) {
    console.error("DATA_INJECTION_FAILED:", err);
    process.exit(1);
  }
}

seed();
