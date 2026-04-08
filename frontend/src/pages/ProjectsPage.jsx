import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../context/LanguageContext";
import { t } from "../lib/translations";
import SeoHead from "../components/SeoHead";
import { ProjectSkeleton } from "../components/Skeleton";

gsap.registerPlugin(ScrollTrigger);

const categories = ["ALL", "RESIDENTIAL", "COMMERCIAL", "INFRASTRUCTURE", "STRUCTURAL"];

const projects = [
  {
    title: "Bayline Villa",
    location: "Cox's Bazar, BD",
    category: "RESIDENTIAL",
    year: "2024",
    status: "COMPLETED",
    img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Nexus Corporate Hub",
    location: "Dhaka, BD",
    category: "COMMERCIAL",
    year: "2023",
    status: "COMPLETED",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Marine Drive Bridge",
    location: "Cox's Bazar, BD",
    category: "INFRASTRUCTURE",
    year: "2024",
    status: "IN PROGRESS",
    img: "https://images.unsplash.com/photo-1545524673-9ea72f778d1e?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "The Archon Complex",
    location: "Chattogram, BD",
    category: "STRUCTURAL",
    year: "2022",
    status: "COMPLETED",
    img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Sapphire Coast Resort",
    location: "Cox's Bazar, BD",
    category: "COMMERCIAL",
    year: "2025",
    status: "FOUNDATION PHASE",
    img: "https://images.unsplash.com/photo-1582610116397-ed860c29415c?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Azure Skyline Estate",
    location: "Cox's Bazar, BD",
    category: "RESIDENTIAL",
    year: "2024",
    status: "FINAL STAGE",
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
  }
];

