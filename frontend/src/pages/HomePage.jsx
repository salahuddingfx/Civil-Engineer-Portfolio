import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { t } from "../lib/translations";
import SeoHead from "../components/SeoHead";

// Lazy load Three.js to avoid SSR/build issues
const ArchitecturalModel = lazy(() => import("../components/ArchitecturalModel"));
import { Skeleton, ProjectSkeleton, ServiceSkeleton, TestimonialSkeleton } from "../components/Skeleton";
import { fetchContent } from "../lib/api";

gsap.registerPlugin(ScrollTrigger);

// ── Testimonials data ─────────────────────────────────────────────────────────
const testimonials = [
  {
    name: "Sarah Chen",
    role: "DIRECTOR OF ENGINEERING",
    company: "NEXACORE DEVELOPMENTS",
    text: "The integration of structural integrity with modern architectural design was seamless. Truly a technical mastermind who understands the nuance of enterprise scale in Cox's Bazar's coastal conditions.",
    rating: 5,
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=60"
  },
  {
    name: "Marcus Thorne",
    role: "FOUNDER",
    company: "APEX HORIZON BUILDERS",
    text: "Reliable, precise, and highly communicative throughout the entire lifecycle of our infrastructure overhaul. The best civil engineering partner we've had in Bangladesh.",
    rating: 5,
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=60"
  },
  {
    name: "Jonathan Vance",
    role: "CHIEF ARCHITECT",
    company: "STRATOS STUDIOS",
    text: "Alam's approach to engineering is purely architectural. He doesn't just calculate load capacities; he designs structural foundations that scale with absolute safety and elegance.",
    rating: 5,
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=60"
  },
  {
    name: "Elena Rodriguez",
    role: "VP INFRASTRUCTURE",
    company: "GLOBAL TECH RESORTS",
    text: "Exceeded our expectations at every phase of the marine drive resort build. The localized knowledge and structural solutions provided saved us millions in long-term maintenance.",
    rating: 5,
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=60"
  }
];

