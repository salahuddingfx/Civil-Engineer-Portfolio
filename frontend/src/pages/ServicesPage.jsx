import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../context/LanguageContext";
import { t } from "../lib/translations";
import SeoHead from "../components/SeoHead";
import { ServiceSkeleton } from "../components/Skeleton";
import LucideIcon from "../components/LucideIcon";
// Local fallback data
const servicesFallback = [
  {
    titleKey: "services_items.arch_title",
    descKey: "services_items.arch_desc",
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
  },
  {
    titleKey: "services_items.struct_title",
    descKey: "services_items.struct_desc",
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2zM16 13a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2z" /></svg>
  },
  {
    titleKey: "services_items.cad_title",
    descKey: "services_items.cad_desc",
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
  },
  {
    titleKey: "services_items.consult_title",
    descKey: "services_items.consult_desc",
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
  }
];
import { fetchContent } from "../lib/api";

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

export default function ServicesPage() {
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("ALL");
  const containerRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [displayServices, setDisplayServices] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchContent("services", { limit: 24 });
        if (res.items?.length > 0) {
          const mapped = res.items.map(s => ({
            ...s,
            title: s.title?.en,
            titleBn: s.title?.bn,
            desc: s.summary?.en,
            descBn: s.summary?.bn,
            icon: s.tags?.[0] || "M12 2L2 7l10 5 10-5-10-5z"
          }));
          setDisplayServices(mapped);
        } else {
          setDisplayServices(servicesFallback);
        }
        // No artificial delay
      } catch (err) {
        console.warn("Services API failed, using fallback", err);
        setDisplayServices(servicesFallback);
      } finally {
        setLoading(false);
      }
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
        title="Services | Engr. Alam Ashik | Civil Engineer in Cox's Bazar"
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
                className="reveal-unit p-10 rounded-2xl transition-all duration-300 flex flex-col relative overflow-hidden card-bg"
              >
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-bl-[100px] pointer-events-none"
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
                  {typeof service.icon === "string" ? (
                    service.icon.startsWith("M") ? (
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={service.icon} />
                      </svg>
                    ) : (
                      <LucideIcon name={service.icon} size={28} />
                    )
                  ) : (
                    service.icon
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-4 relative z-10" style={{ color: "var(--text)" }}>
                  {service.titleKey ? t(service.titleKey, language) : (language === "bn" ? service.titleBn : service.title)}
                </h3>
                <p className="text-[15px] leading-relaxed mb-10 flex-grow relative z-10" style={{ color: "var(--text-muted)" }}>
                  {service.descKey ? t(service.descKey, language) : (language === "bn" ? service.descBn : service.desc)}
                </p>
                <Link
                  to="/contact"
                  className="text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 transition-all mt-auto pt-6 relative z-10 text-[var(--text-muted)] border-t border-[var(--highlight-border)]"
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
