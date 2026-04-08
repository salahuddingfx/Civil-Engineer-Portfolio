import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useLanguage } from "../../context/LanguageContext";
import GlassCard from "../../components/GlassCard";

const modules = [
  { label: "Admin Profile", type: "adminAccount", to: "/admin/account", desc: "Manage access security and professional credentials.", icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> },
  { label: "Home Overview", type: "home", desc: "Update primary vision and key professional highlights.", icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> },
  { label: "Studio History", type: "about", desc: "Refine consultancy legacy and structural journey.", icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg> },
  { label: "Service Portfolio", type: "services", desc: "Configure engineering and architectural service sets.", icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg> },
  { label: "Project Registry", type: "projects", desc: "Document high-performance structural assets.", icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg> },
  { label: "Client Heritage", type: "testimonials", desc: "Curate professional reviews and certified feedback.", icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> },
  { label: "Visual Evidence", type: "gallery", desc: "Manage site photography and architectural renders.", icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg> },
  { label: "Communication Nodes", type: "contactDetails", desc: "Manage studio location and contact configurations.", icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg> },
  { label: "Strategic SEO", type: "seoMeta", desc: "Enhance discovery and architectural market authority.", icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg> },
  { label: "Inquiry Manager", type: "contactSubmissions", desc: "Process high-priority project analysis requests.", icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg> },
];