export default function ProjectsPage() {
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("ALL");
  const containerRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [displayProjects, setDisplayProjects] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      // Beautiful skeleton demonstration delay
      await new Promise(r => setTimeout(r, 1800));
      setDisplayProjects(projects);
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(".reveal-unit", 
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".reveal-unit",
            start: "top 85%",
          }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [activeCategory]);

  const filtered = activeCategory === "ALL" 
    ? displayProjects 
    : displayProjects.filter(p => p.category === activeCategory);

  return (
    <div ref={containerRef} style={{ background: "var(--bg)", color: "var(--text)" }} className="min-h-screen">
      <SeoHead 
        title="Project Portfolio | Engr. Alam Ashik | Cox's Bazar" 
        description="A curated portfolio of architectural design, structural engineering, and commercial developments across Cox's Bazar and Bangladesh." 
        path="/projects" 
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6 lg:px-10 mx-auto max-w-[1500px]">
         <div className="reveal-unit max-w-4xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-[10px] font-bold tracking-[0.2em] uppercase"
              style={{ border: "1px solid var(--highlight-border)", background: "var(--highlight-soft)", color: "var(--highlight)" }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--highlight)" }} />
              {t("projects_page.eyebrow", language)}
            </span>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-6 uppercase" style={{ color: "var(--text)" }}>
              {t("projects_page.title", language).split(" ")[0]} <span className="text-glow">{t("projects_page.title", language).split(" ").slice(1).join(" ")}</span>
            </h1>
            <p className="text-lg max-w-2xl leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {t("projects_page.subtitle", language)}
            </p>
         </div>
      </section>

      {/* Filter Pills */}
      <section className="reveal-unit py-8 px-6 lg:px-10 mx-auto max-w-[1500px] mb-4" style={{ borderBottom: "1px solid var(--highlight-border)" }}>
         <div className="flex flex-wrap gap-4">
            {categories.map((cat, i) => {
              const isActive = activeCategory === cat;
              const labels = { ALL: t("projects_page.all", language), RESIDENTIAL: t("projects_page.residential", language), COMMERCIAL: t("projects_page.commercial", language), INFRASTRUCTURE: t("projects_page.infrastructure", language), STRUCTURAL: "Structural" };
              return (
                <button
                  key={i}
                  onClick={() => setActiveCategory(cat)}
                  className="px-8 py-3 rounded text-[11px] font-bold tracking-widest transition-all duration-300"
                  style={{
                    border: `1px solid ${isActive ? "var(--highlight)" : "var(--highlight-border)"}`,
                    background: isActive ? "var(--highlight-soft)" : "var(--bg-card)",
                    color: isActive ? "var(--highlight)" : "var(--text-muted)",
                  }}
                >
                  {labels[cat] || cat}
                </button>
              );
            })}
         </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 px-6 lg:px-10 mx-auto max-w-[1500px]">
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {loading ? (
              [1, 2, 3, 4, 5, 6].map((i) => <ProjectSkeleton key={i} />)
            ) : (
              filtered.map((project, i) => (
                <div
                  key={i}
                  className="reveal-unit group relative aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer shadow-xl transition-all duration-300 active:scale-[0.98]"
                  style={{ border: "1px solid var(--highlight-border)" }}
                >
                  <img
                    src={project.img}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  
                  {/* Better Overlay for Mobile */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] via-[#0A0F1C]/60 to-transparent opacity-80 md:opacity-40 md:group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                    <div className="md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-500">
                      <span
                        className="inline-block px-3 py-1 rounded text-[9px] md:text-[10px] tracking-widest font-bold uppercase mb-3 backdrop-blur-sm"
                        style={{ background: "var(--highlight-soft)", color: "var(--highlight)", border: "1px solid var(--highlight-border)" }}
                      >
                        {project.category} / {project.year}
                      </span>
                      <h3 className="text-xl md:text-2xl font-bold leading-tight mb-2 text-white">{project.title}</h3>
                      <div
                        className="flex items-center justify-between mt-2 pt-3 md:pt-4"
                        style={{ borderTop: "1px solid var(--highlight-border)" }}
                      >
                        <div className="flex items-center gap-2">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "var(--highlight)" }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-[11px] md:text-[12px] text-white/90 font-semibold">{project.location}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-white/10 border border-white/20 text-[8px] md:text-[10px] font-bold uppercase text-white shadow-sm">
                          {project.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Focus/Arrow Icon - Smaller on Mobile */}
                  <div
                    className="absolute top-4 right-4 md:top-8 md:right-8 w-10 h-10 md:w-12 md:h-12 backdrop-blur-md rounded-full flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 -rotate-45 md:group-hover:rotate-0 transition-all duration-500"
                    style={{ background: "var(--highlight-soft)", border: "1px solid var(--highlight-border)", color: "var(--highlight)" }}
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              ))
            )}
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-10 bg-[#0A0F1C]">
         <div className="max-w-[1500px] mx-auto rounded-3xl bg-[#111827] relative p-16 md:p-24 text-center reveal-unit border border-[#19D2FF]/20 shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-0 bg-[#19D2FF]/5 hidden md:block rounded-3xl pointer-events-none"></div>
            
            <div className="relative z-10 w-full max-w-3xl mx-auto">
               <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
                  Let’s Build <span className="text-[#19D2FF] text-glow">Your Vision</span>
               </h2>
               <p className="text-[#CBD5E1] mb-12 text-lg leading-relaxed">
                  Whether it’s a structural masterpiece or a bespoke interior in Cox's Bazar, our engineering precision brings your ideas to life safely and efficiently.
               </p>
               <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <Link 
                    to="/contact" 
                    className="flex items-center justify-center gap-3 px-8 py-4 rounded bg-[#19D2FF] text-[#0A0F1C] text-[14px] font-bold hover:bg-white hover:scale-105 transition-all shadow-[0_10px_30px_rgba(25,210,255,0.25)] cta-pulse"
                  >
                    START A PROJECT
                  </Link>
                  <Link 
                    to="/services" 
                    className="flex items-center justify-center gap-3 px-8 py-4 rounded border border-[rgba(25,210,255,0.2)] text-white text-[14px] font-bold hover:bg-[#19D2FF]/5 hover:text-[#19D2FF] hover:border-[#19D2FF]/50 transition-all"
                  >
                    VIEW CAPABILITIES
                  </Link>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
