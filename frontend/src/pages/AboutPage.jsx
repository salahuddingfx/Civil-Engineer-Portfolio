import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../context/LanguageContext";
import SeoHead from "../components/SeoHead";

gsap.registerPlugin(ScrollTrigger);

// ── Skills data by category ────────────────────────────────────────────────────
const skillCategories = [
  {
    category: "Structural Engineering",
    categoryBn: "কাঠামোগত ইঞ্জিনিয়ারিং",
    color: "#19D2FF",
    icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    skills: [
      { name: "Structural Analysis",    level: 98 },
      { name: "Load Bearing Design",    level: 97 },
      { name: "Reinforced Concrete",    level: 96 },
      { name: "Foundation Engineering", level: 95 },
      { name: "Seismic Design",         level: 90 },
      { name: "Steel Structures",       level: 92 },
    ],
  },
  {
    category: "Design & Drafting",
    categoryBn: "নকশা ও ড্রয়িং",
    color: "#7C3AED",
    icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
    skills: [
      { name: "AutoCAD",         level: 99 },
      { name: "Revit Architecture", level: 95 },
      { name: "SketchUp 3D",     level: 93 },
      { name: "Architectural Drawing", level: 97 },
      { name: "Technical Drafting",    level: 96 },
      { name: "BIM Modeling",          level: 88 },
    ],
  },
  {
    category: "Software & Analysis",
    categoryBn: "সফটওয়্যার ও বিশ্লেষণ",
    color: "#10B981",
    icon: "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18",
    skills: [
      { name: "ETABS",           level: 95 },
      { name: "SAP2000",         level: 92 },
      { name: "STAAD.Pro",       level: 88 },
      { name: "SAFE",            level: 90 },
      { name: "MS Project",      level: 85 },
      { name: "Primavera P6",    level: 80 },
    ],
  },
  {
    category: "Project Management",
    categoryBn: "প্রজেক্ট ম্যানেজমেন্ট",
    color: "#F59E0B",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    skills: [
      { name: "Site Supervision",      level: 97 },
      { name: "Cost Estimation",        level: 93 },
      { name: "Regulatory Compliance",  level: 95 },
      { name: "Client Communication",   level: 98 },
      { name: "Team Leadership",        level: 96 },
      { name: "Risk Management",        level: 90 },
    ],
  },
];

// ── Team data ──────────────────────────────────────────────────────────────────
const team = [
  {
    name: "Engr. Alam Ashik",
    role: "Founder & Chief Consultant",
    dept: "Structural Engineering",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
    socials: {
      linkedin: "https://linkedin.com",
      facebook: "https://facebook.com",
      email: "mailto:alam.ashik@example.com",
    }
  },
  {
    name: "Ar. Nasrin Begum",
    role: "Lead Architect",
    dept: "Architectural Design",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    socials: {
      linkedin: "https://linkedin.com",
      facebook: "https://facebook.com",
      email: "mailto:nasrin@example.com",
    }
  },
  {
    name: "Engr. Rafiqul Islam",
    role: "Structural Engineer",
    dept: "Analysis & Simulation",
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
    socials: {
      linkedin: "https://linkedin.com",
      facebook: "https://facebook.com",
      email: "mailto:rafiq@example.com",
    }
  },
  {
    name: "Sadia Ahmed",
    role: "Project Coordinator",
    dept: "Operations & Compliance",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    socials: {
      linkedin: "https://linkedin.com",
      facebook: "https://facebook.com",
      email: "mailto:sadia@example.com",
    }
  },
];

const journey = [
  { year: "2013", title: "The Foundation", desc: "Engr. Alam Ashik Consultancy established in Cox's Bazar with a singular mission: precision structural engineering for coastal Bangladesh." },
  { year: "2017", title: "Regional Recognition", desc: "First major commercial tower project in Chattogram, establishing our reputation beyond Cox's Bazar." },
  { year: "2020", title: "Digital Transformation", desc: "Full BIM integration and 3D visualization workflows adopted, setting a new standard for Cox's Bazar architectural firms." },
  { year: "2024", title: "Legacy Era", desc: "150+ completed projects, a thriving team of specialists, and the go-to consultancy for premium construction in Bangladesh's coastal belt." }
];

