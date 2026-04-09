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
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden group/login">
      <SeoHead title="System Access | Engr. Alam Ashik" description="Secure entry for authorized personnel." path="/admin" />
      
      {/* Cinematic Background Layer */}
      <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 via-transparent to-violet-500/5 pointer-events-none" />
      
      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Dynamic Glow Orbs */}
      <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-violet-500/10 blur-[120px] rounded-full animate-pulse pointer-events-none" />

      <div ref={formRef} className="relative z-10 w-full max-w-[500px]">
         {/* Premium Glass Container */}
         <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 rounded-[48px] blur-xl opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
            
            <div className="relative glass-card rounded-[48px] p-10 md:p-14 border border-white/[0.05] bg-[#080c14]/90 backdrop-blur-3xl shadow-2xl">
               
               {/* Identity Header */}
               <div className="text-center mb-14">
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.05] mb-8">
                     <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
                     <span className="text-[9px] font-black uppercase tracking-[0.4em] text-cyan-400/80">Secure Portal v6.1</span>
                  </div>
                  
                  <h1 className="font-display text-3xl font-black tracking-[0.15em] text-white flex items-center justify-center gap-2">
                     ALAM<span className="text-cyan-400">.</span>ASHIK
                  </h1>
                  <p className="mt-4 text-[10px] uppercase tracking-[0.5em] text-slate-500 font-bold italic">Structural Authority Panel</p>
               </div>

               <form onSubmit={onSubmit} className="space-y-8">
                  {/* Identity Field */}
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-500 tracking-[0.3em] uppercase ml-2 flex items-center gap-2">
                        <svg className="w-3 h-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        Operator ID
                     </label>
                     <div className="relative group/input">
                        <input 
                           type="email"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           placeholder="Enter credentials..."
                           className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 pl-7 text-[13px] text-white outline-none focus:border-cyan-400/50 focus:bg-white/[0.05] transition-all placeholder:text-slate-700 italic font-medium"
                           required
                        />
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-cyan-400 group-focus-within/input:w-[80%] transition-all duration-500" />
                     </div>
                  </div>

                  {/* Security Key Field */}
                  <div className="space-y-3">
                     <div className="flex justify-between items-center px-2">
                        <label className="text-[10px] font-black text-slate-500 tracking-[0.3em] uppercase flex items-center gap-2">
                           <svg className="w-3 h-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                           Encryption Key
                        </label>
                        <button type="button" className="text-[9px] font-bold text-slate-600 uppercase tracking-widest hover:text-cyan-400 transition-colors italic">Reset?</button>
                     </div>
                     <div className="relative group/input">
                        <input 
                           type={showPassword ? "text" : "password"}
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           placeholder="••••••••••••"
                           className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 pl-7 pr-14 text-[13px] text-white outline-none focus:border-cyan-400/50 focus:bg-white/[0.05] transition-all placeholder:text-slate-700 tracking-[0.3em]"
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
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-cyan-400 group-focus-within/input:w-[80%] transition-all duration-500" />
                     </div>
                  </div>

                  {/* Action Button */}
                  <button 
                     type="submit"
                     disabled={isLoading}
                     className="w-full py-5 bg-cyan-500 text-black text-[11px] font-black uppercase tracking-[0.5em] rounded-2xl hover:bg-cyan-400 transition-all shadow-[0_20px_40px_rgba(34,211,238,0.15)] disabled:opacity-50 flex items-center justify-center gap-4 group mt-10 active:scale-95"
                  >
                     {isLoading ? "AUTHORIZING..." : "Initialize Access"}
                     <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                  </button>

                  {error && (
                    <div className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-rose-500 text-[9px] font-black uppercase tracking-[0.3em] text-center animate-pulse italic">
                       {error}
                    </div>
                  )}
               </form>

               {/* Design Detail */}
               <div className="mt-14 pt-8 border-t border-white/[0.03] flex justify-between items-center text-[8px] font-black uppercase tracking-[0.4em] text-slate-700 italic">
                  <span>System: Active</span>
                  <div className="flex gap-2">
                     <div className="w-1 h-1 rounded-full bg-cyan-400/20" />
                     <div className="w-3 h-1 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                     <div className="w-1 h-1 rounded-full bg-cyan-400/20" />
                  </div>
                  <span>v6.1-Core</span>
               </div>
            </div>
         </div>

         {/* Cinematic References */}
         <div className="mt-10 flex flex-col items-center gap-3 opacity-20 pointer-events-none">
            <div className="w-px h-12 bg-gradient-to-b from-cyan-400 transparent" />
            <p className="text-[9px] font-mono text-cyan-400 uppercase tracking-[0.4em]">Secure Auth Terminal</p>
         </div>
      </div>
    </div>

  );
}
