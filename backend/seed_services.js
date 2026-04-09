const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load env
dotenv.config({ path: path.join(__dirname, ".env") });

const { Service } = require("./models/contentModels");

async function seed() {
  try {
    console.log("Connecting to Neural Database...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connection Established.");

    const services = [
      {
        slug: "structural-engineering",
        title: { en: "Structural Engineering", bn: "কাঠামোগত ইঞ্জিনিয়ারিং" },
        summary: { 
          en: "High-precision structural analysis and load-bearing design for multi-storied residential and commercial towers.",
          bn: "বহুতল আবাসিক ও বাণিজ্যিক ভবনের জন্য উচ্চ-নির্ভুল কাঠামোগত বিশ্লেষণ এবং লোড-বেয়ারিং ডিজাইন।"
        },
        tags: ["Zap"],
        category: "STRUCTURAL",
        order: 1,
        isPublished: true
      },
      {
        slug: "architectural-design",
        title: { en: "Architectural Planning", bn: "স্থাপত্য পরিকল্পনা" },
        summary: { 
          en: "Modern architectural drafting with a focus on spatial efficiency and aesthetic elegance for coastal environments.",
          bn: "উপকূলীয় পরিবেশের জন্য স্থান দক্ষতা এবং নান্দনিক কমনীয়তার উপর ফোকাস সহ আধুনিক স্থাপত্য পরিকল্পনা।"
        },
        tags: ["Layers"],
        category: "ARCHITECTURAL",
        order: 2,
        isPublished: true
      },
      {
        slug: "bim-modeling",
        title: { en: "3D BIM & Visualization", bn: "থ্রিডি বিআইএম এবং ভিজুয়ালাইজেশন" },
        summary: { 
          en: "Advanced Building Information Modeling (BIM) for precise digital prototyping and realistic 3D renderings.",
          bn: "নির্ভুল ডিজিটাল প্রোটোটাইপিঙের জন্য উন্নত বিল্ডিং ইনফরমেশন মডেলিং (বিআইএম) এবং বাস্তবসম্মত থ্রিডি রেন্ডারিং।"
        },
        tags: ["Cpu"],
        category: "VISUALIZATION",
        order: 3,
        isPublished: true
      },
      {
        slug: "foundation-analysis",
        title: { en: "Foundation Engineering", bn: "ফাউন্ডেশন ইঞ্জিনিয়ারিং" },
        summary: { 
          en: "In-depth soil analysis and pile foundation design optimized for the salt-heavy coastal belt of Cox's Bazar.",
          bn: "কক্সবাজারের লবণাক্ত উপকূলীয় অঞ্চলের জন্য অপ্টিমাইজড গভীর মৃত্তিকা বিশ্লেষণ এবং পাইল ফাউন্ডেশন ডিজাইন।"
        },
        tags: ["Shield"],
        category: "STRUCTURAL",
        order: 4,
        isPublished: true
      },
      {
        slug: "mep-consultancy",
        title: { en: "MEP Solutions", bn: "এমইপি সমাধান" },
        summary: { 
          en: "Integrated Mechanical, Electrical, and Plumbing (MEP) consultancy ensuring seamless infrastructure longevity.",
          bn: "সমন্বিত যান্ত্রিক, বৈদ্যুতিক এবং প্লাম্বিং (এমইপি) পরামর্শ যা নিরবচ্ছিন্ন অবকাঠামোর স্থায়িত্ব নিশ্চিত করে।"
        },
        tags: ["Settings"],
        category: "CONSULTANCY",
        order: 5,
        isPublished: true
      },
      {
        slug: "interior-design",
        title: { en: "Interior Architecture", bn: "ইন্টেরিয়র আর্কিটেকচার" },
        summary: { 
          en: "Premium interior concept development that balances modern minimalism with structural feasibility.",
          bn: "প্রিমিয়াম ইনার ডিজাইন কনসেপ্ট যা কাঠামোগত সম্ভাব্যতার সাথে আধুনিক মিনিমালিজমের ভারসাম্য রক্ষা করে।"
        },
        tags: ["PenTool"],
        category: "ARCHITECTURAL",
        order: 6,
        isPublished: true
      },
      {
        slug: "project-estimation",
        title: { en: "Cost Estimation & QA", bn: "প্রকল্প অনুমান এবং কিউএ" },
        summary: { 
          en: "Precise bill of materials and quality assurance monitoring to ensure project budget and safety compliance.",
          bn: "প্রকল্পের বাজেট এবং নিরাপত্তা কমপ্লায়েন্স নিশ্চিত করতে উপকরণের নির্ভুল বিল এবং গুণমান নিশ্চিতকরণ পর্যবেক্ষণ।"
        },
        tags: ["Search"],
        category: "CONSULTANCY",
        order: 7,
        isPublished: true
      }
    ];

    console.log("Purging existing service cache...");
    await Service.deleteMany({});
    
    console.log("Injecting 7 new Service Nodes...");
    await Service.insertMany(services);

    console.log("Neural Records Synchronized Successfully.");
    process.exit(0);
  } catch (err) {
    console.error("DATA_INJECTION_FAILED:", err);
    process.exit(1);
  }
}

seed();
