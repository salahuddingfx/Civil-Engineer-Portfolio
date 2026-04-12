import { useRef, useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../context/LanguageContext";
import SeoHead from "../components/SeoHead";
import { fetchContent } from "../lib/api";
import { Mail, Zap, Clock, Users, ChevronRight, MessageSquare, Quote, X } from "lucide-react";
import { Linkedin } from "../components/BrandIcons";
import LucideIcon from "../components/LucideIcon";
import PreviewModal from "../components/PreviewModal";
import Counter from "../components/Counter";

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
  const [aboutStats, setAboutStats] = useState([]);
  const [aboutMission, setAboutMission] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    async function loadAboutData() {
      setLoading(true);
      try {
        const [bioRes, skillsRes, timelineRes, teamRes, blocksRes] = await Promise.all([
          fetchContent("about", { limit: 1 }),
          fetchContent("skills", { sort: "order" }),
          fetchContent("timelineEntries", { sort: "order" }),
          fetchContent("teamMembers", { sort: "order" }),
          fetchContent("sectionBlocks", { pageFilter: "about", limit: 50 })
        ]);

        setBio(bioRes.items?.[0] || null);
        setSkills(skillsRes.items || []);
        setTimeline(timelineRes.items || []);
        setTeam(teamRes.items || []);

        if (blocksRes.items) {
           const blocks = blocksRes.items;
           setAboutStats(blocks.filter(b => b.section === 'stats').sort((a,b) => a.order - b.order));
           setAboutMission(blocks.find(b => b.section === 'mission'));
        }
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
        title="About | Engr Alam Ashik | Civil Engineer in Cox's Bazar"
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
                  src={aboutMission?.image?.url ? (aboutMission.image.url.includes('?') ? `${aboutMission.image.url}&w=1000&q=80&auto=format` : `${aboutMission.image.url}?w=1000&q=80&auto=format`) : "/images/architecture-fallback.png"} 
                  className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                  alt="Mission Backbone"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-60" style={{ backgroundImage: "linear-gradient(to top, var(--bg), transparent)" }} />
             </div>

             {/* SINCE 2013 Badge */}
             <div className="absolute bottom-10 left-10 p-8 rounded-[32px] mission-card max-w-sm transform -translate-x-4 group-hover:translate-x-0 transition-transform duration-700">
                <p className="text-[9px] font-black tracking-[0.3em] text-[var(--highlight)] mb-3 uppercase italic">
                  {aboutMission?.subtitle ? (language === "en" ? aboutMission.subtitle.en : aboutMission.subtitle.bn) : "SINCE 2013"}
                </p>
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
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-black leading-[0.9] tracking-tighter uppercase mb-8 font-display">
                   {aboutMission?.title ? (
                      language === "bn" ? aboutMission.title.bn : aboutMission.title.en
                   ) : (
                      language === "en" ? <>CRAFTING <br /> THE <span className="text-glow-cyan italic">FUTURE</span></> : <>ভবিষ্যত <br /> নির্মাণে <span className="text-glow-cyan italic">নিপুণতা</span></>
                   )}
                </h1>
                <p className="text-lg md:text-xl max-w-xl font-medium leading-relaxed italic" style={{ color: "var(--text-muted)" }}>
                   {aboutMission?.body ? (language === "bn" ? aboutMission.body.bn : aboutMission.body.en) : (language === "en" 
                     ? "To redefine the landscape of technical consultancy by merging architectural beauty with structural integrity. We don't just build structures; we engineer legacies."
                     : "স্থাপত্য সৌন্দর্যের সাথে কাঠামোগত অখণ্ডতা মিশিয়ে প্রযুক্তিগত পরামর্শের রূপরেখা নতুনভাবে সংজ্ঞায়িত করা। আমরা কেবল কাঠামো তৈরি করি না; আমরা লিগ্যাসি নির্মাণ করি।")}
                </p>
             </div>

             {/* Stats Bar */}
             <div className="flex flex-wrap gap-12 pt-10 border-t border-[var(--highlight-border)]">
                {(aboutStats.length > 0 ? aboutStats : [
                  { 
                    value: "500+", 
                    title: { en: "PROJECTS DONE", bn: "সম্পন্ন প্রকল্প" }
                  },
                  { 
                    value: "12", 
                    title: { en: "AWARDS WON", bn: "অর্জিত পুরস্কার" }
                  },
                  { 
                    value: "100%", 
                    title: { en: "SAFETY RATING", bn: "নিরাপত্তা রেটিং" }
                  },
                ]).map((stat, i) => (
                  <div key={i} className="group">
                     <p className="text-4xl font-black mb-2 transition-transform group-hover:scale-110 font-display" style={{ color: "var(--text)" }}>
                       <Counter value={stat.value} />
                     </p>
                     <p className="stats-label text-[var(--highlight)] cursor-default">
                       {language === "bn" ? (stat.title?.bn || stat.title?.en) : stat.title?.en}
                     </p>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* ── 2. ABOUT ME SECTION (REFINED) ─────────────────────────────────── */}
      <section id="about-me" className="py-24 md:py-40 px-6 lg:px-10 relative overflow-hidden border-y border-[var(--highlight-border)]">
         <div className="mx-auto max-w-[1400px] grid lg:grid-cols-2 gap-16 lg:gap-32 items-center relative z-10">
            
            {/* Content Side - NOW ON THE LEFT */}
            <div className="reveal-unit space-y-10 order-2 lg:order-1">
               <div className="space-y-4">
                  <span className="stats-label block">About Me</span>
                  <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter font-display leading-[0.9]" style={{ color: "var(--text)" }}>
                    {language === "bn" ? (bio?.title?.bn || bio?.title?.en) : (bio?.title?.en || "Engr Alam Ashik")}
                  </h2>
                  <p className="text-[12px] font-black text-[var(--highlight)] uppercase tracking-[0.4em] italic">
                    {language === "bn" ? (bio?.summary?.bn || bio?.summary?.en) : (bio?.summary?.en || "FOUNDER & LEAD CONSULTANT")}
                  </p>
               </div>

               <div className="space-y-8">
                  <p className="text-xl md:text-2xl font-medium leading-relaxed italic" style={{ color: "var(--text-muted)" }}>
                     {language === "bn" ? (
                        <>হাই, আমি প্রকৌশলী আলম আশিক। {bio?.body?.bn || bio?.body?.en}</>
                     ) : (
                        <>Hi, I'm Engr Alam Ashik. {bio?.body?.en || "A passionate structural consultant dedicated to blending engineering precision with architectural beauty."}</>
                     )}
                  </p>

                  <div className="grid grid-cols-2 gap-10 pt-6 border-t border-white/5">
                     <div className="space-y-2">
                        <p className="text-[10px] font-black text-[var(--highlight)] uppercase tracking-widest">Specialization</p>
                        <p className="text-sm font-bold uppercase italic opacity-80" style={{ color: "var(--text)" }}>Structural Integrity</p>
                     </div>
                     <div className="space-y-2">
                        <p className="text-[10px] font-black text-[var(--highlight)] uppercase tracking-widest">Consultancy</p>
                        <p className="text-sm font-bold uppercase italic opacity-80" style={{ color: "var(--text)" }}>Civil Engineering</p>
                     </div>
                  </div>
               </div>

               <div className="pt-6">
                  <Link to="/contact" 
                    className="inline-flex items-center gap-4 px-10 py-5 bg-[var(--highlight)] text-black rounded-xl font-black text-[11px] uppercase tracking-[0.2em] transform transition-all hover:scale-105 shadow-[0_20px_40px_var(--highlight-glow)]">
                     {language === "en" ? "Work With Me" : "আমার সাথে কাজ করুন"}
                     <ChevronRight size={18} />
                  </Link>
               </div>
            </div>

            {/* Image Side - NOW ON THE RIGHT */}
            <div className="reveal-unit relative order-1 lg:order-2">
               <div className="relative aspect-[4/5] rounded-[24px] overflow-hidden border border-white/10 shadow-3xl bg-[var(--bg-card)] group">
                  <img 
                    src={bio?.featuredImage?.url ? (bio.featuredImage.url.includes('?') ? `${bio.featuredImage.url}&w=1000&q=80&auto=format` : `${bio.featuredImage.url}?w=1000&q=80&auto=format`) : "/images/hero-concept.png"} 
                    alt="Engr Alam Ashik"
                    className="w-full h-full object-cover transition-all duration-1000 grayscale group-hover:grayscale-0 group-hover:scale-105"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent opacity-40" />
               </div>
               
               {/* Subtle Experience Badge */}
               <div className="absolute -bottom-6 -right-6 p-6 rounded-2xl backdrop-blur-xl bg-[var(--bg-card)] border border-[var(--highlight-border)] shadow-2xl reveal-unit">
                  <p className="text-[10px] font-black text-[var(--highlight)] uppercase tracking-widest mb-1">Experience</p>
                  <p className="text-xl font-black italic uppercase leading-none" style={{ color: "var(--text)" }}>
                     <Counter value="11" suffix="+ Years" />
                  </p>
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
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter font-display" style={{ color: "var(--text)" }}>{language === "en" ? "SKILLS & EXPERTISE" : "দক্ষতা এবং অভিজ্ঞতা"}</h2>
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
             <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter font-display" style={{ color: "var(--text)" }}>{language === "en" ? "CAREER TIMELINE" : "ক্যারিয়ার টাইমলাইন"}</h2>
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
                <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter font-display" style={{ color: "var(--text)" }}>{language === "en" ? "CORE TEAM" : "কোর টিম"}</h2>
             </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {team.map((member, i) => (
              <div 
                key={i} 
                className="reveal-unit group relative rounded-[48px] overflow-hidden transition-all duration-500 border border-white/5 border-b-[var(--highlight-border)] cursor-pointer" 
                style={{ background: "var(--bg-card)" }}
                onClick={() => setSelectedMember(member)}
              >
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img src={member.image?.url || "/images/hero-concept.png"} alt={member.name}
                    className="w-full h-full object-cover transition-all duration-1000 grayscale group-hover:grayscale-0 group-hover:scale-110"
                    decoding="async"
                  />
                  
                  <div className="absolute inset-x-0 bottom-0 h-1/2 via-transparent to-transparent opacity-80" style={{ backgroundImage: "linear-gradient(to top, var(--bg), transparent)" }} />
                  
                  <div className="absolute inset-0 flex flex-col justify-end p-8 translate-y-4 group-hover:translate-y-0 transition-all duration-700">
                     <div className="mb-4 space-y-2">
                        <h3 className="text-xl font-black italic uppercase tracking-tight font-display hover:text-[var(--highlight)] transition-colors" style={{ color: "var(--text)" }}>{member.name}</h3>
                        <p className="text-[10px] font-black text-[var(--highlight)] uppercase tracking-[0.4em]">{member.designation?.en}</p>
                     </div>
                     
                     <div className="flex items-center justify-between pt-4 border-t border-[var(--highlight-border)] opacity-0 group-hover:opacity-100 transition-opacity">
                        <a 
                          href={member.socialLinks?.linkedin} 
                          onClick={(e) => e.stopPropagation()} 
                          target="_blank" rel="noopener noreferrer" 
                          className="p-3 rounded-xl bg-white/10 text-white hover:bg-[var(--highlight)] hover:text-black transition-all"
                        >
                          <Linkedin size={16} />
                        </a>
                        <span className="text-[8px] font-black uppercase tracking-widest italic" style={{ color: "var(--text-faint)" }}>Core Staff</span>
                     </div>
                  </div>
               </div>
              </div>
            ))}
          </div>

          {/* Member Preview Modal */}
          <PreviewModal 
            data={selectedMember} 
            isOpen={!!selectedMember} 
            onClose={() => setSelectedMember(null)} 
            type="team"
            language={language}
          />
        </div>
      </section>

      {/* Footer Branding */}
      <div className="py-20 px-10 border-t border-[var(--highlight-border)] flex flex-col md:flex-row justify-between items-center gap-10 opacity-50 hover:opacity-100 transition-opacity">
         <div className="text-[10px] font-black uppercase tracking-[0.5em] font-display italic" style={{ color: "var(--text-faint)" }}>
            ENGR ALAM ASHIK · Professional Excellence
         </div>
         <div className="text-[8px] font-bold uppercase tracking-widest italic" style={{ color: "var(--text-faint)" }}>
            {new Date().getFullYear()} © ALL RIGHTS RESERVED
         </div>
      </div>
    </div>
  );
}
