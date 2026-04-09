import { useEffect, useRef } from "react";
import gsap from "gsap";
import { X, MapPin, Calendar, Briefcase, Share2, UserCircle } from "lucide-react";
import { Linkedin } from "./BrandIcons";

/**
 * Premium Preview Modal for Projects and Team Members
 * @param {Object} data - Project or Team Member data
 * @param {Boolean} isOpen - Modal open state
 * @param {Function} onClose - Close handler
 * @param {String} type - "project" or "team"
 * @param {String} language - "en" or "bn"
 */
export default function PreviewModal({ data, isOpen, onClose, type = "project", language = "en" }) {
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const tl = gsap.timeline();
      tl.to(overlayRef.current, { opacity: 1, duration: 0.4 })
        .fromTo(contentRef.current, 
          { y: 50, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "power4.out" },
          "-=0.2"
        );
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  if (!isOpen || !data) return null;

  const isProject = type === "project";

  return (
    <div 
      ref={modalRef}
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-10"
    >
      {/* Backdrop */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 bg-[#070a13]/90 backdrop-blur-md opacity-0"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div 
        ref={contentRef}
        className="relative w-full max-w-5xl bg-[var(--bg-card)] rounded-[32px] md:rounded-[48px] overflow-hidden border border-white/10 shadow-3xl opacity-0 overflow-y-auto max-h-[90vh] md:max-h-auto"
        style={{ background: "var(--bg-card)" }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/10 text-white hover:bg-[var(--highlight)] hover:text-black transition-all border border-white/10"
        >
          <X size={20} />
        </button>

        <div className="grid md:grid-cols-[1.1fr_0.9fr] h-full">
          {/* Image Side */}
          <div className="relative h-[300px] md:h-full overflow-hidden group">
            <img 
              src={isProject ? data.img : (data.image?.url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e")} 
              alt={isProject ? data.title : data.name}
              className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-transparent opacity-60" />
            
            {/* Project/Member Badge */}
            <div className="absolute bottom-8 left-8">
               <span className="px-5 py-2 rounded-full bg-[var(--highlight-soft)] border border-[var(--highlight-border)] text-[10px] font-black uppercase tracking-[0.2em] text-[var(--highlight)] shadow-[0_0_20px_var(--highlight-glow)]">
                 {isProject ? (data.category || "Project Preview") : (data.designation?.en || "Core Staff")}
               </span>
            </div>
          </div>

          {/* Info Side */}
          <div className="p-8 md:p-16 flex flex-col justify-center">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-black text-[var(--highlight)] uppercase tracking-[0.4em] opacity-40">
                  {isProject ? "Detailed Asset" : "Personnel Identity"}
                </span>
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none" style={{ color: "var(--text)" }}>
                   {isProject ? data.title : data.name}
                </h2>
                {!isProject && (
                  <p className="text-sm font-bold uppercase italic opacity-60 text-[var(--highlight)] italic">
                    {data.designation?.en || "Specialist"}
                  </p>
                )}
              </div>

              <div className="h-px w-20 bg-[var(--highlight)] opacity-30" />

              <p className="text-lg leading-relaxed italic" style={{ color: "var(--text-muted)" }}>
                 {isProject 
                   ? (language === "bn" ? data.summary?.bn : data.summary?.en) || "A signature architectural achievement emphasizing structural integrity and local aesthetic value."
                   : (language === "bn" ? data.bio?.bn : data.bio?.en) || "A dedicated professional with extensive experience in the engineering landscape, committed to delivering precision and excellence."
                 }
              </p>

              {/* Attributes Grid */}
              <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/5">
                {isProject ? (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[var(--highlight)]">
                        <MapPin size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Location</span>
                      </div>
                      <p className="text-sm font-bold uppercase italic opacity-80" style={{ color: "var(--text)" }}>{data.location || "Bangladesh"}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[var(--highlight)]">
                        <Calendar size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Year</span>
                      </div>
                      <p className="text-sm font-bold uppercase italic opacity-80" style={{ color: "var(--text)" }}>{data.year || "2024"}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[var(--highlight)]">
                        <Briefcase size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Focus</span>
                      </div>
                      <p className="text-sm font-bold uppercase italic opacity-80" style={{ color: "var(--text)" }}>Structural Integrity</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[var(--highlight)]">
                        <Linkedin size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Social</span>
                      </div>
                      <a href={data.socialLinks?.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs font-bold uppercase hover:text-[var(--highlight)] transition-colors">CONNECTED</a>
                    </div>
                  </>
                )}
              </div>

              {/* Action */}
              <div className="pt-10">
                 <button 
                  onClick={onClose}
                  className="group flex items-center gap-4 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[var(--highlight)] hover:text-black transition-all">
                   {language === "en" ? "Close Preview" : "বন্ধ করুন"}
                   <Share2 size={16} className="group-hover:rotate-12 transition-transform" />
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
