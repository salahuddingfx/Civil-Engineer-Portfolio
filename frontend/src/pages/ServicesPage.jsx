import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../context/LanguageContext";
import { t } from "../lib/translations";
import SeoHead from "../components/SeoHead";
import { ServiceSkeleton } from "../components/Skeleton";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  { en: "ALL SERVICES", bn: "সব সেবা",      key: "ALL" },
  { en: "ARCHITECTURAL", bn: "স্থাপত্য",    key: "ARCHITECTURAL" },
  { en: "STRUCTURAL",    bn: "কাঠামোগত",    key: "STRUCTURAL" },
  { en: "CAD",           bn: "ক্যাড",        key: "CAD" },
  { en: "VISUALIZATION", bn: "ভিজুয়ালাইজেশন", key: "VISUALIZATION" },
  { en: "CONSULTANCY",   bn: "পরামর্শ",     key: "CONSULTANCY" },
  { en: "SUPERVISION",   bn: "তদারকি",      key: "SUPERVISION" },
];

const services = [
  { title: "Architectural Design", titleBn: "স্থাপত্য নকশা", desc: "Conceptualizing spaces that harmonize aesthetic brilliance with functional integrity, from residential masterpieces to commercial hubs in Cox's Bazar.", descBn: "আবাসিক মাস্টারপিস থেকে কক্সবাজারের বাণিজ্যিক হাব পর্যন্ত নান্দনিক উজ্জ্বলতার সাথে কার্যকরী অখণ্ডতার সমন্বয় করে স্থানগুলি কনসেপ্টুয়ালাইজ করা।", category: "ARCHITECTURAL", icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> },
  { title: "Structural Analysis", titleBn: "কাঠামোগত বিশ্লেষণ", desc: "Rigorous structural calculations ensuring safety, longevity, and optimized material usage for complex load-bearing systems.", descBn: "কঠিন কাঠামোগত গণনা যা জটিল লোড-বেয়ারিং সিস্টেমের জন্য নিরাপত্তা, দীর্ঘায়ু এবং অপ্টিমাইজড উপকরণ ব্যবহার নিশ্চিত করে।", category: "STRUCTURAL", icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg> },
  { title: "Technical Drafting", titleBn: "প্রযুক্তিগত ড্রাফটিং", desc: "Precision-driven CAD services generating detailed blueprints and technical documents for precise construction execution.", descBn: "নির্ভুল নির্মাণ কার্যকরকরণের জন্য বিস্তারিত ব্লুপ্রিন্ট এবং প্রযুক্তিগত ডকুমেন্ট তৈরিকারী নির্ভুলতা-চালিত ক্যাড পরিষেবা।", category: "CAD", icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
  { title: "3D Visualization", titleBn: "থ্রিডি ভিজুয়ালাইজেশন", desc: "Photorealistic renders and virtual walkthroughs bringing your vision to life before the first stone is laid.", descBn: "ফটোরিয়ালিস্টিক রেন্ডার এবং ভার্চুয়াল ওয়াকথ্রু যা প্রথম পাথর রাখার আগেই আপনার দৃষ্টিভঙ্গিকে জীবন্ত করে।", category: "VISUALIZATION", icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> },
  { title: "Site Supervision", titleBn: "সাইট তদারকি", desc: "Ensuring construction perfectly adheres to design specifications and maximum engineering quality standards.", descBn: "নির্মাণ ডিজাইন স্পেসিফিকেশন এবং সর্বোচ্চ ইঞ্জিনিয়ারিং মান মানের সাথে পুরোপুরি মেনে চলে তা নিশ্চিত করা।", category: "SUPERVISION", icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> },
  { title: "Strategic Consultancy", titleBn: "কৌশলগত পরামর্শ", desc: "Expert advisory on Cox's Bazar regional project feasibility, regulatory compliance, and cost-efficient engineering strategies.", descBn: "কক্সবাজার আঞ্চলিক প্রকল্পের সম্ভাব্যতা, নিয়ন্ত্রক সম্মতি এবং সাশ্রয়ী ইঞ্জিনিয়ারিং কৌশলে বিশেষজ্ঞ পরামর্শ।", category: "CONSULTANCY", icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> }
];

export default function ServicesPage() {
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("ALL");
  const containerRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [displayServices, setDisplayServices] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await new Promise(r => setTimeout(r, 1500));
      setDisplayServices(services);
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(".reveal-unit",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out",
          scrollTrigger: { trigger: ".reveal-unit", start: "top 85%" } }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [activeCategory]);

  const filtered = activeCategory === "ALL" ? displayServices : displayServices.filter(s => s.category === activeCategory);

  return (
    <div ref={containerRef} style={{ background: "var(--bg)", color: "var(--text)" }} className="min-h-screen">
      <SeoHead
        title="Engineering Services | Structural Consultancy Cox's Bazar"
        description="Explore our range of premium structural engineering, architectural blueprinting, and CAD visualization services tailored for Cox's Bazar."
        path="/services"
      />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-6 lg:px-10 mx-auto max-w-[1500px]">
        <div className="reveal-unit max-w-4xl">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-[10px] font-bold tracking-[0.2em] uppercase"
            style={{ border: "1px solid var(--highlight-border)", background: "var(--highlight-soft)", color: "var(--highlight)" }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--highlight)" }} />
            {t("services_page.eyebrow", language)}
          </span>
          <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-8">
            {t("services_page.title", language).split(" ").slice(0, -1).join(" ")} <br />
            <span className="text-glow">{t("services_page.title", language).split(" ").slice(-1)}</span>
          </h1>
          <p className="text-lg max-w-2xl leading-relaxed mb-6 font-medium" style={{ color: "var(--text-muted)" }}>
            {t("services_page.subtitle", language)}
          </p>
        </div>
      </section>

      {/* Category Filters */}
      <section className="reveal-unit py-8 px-6 lg:px-10 mx-auto max-w-[1500px] mb-8"
        style={{ borderBottom: "1px solid var(--highlight-border)" }}>
        <div className="flex flex-wrap gap-4">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className="px-6 py-3 rounded text-[11px] font-bold uppercase tracking-widest transition-all duration-300"
                style={{
                  border: `1px solid ${isActive ? "var(--highlight)" : "var(--highlight-border)"}`,
                  background: isActive ? "var(--highlight-soft)" : "transparent",
                  color: isActive ? "var(--highlight)" : "var(--text-muted)",
                }}
              >
                {language === "bn" ? cat.bn : cat.en}
              </button>
            );
          })}
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 px-6 lg:px-10 mx-auto max-w-[1500px]">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [1, 2, 3, 4, 5, 6].map((i) => <ServiceSkeleton key={i} />)
          ) : (
            filtered.map((service, i) => (
              <div
                key={i}
                className="reveal-unit p-10 rounded-2xl group transition-all duration-300 flex flex-col relative overflow-hidden card-bg"
              >
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-bl-[100px] group-hover:scale-150 transition-transform duration-700 pointer-events-none"
                  style={{ background: "var(--highlight-soft)" }}
                />
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-8 relative z-10"
                  style={{
                    background: "var(--highlight-soft)",
                    color: "var(--highlight)",
                    boxShadow: "0 0 15px var(--highlight-soft)",
                  }}
                >
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 relative z-10" style={{ color: "var(--text)" }}>
                  {language === "bn" ? service.titleBn : service.title}
                </h3>
                <p className="text-[15px] leading-relaxed mb-10 flex-grow relative z-10" style={{ color: "var(--text-muted)" }}>
                  {language === "bn" ? service.descBn : service.desc}
                </p>
                <Link
                  to="/contact"
                  className="text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 group-hover:gap-4 transition-all mt-auto pt-6 relative z-10"
                  style={{ color: "var(--text-muted)", borderTop: "1px solid var(--highlight-border)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--highlight)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                >
                  {language === "en" ? "Schedule Consultation" : "পরামর্শ বুক করুন"}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            ))
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 lg:px-10 relative overflow-hidden" style={{ background: "var(--bg)" }}>
        <div className="max-w-[1200px] mx-auto rounded-3xl relative p-16 md:p-24 text-center reveal-unit"
          style={{ background: "var(--bg-card)", border: "1px solid var(--highlight-border)", boxShadow: "0 30px 60px rgba(0,0,0,0.1)" }}>
          <div className="relative z-10 w-full max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: "var(--text)" }}>
              {language === "en" ? "Ready to Build Your " : "আপনার দৃষ্টিভঙ্গি "}<span className="text-glow">{language === "en" ? "Vision?" : "বাস্তবে আনতে প্রস্তুত?"}</span>
            </h2>
            <p className="max-w-lg mx-auto mb-10 text-lg" style={{ color: "var(--text-muted)" }}>
              {language === "en"
                ? "Partner with Engr. Alam Ashik for innovative structural solutions that redefine the architectural landscape."
                : "উদ্ভাবনী কাঠামোগত সমাধানের জন্য ইঞ্জিনিয়ার আলম আশিকের সাথে অংশীদারিত্ব করুন।"}
            </p>
            <Link to="/contact"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-lg font-bold text-[14px] transition-all cta-pulse"
              style={{ background: "var(--highlight)", color: "#0A0F1C" }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--text)"; e.currentTarget.style.color = "var(--bg)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--highlight)"; e.currentTarget.style.color = "#0A0F1C"; }}
            >
              {t("testimonials_page.cta_button", language).toUpperCase()}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
