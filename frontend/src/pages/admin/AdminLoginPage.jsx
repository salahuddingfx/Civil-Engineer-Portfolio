import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import gsap from "gsap";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lib/translations";
import SeoHead from "../../components/SeoHead";

export default function AdminLoginPage() {
  const { language } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const formRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(formRef.current, {
        opacity: 0,
        y: 40,
        duration: 1.2,
        stagger: 0.1,
        ease: "power4.out",
      });
    }, formRef);
    return () => ctx.revert();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("adminAccessToken", data.accessToken);
      localStorage.setItem("adminRefreshToken", data.refreshToken);
      
      gsap.to(formRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        ease: "power4.in",
        onComplete: () => navigate("/admin/dashboard", { replace: true }),
      });
    } catch {
      setError(language === 'en' ? "Authentication failure: Invalid credentials" : "প্রবেশাধিকার ব্যর্থ: ভুল তথ্য");
      setIsLoading(false);
      gsap.fromTo(formRef.current, { x: -10 }, { x: 10, duration: 0.08, repeat: 5, yoyo: true });
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6 relative overflow-hidden">
      <SeoHead title="System Access | Engr. Alam Ashik" description="Secure entry for authorized personnel." path="/admin" />
      
      {/* Clean Grid Background */}
      <div className="absolute inset-0 bg-tech-grid opacity-[0.05] pointer-events-none" />
      
      {/* Single Subtle Accent Glow */}
      <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-cyan-500/[0.03] blur-[150px] rounded-full pointer-events-none" />

      <div ref={formRef} className="relative z-10 w-full max-w-[460px]">
         <div className="glass-card rounded-[32px] p-10 md:p-14 border border-white/[0.08] bg-[#080c14]/80 backdrop-blur-xl shadow-2xl">
            
            {/* Minimalist Header */}
            <div className="text-center mb-12">
               <h1 className="font-display text-2xl font-black tracking-[0.05em] text-white italic uppercase leading-tight">
                  Engr. Alam Ashik<br/>
                  <span className="text-cyan-400 text-lg tracking-[0.3em]">Admin Panel</span>
               </h1>
               <div className="mt-4 flex items-center justify-center gap-4">
                  <div className="h-px w-8 bg-white/10" />
                  <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-bold">Authorized Access</p>
                  <div className="h-px w-8 bg-white/10" />
               </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
               {/* Identity Field */}
               <div className="space-y-2.5">
                  <label className="text-[9px] font-black text-slate-500 tracking-[0.2em] uppercase ml-1">Email Identifier</label>
                  <input 
                     type="email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     placeholder="name@agency.com"
                     className="w-full bg-white/[0.02] border border-white/[0.1] rounded-2xl p-5 text-[13px] text-white outline-none focus:border-cyan-400/40 focus:bg-white/[0.04] transition-all placeholder:text-slate-700"
                     required
                  />
               </div>

               {/* Security Key Field */}
               <div className="space-y-2.5">
                  <div className="flex justify-between items-center px-1">
                     <label className="text-[9px] font-black text-slate-500 tracking-[0.2em] uppercase">Security Key</label>
                  </div>
                  <div className="relative group">
                     <input 
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-white/[0.02] border border-white/[0.1] rounded-2xl p-5 pr-14 text-[13px] text-white outline-none focus:border-cyan-400/40 focus:bg-white/[0.04] transition-all placeholder:text-slate-700 tracking-[0.2em]"
                        required
                     />
                     <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-cyan-400 transition-colors"
                     >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        )}
                     </button>
                  </div>
               </div>

               {/* Action Button */}
               <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-5 bg-white text-black text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-cyan-400 transition-all disabled:opacity-50 flex items-center justify-center gap-3 mt-8 active:scale-[0.98]"
               >
                  {isLoading ? "Checking..." : "Sign In"}
                  {!isLoading && <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>}
               </button>

               {error && (
                 <div className="pt-4 text-rose-500 text-[10px] font-bold uppercase tracking-widest text-center animate-pulse">
                    {error}
                 </div>
               )}
            </form>

            <div className="mt-12 pt-8 border-t border-white/[0.05] text-center">
               <p className="text-[8px] font-bold text-slate-700 uppercase tracking-[0.5em]">Secure Terminal • v6.1</p>
            </div>
         </div>
      </div>
    </div>
  );
}
