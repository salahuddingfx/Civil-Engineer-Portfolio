import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../context/LanguageContext";
import SeoHead from "../components/SeoHead";
import { fetchContent } from "../lib/api";
import { Skeleton } from "../components/Skeleton";
import { Mail, Zap, Clock, Users, ChevronRight } from "lucide-react";
import { Linkedin, Facebook } from "../components/BrandIcons";
import LucideIcon from "../components/LucideIcon";

gsap.registerPlugin(ScrollTrigger);

// ── Tilt Skill Card ────────────────────────────────────────────────────────────
function SkillCard({ skill, language }) {
  return (
    <div
      className="p-8 rounded-3xl reveal-unit transition-all duration-500 group"
      style={{
        background: "var(--bg-card)",
        border: `1px solid var(--highlight-border)`,
      }}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
           <h3 className="font-black text-[18px] uppercase italic tracking-tight" style={{ color: "var(--text)" }}>
             {language === "bn" ? (skill.title?.bn || skill.title?.en) : skill.title?.en}
           </h3>
            <div className="mt-4 flex items-center gap-3">
               <div className="p-2 rounded-lg bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                 <LucideIcon name={skill.icon || "Zap"} size={16} />
               </div>
               <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 italic">
                 {skill.category || "TECHNOLOGY"}
               </p>
            </div>
        </div>
        <div className="text-3xl font-black italic opacity-20 group-hover:opacity-100 transition-opacity" style={{ color: "var(--highlight)" }}>
           {skill.proficiency}%
        </div>
      </div>

      <div className="relative h-2 w-full bg-white/[0.03] rounded-full overflow-hidden border border-white/[0.05]">
         <div 
           className="absolute top-0 left-0 h-full transition-all duration-1000 ease-out flex items-center justify-end pr-1"
           style={{ width: `${skill.proficiency}%`, background: "var(--highlight)", boxShadow: "0 0 15px var(--highlight-soft)" }}
         >
           <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
         </div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  const { language } = useLanguage();
  const containerRef = useRef(null);
  
  // Data States
  const [loading, setLoading] = useState(true);
  const [bio, setBio] = useState(null);
  const [skills, setSkills] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [team, setTeam] = useState([]);

  useEffect(() => {
    async function loadAboutData() {
      setLoading(true);
      try {
        const [bioRes, skillsRes, timelineRes, teamRes] = await Promise.all([
          fetchContent("about", { limit: 1 }),
          fetchContent("skills", { sort: "order" }),
          fetchContent("timelineEntries", { sort: "order" }),
          fetchContent("teamMembers", { sort: "order" })
        ]);

        setBio(bioRes.items?.[0] || null);
        setSkills(skillsRes.items || []);
        setTimeline(timelineRes.items || []);
        setTeam(teamRes.items || []);
      } catch (err) {
        console.warn("Failed to sync about data.");
      } finally {
        setLoading(false);
      }
    }
    loadAboutData();
  }, []);

  useEffect(() => {
    if (loading) return;
    
    let ctx = gsap.context(() => {
      // General section reveal
      gsap.utils.toArray(".reveal-unit").forEach((elem) => {
        gsap.fromTo(elem,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
            scrollTrigger: { trigger: elem, start: "top 85%" } }
        );
      });

      // Timeline Progress
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

      const timelineItems = gsap.utils.toArray(".timeline-item");
      timelineItems.forEach((item, i) => {
        const dot = item.querySelector(".timeline-dot");
        const card = item.querySelector(".timeline-card");
        const isLeft = i % 2 === 0;

        if (dot) gsap.fromTo(dot, { scale: 0, opacity: 0 }, { 
          scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)",
          scrollTrigger: { trigger: dot, start: "top 75%" } 
        });

        if (card) gsap.fromTo(card, { opacity: 0, x: isLeft ? -50 : 50 }, { 
          opacity: 1, x: 0, duration: 1, ease: "power4.out",
          scrollTrigger: { trigger: card, start: "top 80%" } 
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, [loading]);

  if (loading) return (
    <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center">
       <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-400">Syncing Identity Records...</p>
       </div>
    </div>
  );

  return (
    <div ref={containerRef} style={{ background: "var(--bg)", color: "var(--text)" }} className="min-h-screen selection:bg-cyan-400 selection:text-black">
      <SeoHead
        title="About Engr. Alam Ashik | Structural Engineering Identity"
        description="Learn about the legacy, expertise, and precision engineering workflow of Engr. Alam Ashik."
        path="/about"
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center pt-32 px-6 lg:px-10 overflow-hidden">
        <div className="blueprint-overlay opacity-20" />
        <div className="mx-auto max-w-[1500px] w-full grid lg:grid-cols-2 items-center gap-24 relative z-10">
          <div className="reveal-unit">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-10 text-[9px] uppercase tracking-[0.4em] font-black"
              style={{ border: "1px solid var(--highlight-border)", background: "var(--highlight-soft)", color: "var(--highlight)" }}>
              <Zap size={10} className="animate-pulse" />
              {language === "en" ? "IDENTITY ESTABLISHED 2013" : "প্রতিষ্ঠা ২০১৩"}
            </span>
            <h1 className="text-6xl md:text-8xl font-black leading-[0.95] tracking-tight mb-10 italic uppercase" style={{ color: "var(--text)" }}>
              {language === "en" ? <>CRAFTING <br /> THE <span className="text-glow">FUTURE</span></> : <>ভবিষ্যতের <span className="text-glow">নকশা</span></>}
            </h1>
            <p className="text-lg md:text-xl max-w-xl leading-relaxed mb-12 font-medium opacity-60" style={{ color: "var(--text-muted)" }}>
              {language === "bn" ? (bio?.summary?.bn || bio?.summary?.en) : bio?.summary?.en}
            </p>
            <div className="flex gap-16">
              {[
                { val: "250+", label: language === "en" ? "ASSETS DEPLOYED" : "প্রকল্প" },
                { val: "11+",  label: language === "en" ? "CYCLE EXPERIENCE" : "অভিজ্ঞতা" },
                { val: "100%", label: language === "en" ? "INTEGRITY INDEX" : "নির্ভরযোগ্যতা" },
              ].map(({ val, label }, i) => (
                <div key={i} className="group">
                  <p className="text-5xl font-black mb-2 transition-transform group-hover:scale-110" style={{ color: "var(--text)" }}>{val}</p>
                  <p className="text-[9px] uppercase tracking-[0.3em] font-black opacity-40 group-hover:opacity-100" style={{ color: "var(--highlight)" }}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative h-[650px] w-full rounded-[60px] overflow-hidden reveal-unit shadow-2xl"
            style={{ border: "1px solid var(--highlight-border)" }}>
            <img 
              src={bio?.featuredImage?.url || "https://images.unsplash.com/photo-1503387762-592dea58ef21"} 
              alt="Engineering Identity" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute bottom-12 left-12 right-12 p-8 md:p-10 rounded-[40px] backdrop-blur-2xl border border-white/10 bg-white/[0.03] shadow-2xl transition-transform hover:scale-[1.02] duration-700">
               <h3 className="text-2xl md:text-3xl font-black text-white italic uppercase mb-2 tracking-tighter">
                 {language === "bn" ? (bio?.title?.bn || bio?.title?.en) : bio?.title?.en || "Engr. Alam Ashik"}
               </h3>
               <p className="text-[10px] md:text-xs font-black text-cyan-400 uppercase tracking-[0.4em] italic opacity-80">
                 {language === "bn" ? (bio?.summary?.bn || bio?.summary?.en) : bio?.summary?.en || "Principal Structural Consultant"}
               </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Biography ────────────────────────────────────────────────────── */}
      <section className="py-32 px-6 lg:px-10" style={{ borderTop: "1px solid var(--highlight-border)", background: "var(--bg-soft)" }}>
        <div className="mx-auto max-w-[1500px] grid lg:grid-cols-[1.1fr_0.9fr] items-center gap-24">
          <div className="reveal-unit space-y-12">
            <div>
              <p className="text-[10px] tracking-[0.4em] font-black uppercase mb-4" style={{ color: "var(--highlight)" }}>
                {language === "en" ? "LEGACY BIOGRAPHY" : "জীবনী"}
              </p>
              <h2 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter" style={{ color: "var(--text)" }}>
                {language === "bn" ? (bio?.title?.bn || bio?.title?.en) : bio?.title?.en}
              </h2>
            </div>
            
            <div className="space-y-8 max-w-2xl">
              <p className="text-xl md:text-2xl font-medium italic leading-relaxed opacity-80" style={{ color: "var(--text-muted)" }}>
                 "{language === "bn" ? (bio?.body?.bn || bio?.body?.en) : bio?.body?.en}"
              </p>
            </div>
            
            <Link to="/contact"
              className="inline-flex items-center gap-4 px-10 py-5 rounded-2xl font-black text-[12px] uppercase tracking-[0.3em] transition-all hover:gap-6 shadow-xl"
              style={{ background: "var(--highlight)", color: "#0A0F1C" }}
            >
              {language === "en" ? "ESTABLISH CONNECTION" : "যোগাযোগ করুন"}
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="reveal-unit relative group">
             <div className="absolute -inset-4 bg-cyan-400/5 rounded-[56px] blur-3xl group-hover:bg-cyan-400/10 transition-all" />
             <div className="relative h-[550px] w-full rounded-[48px] overflow-hidden border-2 border-white/5 shadow-2xl">
                <img src={bio?.featuredImage?.url || "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7"} className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 transition-all duration-1000" alt="Principal" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute bottom-8 left-8 right-8 p-6 rounded-3xl backdrop-blur-xl border border-white/10 bg-white/[0.02] opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700">
                   <p className="text-[10px] font-black text-white uppercase tracking-[0.4em] italic mb-1">Structural Authority</p>
                   <p className="text-[8px] font-bold text-cyan-400/60 uppercase tracking-widest">Digital Asset: {bio?.title?.en || "ALAM ASHIK"}</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* ── Skills ────────────────────────────────────────────────────────── */}
      <section className="py-32 px-6 lg:px-10" style={{ background: "var(--bg)" }}>
        <div className="mx-auto max-w-[1500px]">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-10 reveal-unit">
            <div>
              <p className="text-[10px] tracking-[0.5em] font-black uppercase mb-6" style={{ color: "var(--highlight)" }}>{language === "en" ? "TECHNICAL PROFICIENCIES" : "প্রযুক্তিগত দক্ষতা"}</p>
              <h2 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter" style={{ color: "var(--text)" }}>{language === "en" ? "SKILLS & EXPERTISE" : "দক্ষতা এবং অভিজ্ঞতা"}</h2>
            </div>
            <p className="text-[14px] max-w-md md:text-right font-medium opacity-60 italic" style={{ color: "var(--text-muted)" }}>
              Optimizing structural output through advanced analysis and algorithmic precision across multiple software environments.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((skill, i) => (
              <SkillCard key={i} skill={skill} language={language} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ──────────────────────────────────────────────────────── */}
      <section className="py-32 px-6 lg:px-10 overflow-hidden" style={{ background: "var(--bg-soft)", borderTop: "1px solid var(--highlight-border)" }}>
        <div className="mx-auto max-w-[1500px]">
            <div className="mb-20 reveal-unit">
               <p className="text-[10px] tracking-[0.5em] font-black uppercase mb-6" style={{ color: "var(--highlight)" }}>{language === "en" ? "CHRONOLOGICAL LOG" : "কার্যক্রমের ধারাবাহিকতা"}</p>
               <h2 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter" style={{ color: "var(--text)" }}>{language === "en" ? "CAREER TIMELINE" : "ক্যারিয়ার টাইমলাইন"}</h2>
            </div>

          <div className="timeline-container relative max-w-5xl mx-auto py-10">
            <div className="absolute left-[50%] top-0 h-full w-[1px] hidden md:block" style={{ background: "var(--highlight-border)" }} />
            <div className="timeline-line-progress absolute left-[50%] top-0 h-full w-[2px] hidden md:block origin-top" 
              style={{ background: "var(--highlight)", boxShadow: "0 0 20px var(--highlight-soft)", zIndex: 5 }} />

            <div className="space-y-40">
              {timeline.map((item, i) => (
                <div key={i} className={`timeline-item relative flex flex-col md:flex-row items-center gap-16 ${i % 2 !== 0 ? "md:flex-row-reverse" : ""}`}>
                  <div className="timeline-dot absolute left-1/2 top-14 z-10 w-4 h-4 rounded-full -translate-x-1/2 hidden md:block"
                    style={{ background: "var(--highlight)", border: "4px solid var(--bg)", boxShadow: "0 0 20px var(--highlight-soft)" }} />
                  
                  <div className="md:w-1/2">
                    <div className="timeline-card p-12 rounded-[40px] backdrop-blur-xl transition-all hover:scale-[1.02] duration-500"
                      style={{ background: "var(--bg-card)", border: "1px solid var(--highlight-border)", boxShadow: "0 20px 50px rgba(0,0,0,0.2)" }}>
                      <p className="text-4xl font-black mb-6 italic" style={{ color: "var(--highlight)" }}>{item.year}</p>
                      <h3 className="text-2xl font-black mb-4 uppercase italic tracking-tight" style={{ color: "var(--text)" }}>
                        {language === "bn" ? (item.title?.bn || item.title?.en) : item.title?.en}
                      </h3>
                      <p className="text-sm leading-relaxed font-medium opacity-60 italic" style={{ color: "var(--text-muted)" }}>
                        {language === "bn" ? (item.description?.bn || item.description?.en) : item.description?.en}
                      </p>
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
      <section className="py-32 px-6 lg:px-10" style={{ background: "var(--bg)", borderTop: "1px solid var(--highlight-border)" }}>
        <div className="mx-auto max-w-[1500px]">
          <div className="flex justify-between items-end mb-20 reveal-unit">
            <div>
              <p className="text-[10px] tracking-[0.5em] font-black uppercase mb-6" style={{ color: "var(--highlight)" }}>{language === "en" ? "PERSONNEL REGISTRY" : "কর্মী তালিকা"}</p>
              <h2 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter" style={{ color: "var(--text)" }}>{language === "en" ? "STUDIO TEAM" : "স্টুডিও টিম"}</h2>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {team.map((member, i) => (
              <div key={i} className="reveal-unit group relative rounded-[40px] overflow-hidden transition-all duration-500 bg-[#0d0f1a]/40 border border-white/5 border-b-cyan-400/20">
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img src={member.image?.url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"} alt={member.name}
                    className="w-full h-full object-cover transition-all duration-1000 grayscale group-hover:grayscale-0 group-hover:scale-110"
                  />
                  
                  {/* Team Overlay Meta */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  <div className="absolute inset-0 flex flex-col justify-end p-8 translate-y-4 group-hover:translate-y-0 transition-all duration-700">
                     <div className="mb-4 space-y-2">
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tight">{member.name}</h3>
                        <p className="text-[9px] font-black text-cyan-400 uppercase tracking-[0.4em]">{member.designation?.en}</p>
                     </div>
                     
                     <div className="flex items-center justify-between pt-4 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                       <a href={member.socialLinks?.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/10 text-white hover:bg-cyan-400 hover:text-black transition-all shadow-xl"><Linkedin size={16} /></a>
                       <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest italic">Core Personnel</span>
                     </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 pt-10 border-t border-white/5 flex flex-col items-center">
            <p className="text-[8px] font-black text-slate-700 uppercase tracking-[0.5em] mb-4">{language === "en" ? "LOOKING FOR OPPORTUNITIES?" : "সুযোগ খুঁজছেন?"}</p>
            <button className="text-[11px] font-black text-cyan-400 hover:text-white transition-colors uppercase tracking-[0.3em] flex items-center gap-3 group/join">
               {language === "en" ? "JOIN OUR TEAM" : "আমাদের টিমে যোগ দিন"}
               <ChevronRight size={14} className="group-hover/join:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer Branding Overlay */}
      <div className="py-20 px-10 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-10 opacity-40 hover:opacity-100 transition-opacity">
         <div className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">
            ENGR. ALAM ASHIK // <span className="text-cyan-400">STRUCTURAL INTEGRITY</span>
         </div>
         <div className="text-[8px] font-bold text-slate-700 uppercase tracking-widest text-center">
            {new Date().getFullYear()} © SYSTEM UPDATES AT 500MS // ARCHITECTURAL CONSULTANCY PROTOCOL
         </div>
      </div>
    </div>
  );
}