const projects = [
  { title: "Bayline Villa", type: "RESIDENTIAL", location: "Cox's Bazar", year: "2024", img: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=600&q=70" },
  { title: "Vertex Corporate Tower", type: "COMMERCIAL", location: "Dhaka", year: "2023", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=70" },
  { title: "Marine Drive Resort", type: "HOSPITALITY", location: "Cox's Bazar", year: "2024", img: "https://images.unsplash.com/photo-1582610116397-ed860c29415c?auto=format&fit=crop&w=600&q=70" }
];

const services = [
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

// ── CountUp component ─────────────────────────────────────────────────────────
function CountUp({ end, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    let startTime, animationFrame;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const updateCount = (timestamp) => {
          if (!startTime) startTime = timestamp;
          const pct = Math.min((timestamp - startTime) / duration, 1);
          setCount(Math.floor(end * pct));
          if (pct < 1) animationFrame = requestAnimationFrame(updateCount);
        };
        animationFrame = requestAnimationFrame(updateCount);
        observer.disconnect();
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => { if (animationFrame) cancelAnimationFrame(animationFrame); observer.disconnect(); };
  }, [end, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
}

// ── Main component ────────────────────────────────────────────────────────────
export default function HomePage({ isIntroComplete }) {
  const { language } = useLanguage();
  const { isDark } = useTheme();
  const homeRef = useRef(null);
  const [testiIdx, setTestiIdx] = useState(0);

  // States for data
  const [loadingData, setLoadingData] = useState(true);
  const [displayProjects, setDisplayProjects] = useState([]);
  const [displayTestimonials, setDisplayTestimonials] = useState([]);
  const [displayServices, setDisplayServices] = useState([]);

  // Mock fetching / Real fetching attempt
  useEffect(() => {
    const loadAll = async () => {
      setLoadingData(true);
      try {
        // Try real API calls parallelly
        const [projectsRes, servicesRes, testimonialsRes] = await Promise.allSettled([
          fetchContent("projects", { limit: 6 }),
          fetchContent("services", { limit: 4 }),
          fetchContent("testimonials", { limit: 5 })
        ]);

        const mappedProjects = projectsRes.status === "fulfilled" && projectsRes.value.items?.length > 0
          ? projectsRes.value.items.map(p => ({
              ...p,
              title: language === "bn" ? (p.title?.bn || p.title?.en) : p.title?.en,
              category: p.category || "Engineering",
              img: p.featuredImage?.url || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
              year: p.tags?.[0] || "2024",
              location: p.category === "Civil" ? "Cox's Bazar" : "Bangladesh",
              status: "Completed"
            }))
          : projects; // Fallback to local data

        const mappedServices = servicesRes.status === "fulfilled" && servicesRes.value.items?.length > 0
          ? servicesRes.value.items.map(s => ({
              ...s,
              title: s.title?.en,
              titleBn: s.title?.bn,
              desc: s.summary?.en,
              descBn: s.summary?.bn,
              icon: s.tags?.[0] || "M12 2L2 7l10 5 10-5-10-5z"
            }))
          : services;

        const mappedTestimonials = testimonialsRes.status === "fulfilled" && testimonialsRes.value.items?.length > 0
          ? testimonialsRes.value.items.map(t => ({
              ...t,
              name: t.title?.en,
              role: t.summary?.en,
              content: t.body?.en,
              contentBn: t.body?.bn,
              img: t.featuredImage?.url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
            }))
          : testimonials;

        setDisplayProjects(mappedProjects);
        setDisplayServices(mappedServices);
        setDisplayTestimonials(mappedTestimonials);

        // Natural settle time
        await new Promise(r => setTimeout(r, 800));
      } catch (err) {
        console.warn("API load failed, using local mock data", err);
        setDisplayProjects(projects);
        setDisplayServices(services);
        setDisplayTestimonials(testimonials);
      } finally {
        setLoadingData(false);
      }
    };
    loadAll();
  }, [language]); // Reload when language changes to re-map if needed

  // Testimonial auto-advance
  useEffect(() => {
    const interval = setInterval(() => setTestiIdx((p) => (p + 1) % testimonials.length), 6000);
    return () => clearInterval(interval);
  }, []);
  const nextTesti = () => setTestiIdx((p) => (p + 1) % testimonials.length);
  const prevTesti = () => setTestiIdx((p) => (p === 0 ? testimonials.length - 1 : p - 1));

  // GSAP scroll reveals
  useEffect(() => {
    if (!isIntroComplete) return;

    let ctx = gsap.context(() => {
      // Hero Entrance
      gsap.from(".hero-content-reveal", {
        y: 60,
        opacity: 0,
        duration: 1.4,
        stagger: 0.15,
        ease: "power4.out",
        delay: 0.5
      });

      gsap.utils.toArray(".reveal-unit").forEach((elem) => {
        gsap.fromTo(elem,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: elem, start: "top 85%" }
          }
        );
      });
    }, homeRef);
    return () => ctx.revert();
  }, [isIntroComplete]);

  // Deferred 3D Model Loading
  const [loadModel, setLoadModel] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setLoadModel(true), 1500); // Wait 1.5s for initial layout stable
    return () => clearTimeout(timer);
  }, []);

  const hl = isDark ? "var(--highlight)" : "var(--highlight)";

  const scrollToFooter = () => {
    const footer = document.getElementById("main-footer");
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div ref={homeRef} style={{ background: "var(--bg)", color: "var(--text)" }} className="selection:bg-[var(--highlight-soft)] selection:text-[var(--text)]">
      <SeoHead
        title="Civil Engineer in Cox's Bazar | Engr. Alam Ashik"
        description="Premium civil engineering, structural design, and architectural consultancy services in Cox's Bazar, Bangladesh."
        path="/"
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[100vh] flex items-center pt-32 pb-20 overflow-hidden px-6 lg:px-10"
        style={{ background: "var(--bg)" }}
      >
        <div className="blueprint-overlay z-0" />

        <div className="mx-auto max-w-[1500px] grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center w-full relative z-10">
          {/* Left: Text */}
          <div className="relative flex flex-col items-center text-center lg:items-start lg:text-left">
            <div
              className="hero-content-reveal inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-xs font-bold tracking-[0.15em] uppercase"
              style={{ border: "1px solid var(--highlight-border)", background: "var(--highlight-soft)", color: "var(--highlight)" }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--highlight)" }} />
              {t("hero.available", language)}
            </div>

            <h1 className="hero-content-reveal text-5xl md:text-[80px] font-bold leading-[1.05] tracking-tight mb-8" style={{ color: "var(--text)" }}>
              {t("hero.title_part1", language)} <br />
              <span className="text-glow">{t("hero.title_highlight", language)}</span>
            </h1>

            <p className="hero-content-reveal text-lg md:text-xl max-w-xl leading-relaxed mb-12 font-medium" style={{ color: "var(--text-muted)" }}>
              {t("hero.subtitle", language)}
            </p>

            <div className="hero-content-reveal flex flex-col sm:flex-row gap-5">
              <Link
                to="/contact"
                className="group flex justify-center items-center gap-3 px-8 py-4 rounded font-bold text-sm tracking-wide transition-all hover:-translate-y-1"
                style={{ background: "var(--highlight)", color: "#0A0F1C", boxShadow: "0 0 0 transparent" }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 10px 30px var(--highlight-glow)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "0 0 0 transparent"}
              >
                {t("hero.cta_primary", language)}
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
              <Link
                to="/projects"
                className="flex justify-center items-center px-8 py-4 rounded font-bold text-sm tracking-wide transition-all"
                style={{ border: "1px solid var(--highlight-border)", color: "var(--text-muted)" }}
                onMouseEnter={e => { e.currentTarget.style.color = "var(--highlight)"; e.currentTarget.style.borderColor = "var(--highlight)"; e.currentTarget.style.background = "var(--highlight-soft)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "var(--highlight-border)"; e.currentTarget.style.background = "transparent"; }}
              >
                {t("hero.cta_secondary", language)}
              </Link>
            </div>
          </div>

          {/* Right: 3D Building Model (Deferred) */}
          <div className="relative hidden lg:block h-[620px] w-full rounded-2xl overflow-hidden"
            style={{ border: "1px solid var(--highlight-border)", boxShadow: "0 40px 100px -15px rgba(0,0,0,0.4), 0 0 40px var(--highlight-soft)" }}>

            {loadModel ? (
              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center" style={{ background: "var(--bg-accent)" }}>
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: "var(--highlight)", borderTopColor: "transparent" }} />
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--highlight)" }}>Initializing Engine...</p>
                  </div>
                </div>
              }>
                <ArchitecturalModel />
              </Suspense>
            ) : (
              <div className="w-full h-full transition-opacity duration-1000">
                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=40"
                  alt="Architecture Structural Model Preview"
                  className="w-full h-full object-cover opacity-50 grayscale"
                />
                <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[2px]">
                  <span className="text-[10px] uppercase font-bold tracking-[0.4em] opacity-40">System Stabilizing...</span>
                </div>
              </div>
            )}

            {/* Scan line overlay */}
            <div className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none animate-[scan_4s_ease-in-out_infinite]"
              style={{ background: "var(--highlight)", boxShadow: "0 0 12px var(--highlight)", opacity: "var(--scanner-opacity)" }} />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          className="hero-content-reveal absolute bottom-12 left-1/2 -translate-x-1/2 z-20 cursor-pointer hidden md:flex"
          onClick={scrollToFooter}
        >
          <div className="mouse-scroll">
            <div className="mouse">
              <div className="wheel" />
            </div>
            <span className="scroll-text">{language === "en" ? "Scroll to Footer" : "নিচে যান"}</span>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <section className="py-16 px-6 lg:px-10" style={{ background: "var(--bg)", borderBottom: "1px solid var(--highlight-border)" }}>
        <div className="mx-auto max-w-[1500px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { val: 150, suffix: "+", key: "stats.projects", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
              { val: 8, suffix: "+", key: "stats.experience", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
              { val: 99, suffix: "%", key: "stats.safety", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
              { val: 12, suffix: "", key: "stats.developments", icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2zM16 13a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2z" },
            ].map((stat, i) => (
              <div key={i} className="p-8 rounded-2xl flex flex-col justify-center transition-all duration-300 group card-bg"
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                <div className="mb-4 opacity-50 group-hover:opacity-100 transition-opacity" style={{ color: "var(--highlight)" }}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={stat.icon} /></svg>
                </div>
                <h3 className="text-4xl font-bold mb-2" style={{ color: "var(--text)" }}><CountUp end={stat.val} suffix={stat.suffix} /></h3>
                <span className="text-[13px] font-semibold" style={{ color: "var(--text-muted)" }}>{t(stat.key, language)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-10 relative" style={{ background: "var(--bg)" }}>
        <div className="mx-auto max-w-[1500px] relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="reveal-unit">
              <p className="text-[12px] tracking-[0.2em] font-bold uppercase mb-4" style={{ color: "var(--highlight)" }}>{t("services_section.eyebrow", language)}</p>
              <h2 className="text-4xl md:text-5xl font-bold" style={{ color: "var(--text)" }}>{t("services_section.title", language)}</h2>
            </div>
            <p className="text-[15px] max-w-lg md:text-right reveal-unit" style={{ color: "var(--text-muted)" }}>
              {t("services_section.subtitle", language)}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {loadingData ? (
              [1, 2, 3, 4].map((i) => <ServiceSkeleton key={i} />)
            ) : (
              displayServices.map((service, i) => (
                <div key={i} className="p-10 rounded-2xl reveal-unit group transition-all duration-300 relative overflow-hidden card-bg">
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full group-hover:scale-150 transition-transform duration-700" style={{ background: "var(--highlight-soft)" }} />
                  <div className="mb-8 relative z-10" style={{ color: "var(--highlight)" }}>{service.icon}</div>
                  <h3 className="font-bold text-xl mb-4 relative z-10" style={{ color: "var(--text)" }}>
                    {service.titleKey ? t(service.titleKey, language) : (language === "bn" ? service.titleBn : service.title)}
                  </h3>
                  <p className="text-[15px] mb-8 leading-relaxed min-h-[90px] relative z-10" style={{ color: "var(--text-muted)" }}>
                    {service.descKey ? t(service.descKey, language) : (language === "bn" ? service.descBn : service.desc)}
                  </p>
                  <Link to="/services" className="text-[12px] font-bold tracking-[0.1em] uppercase flex items-center gap-2 relative z-10 opacity-80 group-hover:opacity-100" style={{ color: "var(--highlight)" }}>
                    {t("services_section.explore", language)}
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── Featured Projects ─────────────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-10" style={{ background: "var(--bg-soft)", borderTop: "1px solid var(--highlight-border)", borderBottom: "1px solid var(--highlight-border)" }}>
        <div className="mx-auto max-w-[1500px]">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
            <h2 className="text-4xl md:text-5xl font-bold" style={{ color: "var(--text)" }}>{t("featured.title", language)}</h2>
            <Link to="/projects"
              className="px-8 py-3 rounded text-[12px] font-bold uppercase tracking-widest transition-all"
              style={{ border: "1px solid var(--highlight-border)", color: "var(--text-muted)" }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--highlight)"; e.currentTarget.style.color = "#0A0F1C"; e.currentTarget.style.borderColor = "var(--highlight)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "var(--highlight-border)"; }}
            >
              {t("featured.view_all", language)}
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loadingData ? (
              [1, 2, 3].map((i) => <ProjectSkeleton key={i} />)
            ) : (
              displayProjects.map((project, i) => (
                <div key={i} className="group relative rounded-2xl overflow-hidden aspect-[4/5] reveal-unit cursor-pointer shadow-2xl">
                  <img src={project.img} alt={project.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] via-[#0A0F1C]/40 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <span className="inline-block px-3 py-1 rounded-full text-[10px] tracking-widest font-bold uppercase mb-4"
                        style={{ background: "var(--highlight-soft)", color: "var(--highlight)", border: "1px solid var(--highlight-border)" }}>
                        {project.type}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{project.title}</h3>
                      <div className="flex items-center gap-2 text-[13px] text-white/70 font-medium">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {project.location} • {project.year}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── Client Reviews ────────────────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-10 overflow-hidden" style={{ background: "var(--bg)", borderBottom: "1px solid var(--highlight-border)" }}>
        <div className="mx-auto max-w-[1500px]">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6 reveal-unit">
            <div className="flex items-center gap-4">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--highlight)" }} />
              <span className="text-3xl md:text-4xl font-bold uppercase tracking-widest" style={{ color: "var(--text)" }}>
                {t("reviews.title", language)}
              </span>
            </div>
            <div className="flex gap-4">
              <button onClick={prevTesti}
                className="w-12 h-12 flex items-center justify-center rounded-full transition-all"
                style={{ border: "1px solid var(--highlight-border)", color: "var(--highlight)" }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--highlight)"; e.currentTarget.style.color = "#0A0F1C"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--highlight)"; }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button onClick={nextTesti}
                className="w-12 h-12 flex items-center justify-center rounded-full transition-all"
                style={{ border: "1px solid var(--highlight-border)", color: "var(--highlight)" }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--highlight)"; e.currentTarget.style.color = "#0A0F1C"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--highlight)"; }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden reveal-unit rounded-3xl" style={{ background: "var(--bg-card)", border: "1px solid var(--highlight-border)", boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}>
            <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${testiIdx * 100}%)` }}>
              {loadingData ? (
                <div className="min-w-full"><TestimonialSkeleton /></div>
              ) : (
                displayTestimonials.map((item, i) => (
                  <div key={i} className="min-w-full p-8 md:p-16 lg:p-24 flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1 text-center md:text-left">
                      <div className="flex justify-center md:justify-start gap-1 mb-8">
                        {[...Array(item.rating)].map((_, idx) => (
                          <svg key={idx} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: "var(--highlight)" }}>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.285-3.97a1 1 0 00-.364-1.118L2.05 9.397c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.97z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-[18px] md:text-[22px] leading-relaxed mb-8 italic" style={{ color: "var(--text-muted)" }}>
                        "{item.text}"
                      </p>
                      <div className="flex items-center justify-center md:justify-start gap-4">
                        <div className="p-1 rounded-full" style={{ border: "1px solid var(--highlight-border)", background: "var(--highlight-soft)" }}>
                          <img src={item.img} alt={item.name} className="w-16 h-16 rounded-full object-cover grayscale opacity-90" />
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-lg tracking-wide" style={{ color: "var(--text)" }}>{item.name}</div>
                          <div className="text-[10px] uppercase tracking-widest font-bold mt-1" style={{ color: "var(--highlight)" }}>{item.role} @ {item.company}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ─────────────────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-10" style={{ background: "var(--bg-soft)", borderTop: "1px solid var(--highlight-border)", borderBottom: "1px solid var(--highlight-border)" }}>
        <div className="mx-auto max-w-[1500px]">
          <div className="text-center mb-16 reveal-unit">
            <p className="text-[12px] tracking-[0.2em] font-bold uppercase mb-4" style={{ color: "var(--highlight)" }}>
              {t("process.eyebrow", language)}
            </p>
            <h2 className="text-4xl md:text-5xl font-bold" style={{ color: "var(--text)" }}>
              {t("process.title", language)}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
                title: t("process.step01_title", language),
                desc: t("process.step01_desc", language),
              },
              {
                step: "02",
                icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
                title: t("process.step02_title", language),
                desc: t("process.step02_desc", language),
              },
              {
                step: "03",
                icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
                title: t("process.step03_title", language),
                desc: t("process.step03_desc", language),
              },
              {
                step: "04",
                icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
                title: t("process.step04_title", language),
                desc: t("process.step04_desc", language),
              },
            ].map((item, i) => (
              <div key={i} className="relative p-8 rounded-2xl reveal-unit group transition-all duration-300 card-bg"
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                <div className="absolute top-6 right-6 text-[48px] font-black leading-none select-none"
                  style={{ color: "var(--highlight-soft)", fontVariantNumeric: "tabular-nums" }}>
                  {item.step}
                </div>
                <div className="mb-6 w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: "var(--highlight-soft)", color: "var(--highlight)" }}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ color: "var(--text)" }}>
                  {item.title}
                </h3>
                <p className="text-[14px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {item.desc}
                </p>
                {i < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-[1px]"
                    style={{ background: "var(--highlight-border)", zIndex: 10 }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Location / Contact Quick Strip ────────────────────────────────── */}
      <section className="py-20 px-6 lg:px-10" style={{ background: "var(--bg)" }}>
        <div className="mx-auto max-w-[1500px]">
          <div className="grid lg:grid-cols-3 gap-6 reveal-unit">
            {/* Location */}
            <div className="p-8 rounded-2xl flex items-start gap-6 card-bg">
              <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center"
                style={{ background: "var(--highlight-soft)", color: "var(--highlight)" }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest font-bold mb-1" style={{ color: "var(--highlight)" }}>
                  {t("location_strip.location_title", language)}
                </p>
                <p className="font-bold text-[16px]" style={{ color: "var(--text)" }}>{t("location_strip.location_value", language)}</p>
                <p className="text-[13px] mt-1" style={{ color: "var(--text-muted)" }}>
                  {t("location_strip.location_desc", language)}
                </p>
              </div>
            </div>

            {/* Working Hours */}
            <div className="p-8 rounded-2xl flex items-start gap-6 card-bg">
              <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center"
                style={{ background: "var(--highlight-soft)", color: "var(--highlight)" }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest font-bold mb-1" style={{ color: "var(--highlight)" }}>
                  {t("location_strip.hours_title", language)}
                </p>
                <p className="font-bold text-[16px]" style={{ color: "var(--text)" }}>
                  {t("location_strip.hours_value", language)}
                </p>
                <p className="text-[13px] mt-1" style={{ color: "var(--text-muted)" }}>
                  {t("location_strip.hours_desc", language)}
                </p>
              </div>
            </div>

            {/* Quick Contact */}
            <div className="p-8 rounded-2xl flex items-start gap-6 group cursor-pointer transition-all duration-300 card-bg"
              onClick={() => window.location.href = "/contact"}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--highlight)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--highlight-border)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center transition-all"
                style={{ background: "var(--highlight)", color: "#0A0F1C" }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest font-bold mb-1" style={{ color: "var(--highlight)" }}>
                  {t("location_strip.cta_title", language)}
                </p>
                <p className="font-bold text-[16px] group-hover:underline transition-all" style={{ color: "var(--text)" }}>
                  {t("location_strip.cta_value", language)}
                </p>
                <p className="text-[13px] mt-1" style={{ color: "var(--text-muted)" }}>
                  {t("location_strip.cta_desc", language)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Partners ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-10 overflow-hidden" style={{ background: "var(--bg-soft)", borderTop: "1px solid var(--highlight-border)" }}>
        <div className="mx-auto max-w-[1500px]">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.4em] text-center mb-16 reveal-unit" style={{ color: "var(--text-faint)" }}>
            {t("partners.title", language)}
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-700 reveal-unit">
            {/* Local Authorities & Technical Symbols */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full border-2 border-dashed flex items-center justify-center" style={{ borderColor: 'var(--text-faint)' }}>
                <span className="font-bold text-xs">IEB</span>
              </div>
              <span className="text-[9px] font-bold tracking-widest">MEMBER IEB</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-lg border-2 border-dashed flex items-center justify-center" style={{ borderColor: 'var(--text-faint)' }}>
                <span className="font-bold text-xs uppercase">Cox</span>
              </div>
              <span className="text-[9px] font-bold tracking-widest">MUNICIPALITY</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full border-2 border-dashed flex items-center justify-center" style={{ borderColor: 'var(--text-faint)' }}>
                <span className="font-bold text-xs uppercase">BIM</span>
              </div>
              <span className="text-[9px] font-bold tracking-widest">CERTIFIED</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-lg border-2 border-dashed flex items-center justify-center" style={{ borderColor: 'var(--text-faint)' }}>
                <span className="font-bold text-xs uppercase">BSTI</span>
              </div>
              <span className="text-[9px] font-bold tracking-widest">COMPLIANT</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-32 px-6 lg:px-10 relative overflow-hidden" style={{ background: "var(--bg)" }}>
        <div className="max-w-[1200px] mx-auto rounded-3xl relative p-12 md:p-24 text-center reveal-unit"
          style={{ background: "var(--bg-card)", border: "1px solid var(--highlight-border)", boxShadow: "0 30px 60px rgba(0,0,0,0.15)" }}>
          <div className="relative z-10 w-full max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tight" style={{ color: "var(--text)" }}>
              {t("cta.title_part1", language)} <br />
              <span className="text-glow">{t("cta.title_highlight", language)}</span>
            </h2>
            <p className="text-lg mb-12 leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {t("cta.subtitle", language)}
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-lg font-bold text-[15px] transition-all cta-pulse"
              style={{ background: "var(--highlight)", color: "#0A0F1C" }}
              onMouseEnter={e => { e.currentTarget.style.background = isDark ? "#FFFFFF" : "#0F172A"; e.currentTarget.style.color = isDark ? "#0A0F1C" : "#FFFFFF"; e.currentTarget.style.transform = "scale(1.05)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--highlight)"; e.currentTarget.style.color = "#0A0F1C"; e.currentTarget.style.transform = "scale(1)"; }}
            >
              {t("cta.button", language)}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes scan {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(600px); }
        }
      `}} />
    </div>
  );
}