export default function AdminDashboardPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const dashboardRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".dash-reveal", {
        opacity: 0,
        y: 60,
        duration: 1.5,
        stagger: 0.1,
        ease: "power4.out",
      });
    }, dashboardRef);
    return () => ctx.revert();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminAccessToken");
    localStorage.removeItem("adminRefreshToken");
    navigate("/admin", { replace: true });
  };

  return (
    <div ref={dashboardRef} className="mx-auto mt-8 md:mt-16 max-w-[1500px] px-4 md:px-8 pb-32 bg-tech-grid min-h-screen">
       {/* Sophisticated Header */}
      <header className="dash-reveal relative overflow-hidden rounded-[32px] md:rounded-[56px] border border-white/5 bg-[#080808]/80 p-8 md:p-20 shadow-[0_80px_160px_rgba(0,0,0,0.8)] backdrop-blur-3xl">
        <div className="absolute top-0 right-0 h-96 w-96 bg-[radial-gradient(circle_at_top_right,_rgba(0,210,255,0.05),_transparent_70%)]" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 md:gap-12 relative z-10">
          <div className="space-y-4 md:space-y-6 text-left">
            <div className="flex items-center gap-4">
               <div className="h-2 md:h-2.5 w-2 md:w-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_15px_#00d2ff]" />
               <p className="text-[9px] md:text-[11px] tracking-[0.5em] text-cyan-400 uppercase font-bold italic">{language === 'en' ? "Management Protocol Active" : "ম্যানেজমেন্ট প্রোটোকল একটিভ"}</p>
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter italic">CONSULTANCY <span className="text-cyan-400">SUITE</span></h1>
            <div className="flex gap-8 md:gap-14 mt-4 md:mt-8 pt-8 border-t border-white/5">
               <div className="flex flex-col">
                  <span className="text-[10px] text-[#444] uppercase tracking-[0.3em] font-bold">{language === 'en' ? "Security Integrity" : "নিরাপত্তা ইন্টিগ্রিটি"}</span>
                  <span className="text-xs md:text-sm text-white font-bold mt-2 italic whitespace-nowrap">Validated & Encrypted</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-[10px] text-[#444] uppercase tracking-[0.3em] font-bold">{language === 'en' ? "Registry Level" : "রেজিস্ট্রি লেভেল"}</span>
                  <span className="text-xs md:text-sm text-cyan-400 font-bold mt-2 italic whitespace-nowrap">Standard Tier 4.9</span>
               </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6 md:gap-10 w-full md:w-auto justify-between md:justify-end">
            <div className="hidden lg:flex flex-col items-end gap-3">
               <span className="text-[11px] text-white/20 uppercase tracking-[0.4em] font-bold italic">{language === 'en' ? "Session Continuity" : "সেশন ইন্টিগ্রিটি"}</span>
               <div className="flex gap-2.5">
                  {[...Array(5)].map((_, i) => <div key={i} className={`h-1 w-10 rounded-full ${i < 4 ? 'bg-cyan-400/20 shadow-[0_0_10px_rgba(0,210,255,0.1)]' : 'bg-white/5'}`} />)}
               </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="group relative overflow-hidden rounded-[20px] md:rounded-[28px] border border-rose-500/10 bg-rose-500/5 px-10 md:px-12 py-5 md:py-6 text-[11px] font-black uppercase tracking-[0.4em] text-rose-500 transition-all hover:bg-rose-500/10 hover:border-rose-500/30"
            >
              <span className="relative z-10">{language === 'en' ? "Sign Out" : "লগ আউট"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Modern Dashboard Grid */}
      <div className="mt-12 md:mt-24 grid gap-8 md:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {modules.map((moduleEntry) => (
          <Link 
            key={moduleEntry.type} 
            to={moduleEntry.to || `/admin/dashboard/${moduleEntry.type}`} 
            className="dash-reveal group text-left"
          >
            <GlassCard delay={0.1} className="h-full p-8 md:p-12 hover:border-cyan-400/40 rounded-[40px] md:rounded-[56px]">
              <div className="absolute top-0 right-0 h-24 w-24 bg-[radial-gradient(circle_at_top_right,_rgba(0,210,255,0.05),_transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="mb-12 md:mb-16 flex items-center justify-between">
                <div className="h-16 w-16 md:h-20 md:w-20 rounded-[24px] md:rounded-[32px] border border-white/5 bg-white/2 flex items-center justify-center text-cyan-400 transition-all duration-700 group-hover:bg-cyan-400 group-hover:text-black group-hover:scale-110 shadow-[0_0_20px_rgba(0,210,255,0.1)]">
                   <div className="group-hover:scale-110 transition-transform">{moduleEntry.icon}</div>
                </div>
                <div className="h-2 w-2 rounded-full bg-[#111] group-hover:bg-cyan-400 transition-colors shadow-[0_0_10px_transparent] group-hover:shadow-cyan-400" />
              </div>
              
              <h2 className="text-2xl md:text-3xl font-black text-white group-hover:text-cyan-400 transition-colors tracking-tight italic uppercase">{moduleEntry.label}</h2>
              <p className="mt-6 text-[11px] leading-relaxed text-[#555] group-hover:text-[#888] transition-colors uppercase tracking-[0.15em] font-bold italic">{moduleEntry.desc}</p>
              
              <div className="mt-12 md:mt-16 pt-10 border-t border-white/5 flex items-center justify-between">
                 <div className="text-[10px] font-bold text-cyan-400/20 uppercase tracking-[0.4em] group-hover:text-cyan-400 transition-colors italic">
                    {language === 'en' ? "Initialize Module" : "প্রবেশ করুন"}
                 </div>
                 <div className="text-[10px] font-mono text-white/5 uppercase tracking-widest italic">{moduleEntry.type.substring(0, 4)}</div>
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>

      <footer className="dash-reveal mt-20 md:mt-32 flex flex-col md:flex-row justify-between items-center gap-8 p-12 md:p-20 rounded-[40px] md:rounded-[64px] border border-white/5 bg-[#050505]/60 backdrop-blur-3xl font-display text-[11px] text-[#222] uppercase tracking-[1em] font-bold text-center md:text-left">
         <div className="flex flex-col md:flex-row gap-8 md:gap-14 italic">
            <span className="flex items-center gap-4"><div className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Security: Integrity Validated</span>
            <span className="flex items-center gap-4"><div className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Protocol: Active v4.9</span>
         </div>
         <span className="text-[#333] italic">Engr. Alam Ashik Administrative Suite</span>
      </footer>
    </div>
  );
}
