import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { submitContact } from "../lib/api";
import { useLanguage } from "../context/LanguageContext";
import { t } from "../lib/translations";
import SeoHead from "../components/SeoHead";
import { Facebook, Linkedin, Instagram, Twitter, Youtube } from "../components/BrandIcons";
import { fetchContent } from "../lib/api";

gsap.registerPlugin(ScrollTrigger);

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  projectType: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function ContactPage() {
  const { language } = useLanguage();
  const [status, setStatus] = useState("");
  const containerRef = useRef(null);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(schema)
  });

  const [socials, setSocials] = useState({
    facebook: "https://facebook.com/alamashik",
    linkedin: "https://linkedin.com/in/alamashik",
    instagram: "https://instagram.com/alamashik",
    twitter: "https://twitter.com/alamashik"
  });

  useEffect(() => {
    async function loadSocials() {
      try {
        const response = await fetchContent("contactDetails", { limit: 1 });
        if (response.items?.[0]?.socialLinks) {
          const links = response.items[0].socialLinks;
          // Only update if the links are actually provided
          setSocials(prev => ({
            ...prev,
            ...(links.facebook && { facebook: links.facebook }),
            ...(links.linkedin && { linkedin: links.linkedin }),
            ...(links.instagram && { instagram: links.instagram }),
            ...(links.twitter && { twitter: links.twitter }),
            ...(links.youtube && { youtube: links.youtube }),
          }));
        }
      } catch (err) {
        console.warn("Server offline or API error. Using static identity fallback.");
      }
    }
    loadSocials();
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
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const onSubmit = async (values) => {
    setStatus("");
    try {
      await submitContact({ ...values, sourcePage: "contact" });
      setStatus("success");
      reset();
      setTimeout(() => setStatus(""), 6000);
    } catch {
      setStatus("error");
    }
  };

  return (
    <div ref={containerRef} style={{ background: "var(--bg)", color: "var(--text)" }} className="min-h-screen relative overflow-hidden">
      <SeoHead
        title="Contact | Civil Engineer in Cox's Bazar | Engr. Alam Ashik"
        description="Connect with Cox's Bazar's premier civil engineering consultancy for high-end residential, commercial, and structural projects."
        path="/contact"
      />

      {/* ── Background Decorative Blobs (The Blending Secret) ────────────────── */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full opacity-[0.08] blur-[120px] pointer-events-none" style={{ background: "var(--highlight)" }} />
      <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] rounded-full opacity-[0.05] blur-[100px] pointer-events-none" style={{ background: "var(--highlight)" }} />

      <section className="pt-32 pb-24 px-6 lg:px-10 mx-auto max-w-[1500px] relative z-10">
         <div className="grid lg:grid-cols-[0.45fr_0.55fr] gap-16 lg:gap-24">
            
            {/* Left Column: Hero & Info */}
            <div className="space-y-16">
               <div className="reveal-unit">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-[10px] font-bold tracking-[0.2em] uppercase"
                    style={{ border: "1px solid var(--highlight-border)", background: "var(--highlight-soft)", color: "var(--highlight)" }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--highlight)" }} />
                    {t("contact_page.eyebrow", language)}
                  </span>
                  <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-6 uppercase" style={{ color: "var(--text)" }}>
                    {t("contact_page.title_part1", language)} <br />
                    <span className="text-glow">{t("contact_page.title_highlight", language)}</span>
                  </h1>
                  <p className="text-lg font-medium leading-relaxed max-w-lg" style={{ color: "var(--text-muted)" }}>
                    {t("contact_page.subtitle", language)}
                  </p>
               </div>

               {/* Info Grid */}
               <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                     <div className="reveal-unit p-8 rounded-2xl flex flex-col gap-6 backdrop-blur-xl transition-all duration-500 group"
                        style={{ background: "var(--bg-card)", border: "1px solid var(--highlight-border)", boxShadow: "0 20px 40px rgba(0,0,0,0.05)" }}>
                        <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(25,210,255,0.15)] group-hover:scale-110 transition-transform"
                          style={{ background: "var(--highlight-soft)", color: "var(--highlight)" }}>
                           <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                        </div>
                        <div>
                           <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: "var(--text-faint)" }}>PHONE</p>
                           <p className="text-lg font-bold tracking-tight" style={{ color: "var(--text)" }}>+880 1234-567890</p>
                        </div>
                     </div>

                     <div className="reveal-unit p-8 rounded-2xl flex flex-col gap-6 backdrop-blur-xl transition-all duration-500 group"
                        style={{ background: "var(--bg-card)", border: "1px solid var(--highlight-border)", boxShadow: "0 20px 40px rgba(0,0,0,0.05)" }}>
                        <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(25,210,255,0.15)] group-hover:scale-110 transition-transform"
                          style={{ background: "var(--highlight-soft)", color: "var(--highlight)" }}>
                           <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                        </div>
                        <div>
                           <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: "var(--text-faint)" }}>EMAIL</p>
                           <p className="text-lg font-bold tracking-tight break-all" style={{ color: "var(--text)" }}>info@engralamashik.com</p>
                        </div>
                     </div>
                  </div>

                  <div className="reveal-unit p-8 rounded-2xl flex flex-col gap-6 backdrop-blur-xl transition-all duration-500 group"
                    style={{ background: "var(--bg-card)", border: "1px solid var(--highlight-border)", boxShadow: "0 20px 40px rgba(0,0,0,0.05)" }}>
                     <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(25,210,255,0.15)] group-hover:scale-110 transition-transform"
                        style={{ background: "var(--highlight-soft)", color: "var(--highlight)" }}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                     </div>
                     <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: "var(--text-faint)" }}>COX'S BAZAR HQ</p>
                        <p className="text-lg font-bold tracking-tight leading-snug" style={{ color: "var(--text)" }}>Cox's Bazar, Bangladesh</p>
                     </div>
                  </div>

                  {/* Local Map */}
                  <div className="reveal-unit p-3 rounded-3xl relative overflow-hidden group aspect-[1.8/1] mt-10 backdrop-blur-md transition-all duration-500"
                    style={{ background: "var(--bg-card)", border: "1px solid var(--highlight-border)", boxShadow: "0 20px 60px rgba(0,0,0,0.1)" }}>
                     <div className="absolute inset-0 bg-[#0A0F1C]/10 transition-all duration-1000 z-10 pointer-events-none group-hover:bg-transparent" />
                     <iframe
                        title="Cox's Bazar HQ"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d118830.24285070288!2d91.90299534335938!3d21.43973!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30adc92136603a11%3A0x6334af2a4d0f5e13!2sCox's%20Bazar!5e0!3m2!1sen!2sbd!4v1712215324538!5m2!1sen!2sbd"
                        className="w-full h-full grayscale opacity-80 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-1000 object-cover rounded-2xl"
                        loading="lazy"
                     />
                     <div className="absolute bottom-6 left-6 z-30 backdrop-blur-md p-4 rounded-xl border border-[rgba(25,210,255,0.2)]"
                        style={{ background: "var(--bg-card)" }}>
                         <p className="text-[#19D2FF] text-[9px] font-bold tracking-widest uppercase mb-1">LOCAL EXPERTISE</p>
                         <p className="font-bold text-[11px]" style={{ color: "var(--text)" }}>Navigate with Maps</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Right Column: Inquiry Form Panel */}
            <div className="reveal-unit p-10 lg:p-16 rounded-3xl relative backdrop-blur-xl border border-[var(--highlight-border)] transition-all duration-500"
                style={{ background: "var(--bg-card)", boxShadow: "0 30px 60px rgba(0,0,0,0.12)" }}>
               <div className="absolute inset-0 opacity-[0.03] hidden md:block rounded-3xl pointer-events-none" style={{ background: "var(--highlight)" }}></div>

               <div className="relative z-10 mb-12">
                  <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 uppercase" style={{ color: "var(--text)" }}>INQUIRY FORM</h2>
                  <p className="leading-relaxed max-w-lg text-[15px] font-medium" style={{ color: "var(--text-muted)" }}>
                    Submit your project parameters and operational requirements for a comprehensive structural review.
                  </p>
               </div>

               <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                     <div className="space-y-3">
                        <label className="text-[10px] font-bold tracking-[0.2em] uppercase ml-1" style={{ color: "var(--text-faint)" }}>FULL NAME</label>
                        <input 
                           {...register("name")} 
                           className="w-full bg-[var(--bg)] border border-[rgba(25,210,255,0.1)] rounded-xl p-5 text-[var(--text)] outline-none focus:border-[#19D2FF] focus:shadow-[0_0_20px_rgba(25,210,255,0.15)] transition-all placeholder:text-[#475569] text-[15px]" 
                           placeholder="John Doe"
                        />
                        {errors.name && <p className="text-[11px] text-red-500 font-bold ml-1 mt-1">{errors.name.message}</p>}
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-bold tracking-[0.2em] uppercase ml-1" style={{ color: "var(--text-faint)" }}>EMAIL ADDRESS</label>
                        <input 
                           {...register("email")} 
                           className="w-full bg-[var(--bg)] border border-[rgba(25,210,255,0.1)] rounded-xl p-5 text-[var(--text)] outline-none focus:border-[#19D2FF] focus:shadow-[0_0_20px_rgba(25,210,255,0.15)] transition-all placeholder:text-[#475569] text-[15px]" 
                           placeholder="john@example.com"
                        />
                        {errors.email && <p className="text-[11px] text-red-500 font-bold ml-1 mt-1">{errors.email.message}</p>}
                     </div>
                  </div>

                  <div className="space-y-3">
                     <label className="text-[10px] font-bold tracking-[0.2em] uppercase ml-1" style={{ color: "var(--text-faint)" }}>PHONE NUMBER</label>
                     <input 
                        {...register("phone")} 
                        className="w-full bg-[var(--bg)] border border-[rgba(25,210,255,0.1)] rounded-xl p-5 text-[var(--text)] outline-none focus:border-[#19D2FF] focus:shadow-[0_0_20px_rgba(25,210,255,0.15)] transition-all placeholder:text-[#475569] text-[15px]" 
                        placeholder="+880 123 456 789"
                     />
                  </div>

                  <div className="space-y-3">
                     <label className="text-[10px] font-bold tracking-[0.2em] uppercase ml-1" style={{ color: "var(--text-faint)" }}>PROJECT TYPE</label>
                     <select
                        {...register("projectType")}
                        className="w-full bg-[var(--bg)] border border-[rgba(25,210,255,0.1)] rounded-xl p-5 text-[var(--text)] outline-none focus:border-[#19D2FF] focus:shadow-[0_0_20px_rgba(25,210,255,0.15)] transition-all text-[15px] appearance-none cursor-pointer"
                     >
                        <option value="">Select a project type...</option>
                        <option value="Residential Building">Residential Building</option>
                        <option value="Commercial Structure">Commercial Structure</option>
                        <option value="Hospitality / Hotel">Hospitality / Hotel</option>
                        <option value="Industrial Facility">Industrial Facility</option>
                        <option value="Infrastructure">Infrastructure</option>
                        <option value="Structural Consultancy">Structural Consultancy</option>
                        <option value="Architectural Design">Architectural Design</option>
                        <option value="Other">Other</option>
                     </select>
                  </div>

                  <div className="space-y-3 relative">
                     <label className="text-[10px] font-bold tracking-[0.2em] uppercase ml-1" style={{ color: "var(--text-faint)" }}>PROJECT DETAILS / MESSAGE</label>
                     <textarea 
                        {...register("message")} 
                        rows={6}
                        className="w-full bg-[var(--bg)] border border-[rgba(25,210,255,0.1)] rounded-xl p-5 text-[var(--text)] outline-none focus:border-[#19D2FF] focus:shadow-[0_0_20px_rgba(25,210,255,0.15)] transition-all placeholder:text-[#475569] resize-none text-[15px] leading-relaxed" 
                        placeholder="Describe your design parameters and structural visions..."
                     />
                     {errors.message && <p className="text-[11px] text-red-500 font-bold ml-1 mt-1">{errors.message.message}</p>}
                  </div>

                  <button 
                     type="submit" 
                     disabled={isSubmitting}
                     className="w-full py-5 bg-[#19D2FF] text-[#0A0F1C] text-[14px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-white transition-all hover:scale-[1.02] shadow-[0_10px_30px_rgba(25,210,255,0.25)] disabled:opacity-50 flex items-center justify-center gap-4 group"
                  >
                     <span>
                        {isSubmitting ? "TRANSMITTING..." : "SUBMIT INQUIRY"}
                     </span>
                     {!isSubmitting && (
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                     )}
                  </button>

                  {status === "success" && (
                    <div className="p-5 rounded-xl backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-[12px] font-black uppercase tracking-widest text-center mt-6 flex items-center justify-center gap-3"
                      style={{ background: "rgba(16,185,129,0.08)" }}>
                       <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                       Inquiry submitted! We will contact you within 24 hours.
                    </div>
                  )}
                  {status === "error" && (
                    <div className="p-5 rounded-xl backdrop-blur-md border border-red-500/30 text-red-400 text-[12px] font-black uppercase tracking-widest text-center mt-6"
                      style={{ background: "rgba(239,68,68,0.08)" }}>
                       Submission failed. Please try again or contact us directly.
                    </div>
                  )}
               </form>

               {/* Social Identity Section */}
               <div className="relative z-10 mt-16 pt-10 border-t" style={{ borderTopColor: "var(--highlight-border)" }}>
                  <p className="text-[10px] font-black tracking-[0.4em] uppercase mb-8 text-center" style={{ color: "var(--text-faint)" }}>Digital Network Identity</p>
                  <div className="flex flex-wrap justify-center gap-6">
                     {[
                        { id: 'facebook', icon: Facebook, url: socials.facebook },
                        { id: 'linkedin', icon: Linkedin, url: socials.linkedin },
                        { id: 'instagram', icon: Instagram, url: socials.instagram },
                        { id: 'twitter', icon: Twitter, url: socials.twitter },
                        { id: 'youtube', icon: Youtube, url: socials.youtube },
                     ].filter(s => s.url).map((social) => (
                        <a 
                           key={social.id}
                           href={social.url}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all group border border-[var(--highlight-border)] bg-[var(--bg)] text-[var(--text-muted)] hover:border-[var(--highlight)] hover:text-[var(--highlight)] hover:shadow-[0_0_20px_rgba(25,210,255,0.2)]"
                           aria-label={social.id}
                        >
                           <social.icon size={22} className="group-hover:scale-110 transition-transform" />
                        </a>
                     ))}
                  </div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.3em] mt-8 text-center italic" style={{ color: "var(--text-faint)" }}>Encryption Profile: 256-Bit Identity Protocol</p>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
