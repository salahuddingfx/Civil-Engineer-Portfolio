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

gsap.registerPlugin(ScrollTrigger);

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function ContactPage() {
  const { language } = useLanguage();
  const [status, setStatus] = useState("");
  const containerRef = useRef(null);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(schema)
  });

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
      setStatus("INQUIRY RECEIVED SUBMITTED");
      reset();
      setTimeout(() => setStatus(""), 5000);
    } catch {
      setStatus("SUBMISSION FAILED");
    }
  };

  return (
    <div ref={containerRef} style={{ background: "var(--bg)", color: "var(--text)" }} className="min-h-screen">
      <SeoHead
        title="Contact | Civil Engineer in Cox's Bazar | Engr. Alam Ashik"
        description="Connect with Cox's Bazar's premier civil engineering consultancy for high-end residential, commercial, and structural projects."
        path="/contact"
      />

      <section className="pt-32 pb-24 px-6 lg:px-10 mx-auto max-w-[1500px]">
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
                     <div className="reveal-unit bg-[#111827] p-8 rounded-2xl flex flex-col gap-6 border border-[rgba(25,210,255,0.05)] hover:border-[#19D2FF]/40 transition-colors shadow-lg group">
                        <div className="w-14 h-14 rounded-full bg-[#19D2FF]/10 flex items-center justify-center text-[#19D2FF] shadow-[0_0_15px_rgba(25,210,255,0.15)] group-hover:scale-110 transition-transform">
                           <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                        </div>
                        <div>
                           <p className="text-[10px] text-[#CBD5E1] font-bold uppercase tracking-[0.2em] mb-2">PHONE</p>
                           <p className="text-lg font-bold tracking-tight text-white">+880 1234-567890</p>
                        </div>
                     </div>

                     <div className="reveal-unit bg-[#111827] p-8 rounded-2xl flex flex-col gap-6 border border-[rgba(25,210,255,0.05)] hover:border-[#19D2FF]/40 transition-colors shadow-lg group">
                        <div className="w-14 h-14 rounded-full bg-[#19D2FF]/10 flex items-center justify-center text-[#19D2FF] shadow-[0_0_15px_rgba(25,210,255,0.15)] group-hover:scale-110 transition-transform">
                           <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                        </div>
                        <div>
                           <p className="text-[10px] text-[#CBD5E1] font-bold uppercase tracking-[0.2em] mb-2">EMAIL</p>
                           <p className="text-lg font-bold tracking-tight text-white">info@engralamashik.com</p>
                        </div>
                     </div>
                  </div>

                  <div className="reveal-unit bg-[#111827] p-8 rounded-2xl flex flex-col gap-6 border border-[rgba(25,210,255,0.05)] hover:border-[#19D2FF]/40 transition-colors shadow-lg group">
                     <div className="w-14 h-14 rounded-full bg-[#19D2FF]/10 flex items-center justify-center text-[#19D2FF] shadow-[0_0_15px_rgba(25,210,255,0.15)] group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                     </div>
                     <div>
                        <p className="text-[10px] text-[#CBD5E1] font-bold uppercase tracking-[0.2em] mb-2">COX'S BAZAR HQ</p>
                        <p className="text-lg font-bold tracking-tight text-white leading-snug">Cox's Bazar, Bangladesh</p>
                     </div>
                  </div>

                  {/* Local Map */}
                  <div className="reveal-unit bg-[#111827] p-4 rounded-3xl relative overflow-hidden group aspect-[1.8/1] mt-10 shadow-[0_20px_40px_rgba(10,15,28,0.5)] border border-[rgba(25,210,255,0.1)]">
                     <div className="absolute inset-0 bg-[#0A0F1C]/20 transition-all duration-1000 z-10 pointer-events-none group-hover:bg-transparent" />
                     <iframe
                        title="Cox's Bazar HQ"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d118830.24285070288!2d91.90299534335938!3d21.43973!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30adc92136603a11%3A0x6334af2a4d0f5e13!2sCox's%20Bazar!5e0!3m2!1sen!2sbd!4v1712215324538!5m2!1sen!2sbd"
                        className="w-full h-full grayscale-[50%] opacity-80 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-1000 object-cover"
                        loading="lazy"
                     />
                     <div className="absolute bottom-6 left-6 z-30 bg-[#0A0F1C]/90 backdrop-blur-md p-4 rounded-xl border border-[rgba(25,210,255,0.2)]">
                         <p className="text-[#19D2FF] text-[9px] font-bold tracking-widest uppercase mb-1">LOCAL EXPERTISE</p>
                         <p className="text-[#CBD5E1] font-bold text-[11px]">Navigate with Maps</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Right Column: Inquiry Form Panel */}
            <div className="reveal-unit bg-[#111827] p-10 lg:p-16 rounded-3xl relative border border-[#19D2FF]/20 shadow-[0_30px_60px_rgba(10,15,28,0.8)]">
               <div className="absolute inset-0 bg-[#19D2FF]/5 hidden md:block rounded-3xl pointer-events-none"></div>

               <div className="relative z-10 mb-12 text-white">
                  <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 uppercase">INQUIRY FORM</h2>
                  <p className="text-[#CBD5E1] leading-relaxed max-w-lg text-[15px] font-medium">
                    Submit your project parameters and operational requirements for a comprehensive structural review.
                  </p>
               </div>

               <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                     <div className="space-y-3">
                        <label className="text-[10px] font-bold text-[#CBD5E1] tracking-[0.2em] uppercase ml-1">FULL NAME</label>
                        <input 
                           {...register("name")} 
                           className="w-full bg-[#0A0F1C] border border-[rgba(25,210,255,0.1)] rounded-xl p-5 text-white outline-none focus:border-[#19D2FF] focus:shadow-[0_0_20px_rgba(25,210,255,0.2)] transition-all placeholder:text-[#475569] text-[15px]" 
                           placeholder="John Doe"
                        />
                        {errors.name && <p className="text-[11px] text-red-500 font-bold ml-1 mt-1">{errors.name.message}</p>}
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-bold text-[#CBD5E1] tracking-[0.2em] uppercase ml-1">EMAIL ADDRESS</label>
                        <input 
                           {...register("email")} 
                           className="w-full bg-[#0A0F1C] border border-[rgba(25,210,255,0.1)] rounded-xl p-5 text-white outline-none focus:border-[#19D2FF] focus:shadow-[0_0_20px_rgba(25,210,255,0.2)] transition-all placeholder:text-[#475569] text-[15px]" 
                           placeholder="john@example.com"
                        />
                        {errors.email && <p className="text-[11px] text-red-500 font-bold ml-1 mt-1">{errors.email.message}</p>}
                     </div>
                  </div>

                  <div className="space-y-3">
                     <label className="text-[10px] font-bold text-[#CBD5E1] tracking-[0.2em] uppercase ml-1">PHONE NUMBER</label>
                     <input 
                        {...register("phone")} 
                        className="w-full bg-[#0A0F1C] border border-[rgba(25,210,255,0.1)] rounded-xl p-5 text-white outline-none focus:border-[#19D2FF] focus:shadow-[0_0_20px_rgba(25,210,255,0.2)] transition-all placeholder:text-[#475569] text-[15px]" 
                        placeholder="+880 123 456 789"
                     />
                  </div>

                  <div className="space-y-3 relative">
                     <label className="text-[10px] font-bold text-[#CBD5E1] tracking-[0.2em] uppercase ml-1">PROJECT DETAILS / MESSAGE</label>
                     <textarea 
                        {...register("message")} 
                        rows={6}
                        className="w-full bg-[#0A0F1C] border border-[rgba(25,210,255,0.1)] rounded-xl p-5 text-white outline-none focus:border-[#19D2FF] focus:shadow-[0_0_20px_rgba(25,210,255,0.2)] transition-all placeholder:text-[#475569] resize-none text-[15px] leading-relaxed" 
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

                  {status && (
                    <div className="p-4 rounded-xl bg-[#19D2FF]/10 border border-[#19D2FF]/30 text-[#19D2FF] text-[11px] font-bold uppercase tracking-widest text-center mt-6 shadow-[0_0_15px_rgba(25,210,255,0.1)]">
                       {status}
                    </div>
                  )}
               </form>
            </div>
         </div>
      </section>
    </div>
  );
}
