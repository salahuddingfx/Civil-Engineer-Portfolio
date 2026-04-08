import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useLanguage } from "../context/LanguageContext";
import { t } from "../lib/translations";
import SeoHead from "../components/SeoHead";

const images = [
  { src: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80", label: "Structural Framework", coord: "Coastal Sector Alpha", date: "2023 October", iso: "Structural Integrity", meta: "High Resolution Study" },
  { src: "https://images.unsplash.com/photo-1429497419816-9ca5cfb4571a?auto=format&fit=crop&w=1200&q=80", label: "Material Excellence", coord: "Laboratory Analysis", date: "2023 November", iso: "Quality Control", meta: "Certified Material Data" },
  { src: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80", label: "Architectural Precision", coord: "Urban Core Beta", date: "2024 January", iso: "Design Accuracy", meta: "Symmetry Alignment" },
  { src: "https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?auto=format&fit=crop&w=1200&q=80", label: "Professional Supervision", coord: "Site Execution Hub", date: "2023 December", iso: "Safety Protocol", meta: "Live Site Monitoring" },
  { src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80", label: "Commercial Presence", coord: "Business District Hub", date: "2024 February", iso: "Structural Audit", meta: "Facade Completion" },
  { src: "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=1200&q=80", label: "Interior Volume", coord: "Minimalist Residency", date: "2024 March", iso: "Interior Logic", meta: "Spatial Optimization" },
];

export default function GalleryPage() {
  const { language } = useLanguage();
  const [activeImage, setActiveImage] = useState(null);
  const containerRef = useRef(null);

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
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} style={{ background: "var(--bg)", color: "var(--text)" }} className="min-h-screen">
      <SeoHead
        title="Gallery | Visual Intelligence Archive | Engr. Alam Ashik"
        description="A professional registry of structural achievements and architectural visual intelligence in Cox's Bazar."
        path="/gallery"
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6 lg:px-10 text-center mx-auto max-w-[1500px]">
         <div className="reveal-unit mx-auto max-w-[900px]">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-[10px] font-bold tracking-[0.2em] uppercase"
              style={{ border: "1px solid var(--highlight-border)", background: "var(--highlight-soft)", color: "var(--highlight)" }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--highlight)" }} />
              {t("gallery_page.eyebrow", language)}
            </span>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-8 uppercase" style={{ color: "var(--text)" }}>
              {t("gallery_page.title", language).split(" ")[0]} <span className="text-glow">{t("gallery_page.title", language).split(" ").slice(1).join(" ")}</span>
            </h1>
            <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {t("gallery_page.subtitle", language)}
            </p>
         </div>
      </section>

      {/* Masonry Grid */}
      <section className="py-12 px-6 lg:px-10 mx-auto max-w-[1500px]">
         <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 md:gap-8 space-y-6 md:space-y-8">
            {images.map((img, i) => (
              <div 
                key={i} 
                className={`reveal-unit group relative rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer shadow-xl border border-[rgba(25,210,255,0.05)] break-inside-avoid active:scale-[0.98] transition-transform duration-300
                  ${i % 3 === 0 ? "aspect-[4/5]" : i % 2 === 0 ? "aspect-square" : "aspect-[3/4]"}`}
                onClick={() => setActiveImage(img)}
              >
                 <img src={img.src} alt={img.label} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" loading="lazy" />
                 
                 {/* Better Overlay for Mobile */}
                 <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] via-[#0A0F1C]/40 to-transparent opacity-80 md:opacity-40 md:group-hover:opacity-100 transition-opacity duration-500" />
                 
                 <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                    <div className="md:transform md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-500">
                      <span className="inline-block px-3 py-1 bg-[#19D2FF]/10 text-[#19D2FF] border border-[#19D2FF]/20 backdrop-blur-sm rounded text-[9px] md:text-[10px] tracking-widest font-bold uppercase mb-2">
                        {img.iso}
                      </span>
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight">{img.label}</h3>
                      <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-[rgba(25,210,255,0.1)] opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                         <span className="text-[10px] text-[#CBD5E1] font-bold uppercase tracking-widest">{img.coord}</span>
                      </div>
                    </div>
                 </div>

                 {/* Focus Icon - Always visible on mobile */}
                 <div className="absolute top-4 right-4 md:top-8 md:right-8 w-10 h-10 md:w-12 md:h-12 bg-[#19D2FF]/10 backdrop-blur-md border border-[#19D2FF]/20 rounded-full flex items-center justify-center text-[#19D2FF] opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 scale-90 md:scale-50 md:group-hover:scale-100 hover:bg-[#19D2FF] hover:text-[#0A0F1C]">
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"></path></svg>
                 </div>
              </div>
            ))}
         </div>
      </section>

      {/* Lightbox Modal */}
      {activeImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8">
          <div className="absolute inset-0 bg-[#0A0F1C]/96 backdrop-blur-xl" onClick={() => setActiveImage(null)} />
          
          <div className="relative w-full max-w-6xl max-h-[90vh] md:max-h-[95vh] overflow-hidden rounded-2xl md:rounded-3xl border border-[#19D2FF]/20 bg-[#111827] shadow-3xl flex flex-col lg:flex-row transform transition-all duration-500">
             
             {/* Close Button */}
             <button 
               onClick={() => setActiveImage(null)}
               className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#0A0F1C]/50 border border-[#19D2FF]/30 flex items-center justify-center text-white hover:text-[#0A0F1C] hover:bg-[#19D2FF] transition-all z-20"
             >
               <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
             </button>

             <div className="h-[40%] lg:h-auto lg:w-[60%] relative flex-shrink-0">
                <img src={activeImage.src} alt={activeImage.label} className="w-full h-full object-cover" />
             </div>
             
             <div className="h-[60%] lg:h-auto lg:w-[40%] p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-[#0F172A] relative overflow-y-auto">
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#19D2FF]/5 rounded-tl-full blur-3xl pointer-events-none"></div>

                <span className="text-[#19D2FF] text-[9px] md:text-[10px] font-bold tracking-[0.2em] uppercase mb-3">Intelligence Archive</span>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 tracking-tight text-white leading-tight">{activeImage.label}</h2>
                
                <p className="text-[13px] md:text-[15px] text-[#CBD5E1] leading-relaxed mb-6 md:mb-10">
                  Detailed analysis: {activeImage.meta}. Ensuring structural components meet premium architectural standards under rigorous stress conditions.
                </p>

                <div className="space-y-4 md:space-y-6 border-y border-[rgba(25,210,255,0.1)] py-6 md:py-8 mb-8 md:mb-10">
                   <div className="flex justify-between items-center sm:block">
                      <p className="text-[9px] font-bold text-[#666] tracking-widest uppercase mb-1">ISO PROTOCOL</p>
                      <p className="text-sm font-bold text-[#19D2FF]">{activeImage.iso}</p>
                   </div>
                   <div className="flex justify-between items-center sm:block">
                      <p className="text-[9px] font-bold text-[#666] tracking-widest uppercase mb-1">COORDINATION</p>
                      <p className="text-sm font-bold text-white">{activeImage.coord}</p>
                   </div>
                   <div className="flex justify-between items-center sm:block">
                      <p className="text-[9px] font-bold text-[#666] tracking-widest uppercase mb-1">CAPTURE ERA</p>
                      <p className="text-sm font-bold text-white">{activeImage.date}</p>
                   </div>
                </div>

                <button onClick={() => setActiveImage(null)} className="w-full py-4 bg-[#19D2FF] text-[#0A0F1C] text-[11px] md:text-[12px] font-bold uppercase tracking-widest rounded-lg hover:bg-white transition-all shadow-lg active:scale-95">
                   Close Archive Registry
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