// ── Tilt Skill Card ────────────────────────────────────────────────────────────
function SkillCard({ cat, language }) {
  return (
    <div
      className="p-8 rounded-2xl reveal-unit transition-all duration-300"
      style={{
        background: "var(--bg-card)",
        border: `1px solid ${cat.color}30`,
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: `${cat.color}15`, border: `1px solid ${cat.color}40` }}>
          <svg className="w-6 h-6" fill="none" stroke={`${cat.color}`} strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d={cat.icon} />
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-[15px]" style={{ color: "var(--text)" }}>
            {language === "bn" ? cat.categoryBn : cat.category}
          </h3>
          <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5" style={{ color: cat.color }}>
            {cat.skills.length} Skills
          </p>
        </div>
      </div>

      {/* Skill bars */}
      <div className="space-y-4">
        {cat.skills.map((skill, i) => (
          <div key={i}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[13px] font-semibold" style={{ color: "var(--text-muted)" }}>{skill.name}</span>
              <span className="text-[12px] font-bold tabular-nums" style={{ color: cat.color }}>{skill.level}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--highlight-border)" }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${skill.level}%`, background: `linear-gradient(90deg, ${cat.color}99, ${cat.color})` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function AboutPage() {
  const { language } = useLanguage();
  const containerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // General section reveal
      gsap.utils.toArray(".reveal-unit").forEach((elem) => {
        gsap.fromTo(elem,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
            scrollTrigger: { trigger: elem, start: "top 85%" } }
        );
      });

      // ── Timeline Specific Animations ──────────────────────────────────────────
      
      // 1. Line drawing animation
      gsap.fromTo(".timeline-line-progress", 
        { scaleY: 0 },
        { 
          scaleY: 1, 
          ease: "none", 
          scrollTrigger: {
            trigger: ".timeline-container",
            start: "top 70%",
            end: "bottom 80%",
            scrub: true
          }
        }
      );

      // 2. Individual Dot & Card reveals
      const timelineItems = gsap.utils.toArray(".timeline-item");
      timelineItems.forEach((item, i) => {
        const dot = item.querySelector(".timeline-dot");
        const card = item.querySelector(".timeline-card");
        const isLeft = i % 2 === 0;

        // Dot pop
        gsap.fromTo(dot,
          { scale: 0, opacity: 0 },
          { 
            scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)",
            scrollTrigger: { trigger: dot, start: "top 75%" } 
          }
        );

        // Card side slide
        gsap.fromTo(card,
          { opacity: 0, x: isLeft ? -50 : 50 },
          { 
            opacity: 1, x: 0, duration: 1, ease: "power4.out",
            scrollTrigger: { trigger: card, start: "top 80%" } 
          }
        );
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} style={{ background: "var(--bg)", color: "var(--text)" }} className="min-h-screen">
      <SeoHead
        title="About Engr. Alam Ashik | Civil Engineering Consultancy Cox's Bazar"
        description="Learn about the legacy, expertise, skills, and team behind Engr. Alam Ashik's premium structural engineering and architectural consultancy in Cox's Bazar."
        path="/about"
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-center pt-32 px-6 lg:px-10 overflow-hidden">
        <div className="blueprint-overlay" />
        <div className="mx-auto max-w-[1500px] w-full grid lg:grid-cols-2 items-center gap-16 relative z-10">
          {/* Left: Visual */}
          <div className="order-2 lg:order-1 relative h-[500px] w-full rounded-2xl overflow-hidden reveal-unit"
            style={{ border: "1px solid var(--highlight-border)" }}>
            <img 
              src="/images/mission-concept.png" 
              alt="Engineering Mission" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-6 left-6 p-6 rounded-xl max-w-[300px] backdrop-blur-lg"
              style={{ background: "var(--glass-bg)", border: "1px solid var(--highlight-border)" }}>
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold mb-2" style={{ color: "var(--highlight)" }}>SINCE 2013</p>
              <p className="text-[12px] leading-relaxed font-medium" style={{ color: "var(--text-muted)" }}>
                Engineering excellence through precision and architectural foresight in Cox's Bazar.
              </p>
            </div>
          </div>

          {/* Right: Text */}
          <div className="order-1 lg:order-2 reveal-unit">
            <span className="inline-block px-4 py-1.5 rounded-full mb-8 text-[10px] uppercase tracking-[0.3em] font-bold"
              style={{ border: "1px solid var(--highlight-border)", background: "var(--highlight-soft)", color: "var(--highlight)" }}>
              {language === "en" ? "Mission Statement" : "আমাদের লক্ষ্য"}
            </span>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-8" style={{ color: "var(--text)" }}>
              {language === "en" ? <>CRAFTING <br /> THE <span className="text-glow">FUTURE</span></> : <>ভবিষ্যতের <span className="text-glow">নকশা</span></>}
            </h1>
            <p className="text-lg max-w-xl leading-relaxed mb-10 font-normal" style={{ color: "var(--text-muted)" }}>
              {language === "en"
                ? "To redefine the landscape of technical consultancy by merging architectural beauty with structural integrity. We don't just build structures; we engineer legacies."
                : "প্রযুক্তিগত পরামর্শের ক্ষেত্রে স্থাপত্যিক সৌন্দর্য ও কাঠামোগত অখণ্ডতাকে একত্রিত করে নতুন সংজ্ঞা তৈরি করা। আমরা শুধু স্থাপনা নির্মাণ করি না; আমরা উত্তরাধিকার তৈরি করি।"}
            </p>
            <div className="flex gap-12">
              {[
                { val: "150+", label: language === "en" ? "Projects Done" : "সম্পন্ন প্রকল্প" },
                { val: "10+",  label: language === "en" ? "Years Active" : "বছরের অভিজ্ঞতা" },
                { val: "100%", label: language === "en" ? "Safety Rating" : "নিরাপত্তা রেটিং" },
              ].map(({ val, label }, i) => (
                <div key={i}>
                  <p className="text-4xl font-bold mb-2" style={{ color: "var(--text)" }}>{val}</p>
                  <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: "var(--highlight)" }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── About Me ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-10" style={{ borderTop: "1px solid var(--highlight-border)", background: "var(--bg-soft)" }}>
        <div className="mx-auto max-w-[1500px] grid lg:grid-cols-[1fr_0.75fr] items-center gap-16">
          <div className="reveal-unit">
            <p className="text-[12px] tracking-[0.2em] font-bold uppercase mb-4" style={{ color: "var(--highlight)" }}>
              {language === "en" ? "The Principal" : "প্রধান উপদেষ্টা"}
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-3" style={{ color: "var(--text)" }}>Engr. Alam Ashik</h2>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] mb-10" style={{ color: "var(--highlight)" }}>
              {language === "en" ? "Founder / Chief Structural Consultant" : "প্রতিষ্ঠাতা / প্রধান কাঠামোগত পরামর্শদাতা"}
            </p>
            <div className="space-y-6 max-w-xl mb-10">
              <p className="text-lg italic leading-relaxed" style={{ color: "var(--text-muted)" }}>
                "{language === "en"
                  ? "Architecture isn't just about weight loads; it's about a fundamental shift in how we perceive durability and aesthetics in the built environment. Every blueprint is a promise of stability and grace."
                  : "স্থাপত্য শুধু লোড সম্পর্কে নয়; এটি নির্মিত পরিবেশে স্থায়িত্ব ও নান্দনিকতার প্রতি আমাদের দৃষ্টিভঙ্গির একটি মৌলিক পরিবর্তন। প্রতিটি ব্লুপ্রিন্ট স্থিতিশীলতা ও কমনীয়তার একটি প্রতিশ্রুতি।"}"
              </p>
              <p className="text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {language === "en"
                  ? "With over a decade of experience in high-performance structural engineering across Cox's Bazar and Bangladesh, Engr. Alam Ashik has pioneered sustainable building techniques and precision structural solutions that set regional benchmarks."
                  : "কক্সবাজার ও বাংলাদেশ জুড়ে উচ্চ-কার্যক্ষমতার কাঠামোগত ইঞ্জিনিয়ারিংয়ে এক দশকেরও বেশি অভিজ্ঞতার সাথে, ইঞ্জিনিয়ার আলম আশিক টেকসই নির্মাণ কৌশল ও নির্ভুল কাঠামোগত সমাধান উদ্বোধন করেছেন।"}
              </p>
            </div>
            <Link to="/projects"
              className="inline-flex items-center gap-3 px-8 py-4 rounded font-bold text-sm tracking-wide transition-all"
              style={{ background: "var(--highlight)", color: "#0A0F1C" }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--text)"; e.currentTarget.style.color = "var(--bg)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--highlight)"; e.currentTarget.style.color = "#0A0F1C"; }}
            >
              {language === "en" ? "View Portfolio" : "পোর্টফোলিও দেখুন"}
            </Link>
          </div>

          {/* Portrait card */}
          <div className="reveal-unit relative w-full h-[500px] rounded-3xl overflow-hidden flex items-center justify-center"
            style={{ background: "var(--bg-accent)", border: "1px solid var(--highlight-border)" }}>
            <img
              src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80"
              alt="Engr. Alam Ashik"
              className="w-full h-full object-cover object-top"
              style={{ filter: "grayscale(20%)" }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 backdrop-blur-lg"
              style={{ background: "var(--glass-bg)", borderTop: "1px solid var(--highlight-border)" }}>
              <p className="font-bold text-[15px]" style={{ color: "var(--text)" }}>Engr. Alam Ashik</p>
              <p className="text-[11px] uppercase tracking-widest font-bold mt-1" style={{ color: "var(--highlight)" }}>
                B.Sc. Engg. (Civil) · IEB Member
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Skills ────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-10" style={{ background: "var(--bg)" }}>
        <div className="mx-auto max-w-[1500px]">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 reveal-unit">
            <div>
              <p className="text-[12px] tracking-[0.2em] font-bold uppercase mb-4" style={{ color: "var(--highlight)" }}>
                {language === "en" ? "Technical Expertise" : "প্রযুক্তিগত দক্ষতা"}
              </p>
              <h2 className="text-4xl md:text-5xl font-bold" style={{ color: "var(--text)" }}>
                {language === "en" ? "Core Skills" : "মূল দক্ষতাসমূহ"}
              </h2>
            </div>
            <p className="text-[15px] max-w-md text-right" style={{ color: "var(--text-muted)" }}>
              {language === "en"
                ? "Deep expertise across structural analysis, architectural design, CAD software, and project management."
                : "কাঠামোগত বিশ্লেষণ, স্থাপত্য নকশা, ক্যাড সফটওয়্যার ও প্রজেক্ট ম্যানেজমেন্টে গভীর দক্ষতা।"}
            </p>
          </div>

          {/* Skill grid — category-wise with 3D tilt on hover */}
          <div className="grid md:grid-cols-2 gap-8">
            {skillCategories.map((cat, i) => (
              <SkillCard key={i} cat={cat} language={language} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Journey Timeline ──────────────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-10 overflow-hidden" style={{ background: "var(--bg-soft)", borderTop: "1px solid var(--highlight-border)", borderBottom: "1px solid var(--highlight-border)" }}>
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-16 reveal-unit">
            <p className="text-[12px] tracking-[0.2em] font-bold uppercase mb-4" style={{ color: "var(--highlight)" }}>
              {language === "en" ? "Our Timeline" : "আমাদের যাত্রা"}
            </p>
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-widest" style={{ color: "var(--text)" }}>
              {language === "en" ? "The Journey" : "যাত্রাপথ"}
            </h2>
          </div>

          <div className="timeline-container relative max-w-5xl mx-auto py-10">
            {/* Background Track */}
            <div className="absolute left-[50%] top-0 h-full w-[1px] hidden md:block" style={{ background: "var(--highlight-border)" }} />
            {/* Pulsing Progress Line */}
            <div className="timeline-line-progress absolute left-[50%] top-0 h-full w-[2px] hidden md:block origin-top" 
              style={{ background: "var(--highlight)", boxShadow: "0 0 15px var(--highlight-glow)", zIndex: 5 }} />

            <div className="space-y-32">
              {journey.map((item, i) => (
                <div key={i} className={`timeline-item relative flex flex-col md:flex-row items-center gap-12 ${i % 2 !== 0 ? "md:flex-row-reverse" : ""}`}>
                  <div className="timeline-dot absolute left-1/2 top-12 z-10 w-4 h-4 rounded-full -translate-x-1/2 hidden md:block"
                    style={{ background: "var(--highlight)", border: "4px solid var(--bg)", boxShadow: "0 0 15px var(--highlight-glow)" }} />
                  
                  <div className="md:w-1/2">
                    <div className="timeline-card p-10 rounded-2xl"
                      style={{ background: "var(--bg-card)", border: "1px solid var(--highlight-border)", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
                      <p className="text-3xl font-bold mb-4" style={{ color: "var(--highlight)" }}>{item.year}</p>
                      <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text)" }}>{item.title}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{item.desc}</p>
                    </div>
                  </div>
                  <div className="md:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Team ──────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-10" style={{ background: "var(--bg)" }}>
        <div className="mx-auto max-w-[1500px]">
          <div className="flex justify-between items-end mb-16 reveal-unit">
            <div>
              <p className="text-[12px] tracking-[0.2em] font-bold uppercase mb-4" style={{ color: "var(--highlight)" }}>
                {language === "en" ? "The Experts" : "বিশেষজ্ঞ দল"}
              </p>
              <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-widest" style={{ color: "var(--text)" }}>
                {language === "en" ? "Core Team" : "মূল দল"}
              </h2>
            </div>
            <Link to="/contact" className="text-[11px] font-bold transition-colors"
              style={{ color: "var(--highlight)" }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--text)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--highlight)"}
            >
              {language === "en" ? "Join our team →" : "দলে যোগ দিন →"}
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <div key={i} className="reveal-unit group relative rounded-2xl overflow-hidden transition-all duration-300"
                style={{ background: "var(--bg-card)", border: "1px solid var(--highlight-border)" }}
              >
                {/* Photo */}
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img src={member.img} alt={member.name}
                    className="w-full h-full object-cover object-top transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105"
                  />
                  {/* Social overlay */}
                  <div className="absolute inset-0 flex items-end justify-center opacity-0 group-hover:opacity-100 transition-all duration-500"
                    style={{ background: "linear-gradient(to top, rgba(10,15,28,0.9) 0%, transparent 50%)" }}>
                    <div className="flex gap-3 pb-5">
                      {/* LinkedIn */}
                      <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                        style={{ background: "var(--highlight-soft)", border: "1px solid var(--highlight-border)", color: "var(--highlight)" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#0077B5"; e.currentTarget.style.color = "white"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "var(--highlight-soft)"; e.currentTarget.style.color = "var(--highlight)"; }}>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      </a>
                      {/* Facebook */}
                      <a href={member.socials.facebook} target="_blank" rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                        style={{ background: "var(--highlight-soft)", border: "1px solid var(--highlight-border)", color: "var(--highlight)" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#1877F2"; e.currentTarget.style.color = "white"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "var(--highlight-soft)"; e.currentTarget.style.color = "var(--highlight)"; }}>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      </a>
                      {/* Email */}
                      <a href={member.socials.email}
                        className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                        style={{ background: "var(--highlight-soft)", border: "1px solid var(--highlight-border)", color: "var(--highlight)" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "var(--highlight)"; e.currentTarget.style.color = "#0A0F1C"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "var(--highlight-soft)"; e.currentTarget.style.color = "var(--highlight)"; }}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="text-[16px] font-bold mb-1" style={{ color: "var(--text)" }}>{member.name}</h3>
                  <p className="text-[11px] uppercase tracking-widest font-bold mb-1" style={{ color: "var(--highlight)" }}>{member.role}</p>
                  <p className="text-[12px]" style={{ color: "var(--text-faint)" }}>{member.dept}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-10" style={{ background: "var(--bg-soft)", borderTop: "1px solid var(--highlight-border)" }}>
        <div className="max-w-3xl mx-auto text-center reveal-unit">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: "var(--text)" }}>
            {language === "en" ? <>Let's Build Something <span className="text-glow">Great</span></> : <>আসুন মিলে কিছু <span className="text-glow">অসাধারণ</span> তৈরি করি</>}
          </h2>
          <p className="text-lg mb-10" style={{ color: "var(--text-muted)" }}>
            {language === "en"
              ? "Ready to start your project? Connect with Cox's Bazar's most trusted engineering team."
              : "আপনার প্রকল্প শুরু করতে প্রস্তুত? কক্সবাজারের সবচেয়ে বিশ্বস্ত ইঞ্জিনিয়ারিং দলের সাথে যোগাযোগ করুন।"}
          </p>
          <Link to="/contact"
            className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-lg font-bold text-[15px] transition-all cta-pulse"
            style={{ background: "var(--highlight)", color: "#0A0F1C" }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--text)"; e.currentTarget.style.color = "var(--bg)"; e.currentTarget.style.transform = "scale(1.05)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "var(--highlight)"; e.currentTarget.style.color = "#0A0F1C"; e.currentTarget.style.transform = "scale(1)"; }}
          >
            {language === "en" ? "Start a Consultation" : "পরামর্শ শুরু করুন"}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
