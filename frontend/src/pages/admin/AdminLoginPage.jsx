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
      gsap.from(".login-reveal", {
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
      setError(language === 'en' ? "AUTHENTICATION FAILURE: INVALID PROTOCOL" : "প্রবেশাধিকার ব্যর্থ: ভুল তথ্য");
      setIsLoading(false);
      gsap.fromTo(formRef.current, { x: -10 }, { x: 10, duration: 0.08, repeat: 5, yoyo: true });
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 bg-tech-grid relative overflow-hidden">
      <SeoHead title="Admin Access | Engr. Alam Ashik" description="Secure entry for authorized personnel." path="/admin" />
      
      {/* Cinematic Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] aspect-square bg-cyan-400/5 blur-[120px] rounded-full pointer-events-none" />

      <div ref={formRef} className="login-reveal relative z-10 w-full max-w-[560px]">
         {/* Glassmorphic Login Panel */}
         <div className="glass-card rounded-[40px] p-12 md:p-16 border border-white/5 bg-[#0a0a0a]/80 backdrop-blur-3xl shadow-[0_80px_160px_rgba(0,0,0,0.8)]">
            
            {/* Header */}
            <div className="text-center mb-16">
               <div className="flex items-center justify-center gap-2 font-display text-2xl font-black tracking-[0.2em] text-white mb-2">
                  ALAM<span className="text-cyan-400">.</span>ASHIK
               </div>
               <p className="text-[10px] uppercase tracking-[0.5em] text-[#444] font-bold">Technical Sophistication</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-10">
               {/* Identity Access Field */}
               <div className="space-y-4">
                  <label className="text-[10px] font-bold text-[#444] tracking-[0.3em] uppercase ml-4 italic">Identity Access</label>
                  <div className="relative group">
                     <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-cyan-400 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206"/></svg>
                     </span>
                     <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Username or Engineering ID"
                        className="w-full bg-black/60 border border-white/10 rounded-2xl p-6 pl-16 text-white outline-none focus:border-cyan-400/50 transition-all placeholder:text-[#222]"
                        required
                     />
                  </div>
               </div>

               {/* Security Key Field */}
               <div className="space-y-4">
                  <div className="flex justify-between px-4">
                     <label className="text-[10px] font-bold text-[#444] tracking-[0.3em] uppercase italic">Security Key</label>
                     <button type="button" className="text-[10px] font-bold text-cyan-400/40 uppercase tracking-widest hover:text-cyan-400 transition-colors">Forgot?</button>
                  </div>
                  <div className="relative group">
                     <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-cyan-400 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                     </span>
                     <input 
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-black/60 border border-white/10 rounded-2xl p-6 pl-16 pr-16 text-white outline-none focus:border-cyan-400/50 transition-all placeholder:text-[#222] tracking-widest"
                        required
                     />
                     <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                     >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                     </button>
                  </div>
               </div>

               {/* Sign In Button */}
               <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-6 bg-cyan-400 text-black text-[12px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-cyan-300 transition-all shadow-[0_20px_60px_rgba(0,210,255,0.2)] disabled:opacity-50 flex items-center justify-center gap-4 group mt-6"
               >
                  {isLoading ? "ESTABLISHING..." : "Sign In"}
                  <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
               </button>

               {error && (
                 <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20 text-rose-500 text-[10px] font-bold uppercase tracking-widest text-center animate-pulse">
                    {error}
                 </div>
               )}
            </form>

            {/* Footer */}
            <div className="mt-16 pt-10 border-t border-white/5">
                <div className="flex flex-col items-center gap-6">
                   <div className="flex items-center gap-3 text-[10px] font-bold text-[#444] uppercase tracking-widest">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                      Secure Engineering Portal
                   </div>
                   
                   {/* Step Indicator */}
                   <div className="flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                      <div className="w-4 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#00d2ff]" />
                      <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                   </div>
                </div>
            </div>
         </div>

         {/* Bottom Support Text */}
         <p className="mt-12 text-center text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] italic">
            In case of authentication failure, contact the <span className="text-white/40">System Administrator</span>.
         </p>
      </div>

      {/* Admin Axis References (Decorative) */}
      <div className="absolute top-10 right-10 flex gap-4 opacity-5 pointer-events-none hidden md:flex">
         <div className="w-[1px] h-32 bg-cyan-400" />
         <div className="text-[10px] font-mono text-cyan-400 mt-4 [writing-mode:vertical-lr]">AXIS_REF: 09-X</div>
      </div>
    </div>
  );
}
