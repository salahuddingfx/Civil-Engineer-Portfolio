import { useRef, useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../context/LanguageContext";
import { t } from "../lib/translations";
import SeoHead from "../components/SeoHead";
import { fetchContent } from "../lib/api";
import { TestimonialSkeleton } from "../components/Skeleton";

gsap.registerPlugin(ScrollTrigger);

const defaultTestimonials = [
  {
    img: "/images/hero-concept.png"
  },
  {
    name: "Marcus Thorne",
    role: "FOUNDER",
    company: "APEX HORIZON BUILDERS",
    text: "Reliable, precise, and highly communicative throughout the entire lifecycle of our infrastructure overhaul. The best civil engineering partner we've had in Bangladesh.",
    rating: 5,
    img: "/images/mission-concept.png"
  },
  {
    name: "Jonathan Vance",
    role: "CHIEF ARCHITECT",
    company: "STRATOS STUDIOS",
    text: "Alam's approach to engineering is purely architectural. He doesn't just calculate load capacities; he designs structural foundations that scale with absolute safety and elegance.",
    rating: 5,
    img: "/images/hero-concept.png"
  },
  {
    name: "Elena Rodriguez",
    role: "VP INFRASTRUCTURE",
    company: "GLOBAL TECH RESORTS",
    text: "Exceeded our expectations at every phase of the marine drive resort build. The localized knowledge and structural solutions provided saved us millions in long-term maintenance.",
    rating: 5,
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80"
  }
];

export default function TestimonialsPage() {
  const { language } = useLanguage();
  const { isDark } = useTheme();
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const response = await fetchContent("testimonials", { limit: 50 });
        if (response.items && response.items.length > 0) {
           const mapped = response.items.map(t => ({
              name: t.title?.en || "Client",
              role: t.summary?.en || "Executive",
              company: t.category || "Corporate",
              text: language === "bn" ? (t.body?.bn || t.body?.en) : (t.body?.en),
              rating: t.rating || 5,
              img: t.featuredImage?.url || "/images/hero-concept.png"
           }));
           setTestimonials(mapped);
        } else {
           setTestimonials(defaultTestimonials);
        }
      } catch (err) {
        setTestimonials(defaultTestimonials);
      } finally {
        setLoading(false);
      }
    }
    loadTestimonials();
  }, [language]);

  useEffect(() => {
    if (loading) return;
    let ctx = gsap.context(() => {
      gsap.fromTo(".reveal-unit", 
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".reveal-unit",
            start: "top 85%",
          }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [loading]);

  // Auto transition carousel logic
  useEffect(() => {
    if (testimonials.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current === testimonials.length - 1 ? 0 : current + 1));
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials]);

  return (
    <div ref={containerRef} style={{ background: "var(--bg)", color: "var(--text)" }} className="min-h-screen">
      <SeoHead
        title="Engr Alam Ashik | Civil Engineering & Consultancy | Reviews"
        description="Read what global leaders and local developers say about our premium civil engineering and architectural consultancy services across Bangladesh."
        path="/testimonials"
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6 lg:px-10 text-center mx-auto max-w-[1500px]">
         <div className="reveal-unit mx-auto max-w-[900px]">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(25,210,255,0.2)] bg-[#19D2FF]/5 mb-6 text-[#19D2FF] text-[10px] font-bold tracking-[0.2em] uppercase shadow-[0_0_15px_rgba(25,210,255,0.1)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#19D2FF]"></span>
              Trusted by Leaders
            </span>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-8" style={{ color: "var(--text)" }}>
              {t("testimonials_page.title_part1", language)} <span className="text-[#19D2FF] text-glow">{t("testimonials_page.title_highlight", language)}</span>
            </h1>
            <p className="text-lg max-w-2xl mx-auto leading-relaxed font-medium" style={{ color: "var(--text-muted)" }}>
              {t("testimonials_page.subtitle", language)}
            </p>
         </div>
      </section>

      {/* Auto-Rotating Premium Carousel */}
      <section className="reveal-unit py-12 px-6 lg:px-10 mx-auto max-w-[1500px]">
         <div className="relative rounded-3xl overflow-hidden p-10 md:p-20"
           style={{ 
             background: "var(--bg-card)", 
             border: "1px solid var(--highlight-border)",
             boxShadow: isDark ? "0 30px 60px rgba(10, 15, 28, 0.5)" : "0 20px 40px rgba(0,0,0,0.05)" 
           }}>
            {/* Ambient Background Glow */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full ${isDark ? "bg-[#19D2FF]/5" : "bg-[#19D2FF]/3"} rounded-full blur-[120px] pointer-events-none`}></div>
            
            {loading || testimonials.length === 0 ? (
               <div className="relative z-10 min-h-[300px] flex items-center justify-center">
                  <TestimonialSkeleton />
               </div>
            ) : (
            <>
            {/* Big quote icon */}
            <div className="absolute top-10 right-10 md:top-20 md:right-20 text-[#19D2FF] opacity-10 pointer-events-none">
               <svg className="w-32 h-32 md:w-48 md:h-48" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C15.4647 8 15.017 8.44772 15.017 9V12C15.017 12.5523 14.5693 13 14.017 13H12.017V21H14.017ZM6.017 21L6.017 18C6.017 16.8954 6.91243 16 8.017 16H11.017C11.5693 16 12.017 15.5523 12.017 15V9C12.017 8.44772 11.5693 8 11.017 8H8.017C7.46472 8 7.017 8.44772 7.017 9V12C7.017 12.5523 6.56932 13 6.017 13H4.017V21H6.017Z" />
               </svg>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
               <div className="flex gap-2 mb-8">
                  {[...Array(testimonials[activeIndex].rating)].map((_, idx) => (
                     <svg key={idx} className="w-6 h-6 text-[#19D2FF] animate-[pulse_2s_ease-in-out_infinite]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.285-3.97a1 1 0 00-.364-1.118L2.05 9.397c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.97z"/>
                     </svg>
                  ))}
               </div>
               
               <p className="text-2xl md:text-3xl leading-relaxed mb-12 font-medium max-w-4xl transition-all duration-500 min-h-[160px] md:min-h-[120px]"
                 style={{ color: "var(--text)" }}>
                 "{testimonials[activeIndex].text}"
               </p>

               <div className="flex flex-col items-center gap-4 transition-all duration-500">
                  <div className="relative w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-[#19D2FF] to-transparent">
                     <img 
                        src={testimonials[activeIndex].img} 
                        alt={testimonials[activeIndex].name} 
                        className="w-full h-full rounded-full object-cover border-4 border-[#111827]"
                        decoding="async"
                     />
                  </div>
                  <div>
                     <h2 className="font-bold text-xl mb-1" style={{ color: "var(--text)" }}>{testimonials[activeIndex].name}</h2>
                     <p className="text-[11px] text-[#19D2FF] font-bold tracking-[0.15em] uppercase">
                        {testimonials[activeIndex].role} <span style={{ color: "var(--text-muted)" }}>@ {testimonials[activeIndex].company}</span>
                     </p>
                  </div>
               </div>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-3 mt-16 relative z-10">
               {testimonials.map((_, idx) => (
                  <button 
                     key={idx}
                     onClick={() => setActiveIndex(idx)}
                     className={`transition-all duration-300 rounded-full ${activeIndex === idx ? "w-10 h-2 bg-[#19D2FF] shadow-[0_0_10px_rgba(25,210,255,0.5)]" : "w-2 h-2 bg-[#CBD5E1]/30 hover:bg-[#CBD5E1]/60"}`}
                     aria-label={`Go to testimonial ${idx + 1}`}
                  />
               ))}
            </div>
            </>
            )}
         </div>
      </section>

      {/* Grid of All (Optional context) */}
      <section className="reveal-unit py-16 px-6 lg:px-10 mx-auto max-w-[1500px]">
         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((item, i) => (
               <div key={i} className="p-8 rounded-2xl transition-all flex flex-col justify-between card-bg">
                  <div>
                     <div className="flex gap-1.5 mb-4">
                        {[...Array(item.rating)].map((_, idx) => (
                          <svg key={idx} className="w-4 h-4 text-[#19D2FF]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.285-3.97a1 1 0 00-.364-1.118L2.05 9.397c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.97z"/></svg>
                        ))}
                     </div>
                     <p className="text-[14px] leading-relaxed mb-8" style={{ color: "var(--text-muted)" }}>
                       "{item.text}"
                     </p>
                  </div>
                  <div className="flex items-center gap-4 pt-4 border-t" style={{ borderTopColor: "var(--highlight-border)" }}>
                     <img src={item.img} alt={item.name} className="w-10 h-10 rounded-full object-cover grayscale opacity-80" />
                     <div>
                        <h3 className="font-bold text-sm" style={{ color: "var(--text)" }}>{item.name}</h3>
                        <p className="text-[9px] text-[#19D2FF] font-bold tracking-widest uppercase">{item.company}</p>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-10" style={{ background: "var(--bg)" }}>
         <div className="max-w-[1500px] mx-auto rounded-3xl relative p-16 md:p-24 text-center reveal-unit card-bg shadow-premium">
            <div className={`absolute inset-0 ${isDark ? "bg-[#19D2FF]/5" : "bg-[#19D2FF]/2"} rounded-3xl pointer-events-none`}></div>
            
            <div className="relative z-10 w-full max-w-3xl mx-auto">
               <h2 className="text-4xl md:text-5xl font-bold mb-6 truncate-tight" style={{ color: "var(--text)" }}>
                  {t("testimonials_page.cta_title_part1", language)} <span className="text-[#19D2FF] text-glow">{t("testimonials_page.cta_title_highlight", language)}</span>
               </h2>
               <p className="mb-12 text-lg leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {t("testimonials_page.cta_subtitle", language)}
               </p>
               <div className="flex justify-center">
                  <Link 
                    to="/contact" 
                    className="flex items-center justify-center gap-3 px-10 py-5 rounded bg-[#19D2FF] text-[#0A0F1C] text-[15px] font-bold hover:bg-white hover:scale-105 transition-all shadow-[0_10px_30px_rgba(25,210,255,0.25)] cta-pulse tracking-wide"
                  >
                    {t("testimonials_page.cta_button", language)}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                  </Link>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
