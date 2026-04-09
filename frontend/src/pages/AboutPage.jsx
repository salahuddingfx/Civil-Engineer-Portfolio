import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../context/LanguageContext";
import SeoHead from "../components/SeoHead";
import { fetchContent } from "../lib/api";
import { Mail, Zap, Clock, Users, ChevronRight, MessageSquare, Quote } from "lucide-react";
import { Linkedin } from "../components/BrandIcons";
import LucideIcon from "../components/LucideIcon";

gsap.registerPlugin(ScrollTrigger);

function SkillCard({ skill, language }) {
  return (
    <div
      className="p-6 md:p-8 rounded-3xl reveal-unit transition-all duration-500 group"
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
               <div className="p-2 rounded-lg bg-[var(--highlight-soft)] text-[var(--highlight)] border border-[var(--highlight-border)]">
                 <LucideIcon name={skill.icon || "Zap"} size={16} />
               </div>
               <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 italic" style={{ color: "var(--text-faint)" }}>
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
      gsap.utils.toArray(".reveal-unit").forEach((elem) => {
        gsap.fromTo(elem,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
            scrollTrigger: { trigger: elem, start: "top 85%" } }
        );
      });

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
    }, containerRef);
    return () => ctx.revert();
  }, [loading]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center transition-colors duration-500" style={{ background: "var(--bg)" }}>
       <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-[var(--highlight)] border-t-transparent rounded-full animate-spin mx-auto" style={{ boxShadow: "0 0 15px var(--highlight-glow)" }} />
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--highlight)] animate-pulse">Syncing Identity Records...</p>
       </div>
    </div>
  );

  return (
    <div ref={containerRef} className="min-h-screen selection:bg-[var(--highlight)] selection:text-black font-body transition-colors duration-500" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <SeoHead
        title="About Engr. Alam Ashik | Civil Engineer & Structural Consultant"
        description="Redefining technical consultancy by merging architectural beauty with structural integrity."
        path="/about"
      />

      {/* ── 1. MISSION HERO ────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 lg:pt-48 px-6 lg:px-10 overflow-hidden">
        <div className="blueprint-overlay opacity-10 blueprint-scroll" />
        
        <div className="mx-auto max-w-[1500px] grid lg:grid-cols-2 lg:items-center gap-20 relative z-10">
          {/* Image & Mission Badge */}
          <div className="relative group reveal-unit order-2 lg:order-1">
             <div className="relative aspect-square rounded-[40px] overflow-hidden border border-white/5 shadow-2xl">
                {/* FIXED IMAGE FROM PUBLIC FOLDER AS REQUESTED */}
                <img 
                   src="/images/mission-concept.png" 
                  className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                  alt="Mission Backbone"
                />
                <div className="absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-60" style={{ backgroundImage: "linear-gradient(to top, var(--bg), transparent)" }} />
             </div>

             {/* SINCE 2013 Badge */}
             <div className="absolute bottom-10 left-10 p-8 rounded-[32px] mission-card max-w-sm transform -translate-x-4 group-hover:translate-x-0 transition-transform duration-700">
                <p className="text-[9px] font-black tracking-[0.3em] text-[var(--highlight)] mb-3 uppercase italic">SINCE 2013</p>
                <p className="text-xs font-black leading-relaxed uppercase border-l-2 border-[var(--highlight)] pl-4 italic" style={{ color: "var(--text)" }}>
                   {language === "en" 
                     ? "Engineering excellence through precision and architectural foresight." 
                     : "নির্ভুলতা এবং স্থাপত্য দূরদর্শিতার মাধ্যমে প্রকৌশল শ্রেষ্ঠত্ব।"}
                </p>
             </div>
          </div>

          {/* Text Content */}
          <div className="reveal-unit order-1 lg:order-2 space-y-10">
             <div>
                <span className="stats-label mb-6 block font-display">Mission Statement</span>
                <h1 className="text-5xl sm:text-7xl md:text-8xl font-black leading-[0.9] tracking-tighter uppercase mb-8 font-display">
                   {language === "en" ? <>CRAFTING <br /> THE <span className="text-glow-cyan italic">FUTURE</span></> : <>ভবিষ্যত <br /> নির্মাণে <span className="text-glow-cyan italic">নিপুণতা</span></>}
                </h1>
                <p className="text-lg md:text-xl max-w-xl font-medium leading-relaxed italic" style={{ color: "var(--text-muted)" }}>
                   {language === "en" 
                     ? "To redefine the landscape of technical consultancy by merging architectural beauty with structural integrity. We don't just build structures; we engineer legacies."
                     : "স্থাপত্য সৌন্দর্যের সাথে কাঠামোগত অখণ্ডতা মিশিয়ে প্রযুক্তিগত পরামর্শের রূপরেখা নতুনভাবে সংজ্ঞায়িত করা। আমরা কেবল কাঠামো তৈরি করি না; আমরা লিগ্যাসি নির্মাণ করি।"}
                </p>
             </div>

             {/* Stats Bar */}
             <div className="flex flex-wrap gap-12 pt-10 border-t border-[var(--highlight-border)]">
                {[
                  { val: "500+", label: language === "en" ? "PROJECTS DONE" : "সম্পন্ন প্রকল্প" },
                  { val: "12",   label: language === "en" ? "AWARDS WON" : "অর্জিত পুরস্কার" },
                  { val: "100%", label: language === "en" ? "SAFETY RATING" : "নিরাপত্তা রেটিং" },
                ].map((stat, i) => (
                  <div key={i} className="group">
                     <p className="text-4xl font-black mb-2 transition-transform group-hover:scale-110 font-display" style={{ color: "var(--text)" }}>{stat.val}</p>
                     <p className="stats-label text-[var(--highlight)]">{stat.label}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* ── 2. FOUNDER PROFILE (EXACT MATCH) ──────────────────────────────── */}
      <section className="py-24 md:py-48 px-6 lg:px-10 relative overflow-hidden border-y border-[var(--highlight-border)]" style={{ background: "var(--bg-soft)" }}>
         <div className="mx-auto max-w-[1500px] grid lg:grid-cols-2 gap-24 items-center relative z-10">
            {/* Biography Text */}
            <div className="reveal-unit space-y-12">
               <div>
                  <h2 className="text-4xl sm:text-6xl font-black mb-4 uppercase tracking-tighter font-display leading-tight" style={{ color: "var(--text)" }}>
                    {language === "bn" ? (bio?.title?.bn || bio?.title?.en) : bio?.title?.en || "Engr. Alam Ashik"}
                  </h2>
                  <p className="text-[10px] font-black text-[var(--highlight)] uppercase tracking-[0.5em] italic mb-6">
                    {language === "bn" ? (bio?.summary?.bn || bio?.summary?.en) : bio?.summary?.en || "FOUNDER & LEAD CONSULTANT"}
                  </p>
                  <div className="w-20 h-1 bg-[var(--highlight)] mb-12" />
               </div>

               <div className="space-y-10 max-w-2xl">
                  {/* Dynamic Quote */}
                  <div className="relative">
                     <p className="text-lg md:text-xl font-black italic leading-relaxed uppercase tracking-tight" style={{ color: "var(--text)" }}>
                        "{language === "bn" ? (bio?.quote?.bn || bio?.quote?.en) : (bio?.quote?.en || "Innovation isn't just about modern tools; it's about a fundamental shift in how we perceive durability and aesthetics.")}"
                     </p>
                  </div>

                  {/* Dynamic Bio */}
                  <p className="text-base font-medium leading-relaxed italic" style={{ color: "var(--text-muted)" }}>
                     {language === "bn" ? (bio?.body?.bn || bio?.body?.en) : bio?.body?.en}
                  </p>
               </div>

               <Link to="/contact" 
                 className="inline-flex items-center gap-5 px-10 py-5 bg-[var(--highlight)] text-black rounded-xl font-black text-[12px] uppercase tracking-[0.2em] transform transition-all hover:scale-105 hover:bg-[var(--highlight)] opacity-90 hover:opacity-100 shadow-[0_20px_40px_var(--highlight-glow)]">
                  {language === "en" ? "View Executive Portfolio" : "এক্সিকিউটিভ পোর্টফোলিও"}
                  <ChevronRight size={18} />
               </Link>
            </div>

            {/* Portrait side */}
            <div className="reveal-unit relative flex justify-center lg:justify-end">
               <div className="relative group">
                  {/* Message Icon Bubble */}
                  <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full bg-[var(--highlight)] flex items-center justify-center text-black z-20 shadow-[0_0_30px_var(--highlight)] animate-bounce">
                    <MessageSquare size={24} />
                  </div>

                  {/* Decorative Border Line */}
                  <div className="absolute -bottom-10 -right-10 w-full h-[80%] border-r-2 border-b-2 border-[var(--highlight-border)] rounded-br-[80px]" />
                  
                  {/* Main Portrait */}
                  <div className="relative w-full max-w-[500px] aspect-[4/5] rounded-[40px] overflow-hidden border-2 border-white/5 shadow-3xl bg-[var(--bg-card)] group-hover:border-[var(--highlight-border)] transition-all duration-700">
                     <img 
                       src={bio?.featuredImage?.url || "https://images.squarespace-cdn.com/content/v1/5932df8946c3c43428989a31/1513238640825-J90E2L3A8K1B9T9X7L8G/Headshot.jpg"} 
                       alt="Engr. Alam Ashik"
                       className="w-full h-full object-cover transition-all duration-1000 grayscale group-hover:grayscale-0 group-hover:scale-105"
                     />
                     
                     {/* OVERLAY WITH NAME AND DESIGNATION ON HOVER AS REQUESTED */}
                     <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-8 text-center backdrop-blur-sm">
                        <div className="transform translate-y-10 group-hover:translate-y-0 transition-transform duration-700">
                           <h3 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tighter mb-2 font-display">
                             {language === "bn" ? (bio?.title?.bn || bio?.title?.en) : (bio?.title?.en || "Engr. Alam Ashik")}
                           </h3>
                           <div className="h-1 w-12 bg-[var(--highlight)] mx-auto mb-4" />
                           <p className="text-[10px] md:text-xs font-black text-[var(--highlight)] uppercase tracking-[0.4em]">
                             {language === "bn" ? (bio?.summary?.bn || bio?.summary?.en) : (bio?.summary?.en || "Principal Structural Consultant")}
                           </p>
                        </div>
                     </div>

                     <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t via-transparent to-transparent group-hover:opacity-0 transition-opacity" style={{ backgroundImage: "linear-gradient(to top, var(--bg-soft), transparent)" }} />
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* ── 3. SKILLSET GRID ─────────────────────────────────────────────── */}
      <section className="py-24 md:py-48 px-6 lg:px-10 relative overflow-hidden">
        <div className="blueprint-overlay opacity-5" />
        <div className="mx-auto max-w-[1500px]">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-10 reveal-unit">
            <div>
              <p className="stats-label mb-6">{language === "en" ? "CORE COMPETENCIES" : "প্রযুক্তিগত দক্ষতা"}</p>
              <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter font-display" style={{ color: "var(--text)" }}>{language === "en" ? "SKILLS & EXPERTISE" : "দক্ষতা এবং অভিজ্ঞতা"}</h2>
            </div>
            <p className="text-base max-w-md md:text-right font-medium italic" style={{ color: "var(--text-muted)" }}>
              {language === "en" 
                ? "Optimizing structural output through advanced analysis and algorithmic precision across multiple software environments."
                : "একাধিক সফটওয়্যার পরিবেশে উন্নত বিশ্লেষণ এবং অ্যালগরিদমিক নির্ভুলতার মাধ্যমে কাঠামোগত আউটপুট অপ্টিমাইজ করা।"}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((skill, i) => (
              <SkillCard key={i} skill={skill} language={language} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. TIMELINE ──────────────────────────────────────────────────── */}
      <section className="py-24 md:py-48 px-6 lg:px-10 border-t border-[var(--highlight-border)] overflow-hidden" style={{ background: "var(--bg-soft)" }}>
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-20 reveal-unit">
             <p className="stats-label mb-6">{language === "en" ? "PROFESSIONAL JOURNEY" : "কার্যক্রমের ধারাবাহিকতা"}</p>
             <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter font-display" style={{ color: "var(--text)" }}>{language === "en" ? "CAREER TIMELINE" : "ক্যারিয়ার টাইমলাইন"}</h2>
          </div>

          <div className="timeline-container relative max-w-5xl mx-auto pt-10">
            <div className="absolute left-[50%] top-0 h-full w-[1px] hidden md:block" style={{ background: "var(--highlight-border)" }} />
            <div className="timeline-line-progress absolute left-[50%] top-0 h-full w-[2px] hidden md:block origin-top" 
              style={{ background: "var(--highlight)", boxShadow: "0 0 20px var(--highlight-glow)", zIndex: 5 }} />

            <div className="space-y-40">
              {timeline.map((item, i) => (
                <div key={i} className={`timeline-item relative flex flex-col md:flex-row items-center gap-16 ${i % 2 !== 0 ? "md:flex-row-reverse" : ""}`}>
                  <div className="timeline-dot absolute left-1/2 top-14 z-10 w-3 h-3 rounded-full -translate-x-1/2 hidden md:block"
                    style={{ background: "var(--highlight)", border: "4px solid var(--bg)", boxShadow: "0 0 20px var(--highlight)" }} />
                  
                  <div className="md:w-1/2">
                    <div className="p-10 rounded-[40px] shadow-2xl transition-all hover:translate-y-[-5px]"
                      style={{ background: "var(--bg-card)", border: "1px solid var(--highlight-border)" }}>
                      <p className="text-4xl font-black mb-6 italic font-display" style={{ color: "var(--highlight)" }}>{item.year}</p>
                      <h3 className="text-2xl font-black mb-4 uppercase italic tracking-tight font-display" style={{ color: "var(--text)" }}>
                        {language === "bn" ? (item.title?.bn || item.title?.en) : item.title?.en}
                      </h3>
                      <p className="text-sm leading-relaxed font-medium italic" style={{ color: "var(--text-muted)" }}>
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

      {/* ── 5. TEAM ──────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-48 px-6 lg:px-10 border-t border-[var(--highlight-border)]" style={{ background: "var(--bg)" }}>
        <div className="mx-auto max-w-[1500px]">
          <div className="flex justify-between items-end mb-20 reveal-unit">
             <div>
                <p className="stats-label mb-6">{language === "en" ? "CONSULTANCY TEAM" : "কর্মী তালিকা"}</p>
                <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter font-display" style={{ color: "var(--text)" }}>{language === "en" ? "CORE TEAM" : "কোর টিম"}</h2>
             </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {team.map((member, i) => (
              <div key={i} className="reveal-unit group relative rounded-[48px] overflow-hidden transition-all duration-500 border border-white/5 border-b-[var(--highlight-border)]" style={{ background: "var(--bg-card)" }}>
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img src={member.image?.url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"} alt={member.name}
                    className="w-full h-full object-cover transition-all duration-1000 grayscale group-hover:grayscale-0 group-hover:scale-110"
                  />
                  
                  <div className="absolute inset-x-0 bottom-0 h-1/2 via-transparent to-transparent opacity-80" style={{ backgroundImage: "linear-gradient(to top, var(--bg), transparent)" }} />
                  
                  <div className="absolute inset-0 flex flex-col justify-end p-8 translate-y-4 group-hover:translate-y-0 transition-all duration-700">
                     <div className="mb-4 space-y-2">
                        <h3 className="text-xl font-black italic uppercase tracking-tight font-display" style={{ color: "var(--text)" }}>{member.name}</h3>
                        <p className="text-[10px] font-black text-[var(--highlight)] uppercase tracking-[0.4em]">{member.designation?.en}</p>
                     </div>
                     
                     <div className="flex items-center justify-between pt-4 border-t border-[var(--highlight-border)] opacity-0 group-hover:opacity-100 transition-opacity">
                       <a href={member.socialLinks?.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/10 text-white hover:bg-[var(--highlight)] hover:text-black transition-all"><Linkedin size={16} /></a>
                       <span className="text-[8px] font-black uppercase tracking-widest italic" style={{ color: "var(--text-faint)" }}>Core Staff</span>
                     </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Branding */}
      <div className="py-20 px-10 border-t border-[var(--highlight-border)] flex flex-col md:flex-row justify-between items-center gap-10 opacity-50 hover:opacity-100 transition-opacity">
         <div className="text-[10px] font-black uppercase tracking-[0.5em] font-display italic" style={{ color: "var(--text-faint)" }}>
            ENGR. ALAM ASHIK · Professional Excellence
         </div>
         <div className="text-[8px] font-bold uppercase tracking-widest italic" style={{ color: "var(--text-faint)" }}>
            {new Date().getFullYear()} © ALL RIGHTS RESERVED
         </div>
      </div>
    </div>
  );
}
