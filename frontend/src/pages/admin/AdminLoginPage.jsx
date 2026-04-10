import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import gsap from "gsap";
import { useLanguage } from "../../context/LanguageContext";
import SeoHead from "../../components/SeoHead";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ChevronRight, Loader2 } from "lucide-react";
import "../../styles/admin.css";

export default function AdminLoginPage() {
  const { language } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(cardRef.current, 
      { opacity: 0, y: 30, scale: 0.98 }, 
      { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power4.out" }
    );
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (isLoading) return;
    setError("");
    setIsLoading(true);

    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("adminAccessToken", data.accessToken);
      localStorage.setItem("adminRefreshToken", data.refreshToken);
      
      gsap.to(cardRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.6,
        ease: "power4.in",
        onComplete: () => navigate("/admin/dashboard", { replace: true }),
      });
    } catch {
      setError(language === 'en' ? "Authentication failed: Invalid credentials" : "প্রবেশাধিকার ব্যর্থ: ভুল তথ্য");
      setIsLoading(false);
      gsap.fromTo(cardRef.current, { x: -4 }, { x: 4, duration: 0.05, repeat: 5, yoyo: true });
    }
  };

  return (
    <div ref={containerRef} className="admin-layout min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <SeoHead title="System Access | Engr. Alam Ashik" description="Secure entry for authorized personnel." path="/admin" />
      
      {/* 1. Backdrop Grid */}
      <div className="admin-blueprint-grid" />
      <div className="absolute top-0 right-0 h-1/2 w-1/2 bg-sky-500/[0.03] blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 h-1/2 w-1/2 bg-blue-500/[0.02] blur-[120px] rounded-full" />

      {/* 2. Login Card */}
      <div ref={cardRef} className="w-full max-w-[420px] relative">
         <div className="admin-card p-10 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-1 w-32 bg-gradient-to-l from-[#19D2FF]/20 to-transparent" />
            
            {/* Brand Header */}
            <div className="mb-12 text-center">
               <div className="flex justify-center mb-6">
                 <div className="p-4 rounded-2xl bg-[var(--admin-card)] border border-[color:var(--admin-border)] text-sky-600 shadow-inner">
                    <ShieldCheck size={32} strokeWidth={1.5} />
                 </div>
               </div>
                <h1 className="text-2xl font-black text-[color:var(--admin-text-heading)] tracking-tight uppercase">
                   Admin Access
                </h1>
                <p className="mt-2 text-[10px] font-bold text-[color:var(--admin-text-muted)] opacity-80 uppercase tracking-widest">Engr. Alam Ashik</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
               {/* Email Input */}
               <div className="space-y-2">
                   <label className="flex items-center gap-2 text-[10px] font-bold text-[color:var(--admin-text-muted)] uppercase tracking-widest ml-1">
                    <Mail size={12} /> 
                    Email Address
                  </label>
                  <input 
                     type="email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     className="admin-input w-full"
                     placeholder="admin@agency.com"
                     required
                  />
               </div>

               {/* Password Input */}
               <div className="space-y-2">
                   <label className="flex items-center gap-2 text-[10px] font-bold text-[color:var(--admin-text-muted)] uppercase tracking-widest ml-1">
                    <Lock size={12} /> 
                    Password
                  </label>
                  <div className="relative group">
                     <input 
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="admin-input w-full pr-12"
                        placeholder="••••••••••••"
                        required
                     />
                     <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[color:var(--admin-text-label)] hover:text-sky-600 transition-colors"
                     >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                     </button>
                  </div>
               </div>

               {/* Error Display */}
               {error && (
                 <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/5 border border-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                    <AlertCircle size={14} />
                    {error}
                 </div>
               )}

               {/* Login Trigger */}
               <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-sky-500 text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_24px_rgba(25,210,255,0.2)] disabled:opacity-50 flex items-center justify-center gap-3 relative overflow-hidden group/btn"
               >
                  <div className="absolute inset-0 bg-[var(--admin-card)] opacity-70 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000 skew-x-12" />
                   {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ChevronRight size={18} strokeWidth={2} />
                    </>
                  )}
               </button>
            </form>

             <div className="mt-8 flex justify-center border-t border-[color:var(--admin-border)] pt-8">
               <div className="px-4 text-[9px] font-bold text-[color:var(--admin-text-muted)] opacity-60 uppercase tracking-[0.3em]">SECURE PORTAL</div>
             </div>
         </div>
         
         {/* Footer Attribution */}
         <p className="mt-10 text-center text-[9px] font-black text-[color:var(--admin-text-secondary)] uppercase tracking-[0.3em] italic">
            © 2026 Studio Arch Consultancy
         </p>
      </div>
    </div>
  );
}

// Minimal AlertCircle icon since we didn't import it
function AlertCircle({ size }) {
   return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
         <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
   )
}
