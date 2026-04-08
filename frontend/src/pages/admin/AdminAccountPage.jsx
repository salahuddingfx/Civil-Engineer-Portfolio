import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { 
  ShieldCheck, 
  ArrowLeft, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  Shield,
  Fingerprint
} from "lucide-react";
import { updateAdminProfile } from "../../lib/api";
import { useLanguage } from "../../context/LanguageContext";
import GlassCard from "../../components/GlassCard";

export default function AdminAccountPage() {
  const { language } = useLanguage();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(""); // 'success' or 'error'
  const [saving, setSaving] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.from(".admin-account-reveal", {
      opacity: 0,
      y: 40,
      stagger: 0.1,
      duration: 1.2,
      ease: "power4.out",
    });
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setStatus("");

    try {
      const payload = {
        currentPassword,
        ...(newEmail ? { newEmail } : {}),
        ...(newPassword ? { newPassword } : {}),
      };
      await updateAdminProfile(payload);
      setStatus("success");
      setMessage(language === 'en' ? "Success: Security Credentials Updated" : "সফলভাবেই সিকিউরিটি ক্রেডেনশিয়াল আপডেট করা হয়েছে");
      setCurrentPassword("");
      setNewPassword("");
      gsap.from(".status-msg", { scale: 0.95, opacity: 0, duration: 0.5 });
    } catch (error) {
      setStatus("error");
      setMessage(language === 'en' ? "Error: Authentication Failure" : "ত্রুটি: অথেন্টিকেশন ব্যর্থ হয়েছে");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div ref={containerRef} className="mx-auto mt-8 md:mt-16 max-w-4xl px-4 md:px-8 pb-32 bg-tech-grid min-h-screen">
      <header className="admin-account-reveal mb-8 md:mb-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-10 text-left">
        <div className="flex items-center gap-6">
          <div className="h-16 w-16 rounded-[24px] border border-white/5 bg-white/2 flex items-center justify-center text-cyan-400">
            <ShieldCheck size={32} />
          </div>
          <div>
            <p className="font-display text-[9px] md:text-[11px] tracking-[0.4em] md:tracking-[0.6em] text-cyan-400 uppercase font-bold italic mb-2">{language === 'en' ? "Security Protocol" : "সিকিউরিটি প্রোটোকল"}</p>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter italic uppercase">{language === 'en' ? "Profile Access" : "প্রোফাইল অ্যাক্সেস"}</h1>
          </div>
        </div>
        <Link to="/admin/dashboard" className="flex items-center gap-3 w-full md:w-auto px-10 py-5 rounded-[20px] md:rounded-[28px] border border-white/5 bg-white/2 font-display text-[9px] md:text-[11px] font-bold text-cyan-400 uppercase tracking-widest hover:bg-white/10 transition-all text-center italic group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          {language === 'en' ? "Exit Settings" : "সেটিংস থেকে বের হন"}
        </Link>
      </header>

      <GlassCard className="admin-account-reveal relative overflow-hidden p-8 md:p-20 shadow-[0_80px_160px_rgba(0,0,0,0.8)] text-left rounded-[40px] md:rounded-[80px]">
        <div className="absolute top-0 right-0 h-1.5 md:h-2 w-40 md:w-60 bg-cyan-400 opacity-60" />
        
        <div className="mb-12 md:mb-16 border-b border-white/5 pb-8 md:pb-12 text-left text-[#555]">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
             <Fingerprint size={16} className="text-cyan-400/40" />
             <p className="font-display text-[10px] md:text-[11px] tracking-[0.4em] md:tracking-[0.5em] text-cyan-400 uppercase font-bold italic">{language === 'en' ? "Identity Verification" : "আইডেন্টিটি ভেরিফিকেশন"}</p>
          </div>
          <p className="text-base md:text-lg leading-relaxed font-medium italic">{language === 'en' ? "Administrative security framework and professional access control. Multi-layer verification established for all sensitive data modifications." : "প্রশাসনিক নিরাপত্তা কাঠামো এবং পেশাদার অ্যাক্সেস নিয়ন্ত্রণ। সমস্ত সংবেদনশীল তথ্য পরিবর্তনের জন্য মাল্টি-লেয়ার ভেরিফিকেশন প্রতিষ্ঠিত।"}</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-12 md:space-y-16">
          <div className="space-y-4 md:space-y-6 text-left">
            <label className="text-[10px] md:text-[11px] font-bold text-[#333] uppercase tracking-[0.3em] md:tracking-[0.4em] ml-2 italic">{language === 'en' ? "Current Authorization Key" : "বর্তমান পাসওয়ার্ড"}</label>
            <div className="relative group">
               <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-cyan-400 transition-colors">
                  <Lock size={20} />
               </span>
               <input
                type={showPass1 ? "text" : "password"}
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                required
                className="w-full rounded-[20px] md:rounded-[32px] border border-white/5 bg-black/40 px-6 md:px-14 py-5 md:py-7 text-white outline-none focus:border-cyan-400/40 font-bold tracking-widest italic shadow-inner"
                placeholder="••••••••••••"
              />
              <button 
                 type="button" 
                 onClick={() => setShowPass1(!showPass1)}
                 className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 p-2 hover:bg-white/5 rounded-full transition-colors text-cyan-400"
              >
                {showPass1 ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="grid gap-10 md:gap-16 md:grid-cols-2 text-left">
             <div className="space-y-4 md:space-y-6">
                <label className="text-[10px] md:text-[11px] font-bold text-[#333] uppercase tracking-[0.3em] md:tracking-[0.4em] ml-2 italic">{language === 'en' ? "Professional Identity (Email)" : "ইমেইল অ্যাড্রেস"}</label>
                <div className="relative group">
                   <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-cyan-400 transition-colors">
                      <Mail size={20} />
                   </span>
                   <input
                     value={newEmail}
                     onChange={(event) => setNewEmail(event.target.value)}
                     placeholder="admin@engralamashik.com"
                     className="w-full rounded-[20px] md:rounded-[28px] border border-white/5 bg-black/40 px-6 md:px-14 py-5 md:py-7 text-white outline-none focus:border-cyan-400/40 font-bold italic shadow-inner"
                   />
                </div>
             </div>

             <div className="space-y-4 md:space-y-6">
                <label className="text-[10px] md:text-[11px] font-bold text-[#333] uppercase tracking-[0.3em] md:tracking-[0.4em] ml-2 italic">{language === 'en' ? "New Access Secret" : "নতুন পাসওয়ার্ড"}</label>
                <div className="relative group">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-cyan-400 transition-colors">
                     <Shield size={20} />
                  </span>
                  <input
                    type={showPass2 ? "text" : "password"}
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-[20px] md:rounded-[28px] border border-white/5 bg-black/40 px-6 md:px-14 py-5 md:py-7 text-white outline-none focus:border-cyan-400/40 font-bold tracking-widest italic shadow-inner"
                  />
                  <button 
                     type="button" 
                     onClick={() => setShowPass2(!showPass2)}
                     className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 p-2 hover:bg-white/5 rounded-full transition-colors text-cyan-400"
                  >
                    {showPass2 ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
             </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-12 border-t border-white/5 pt-12 md:pt-16">
            <button 
              type="submit" 
              disabled={saving} 
              className="group relative overflow-hidden rounded-[20px] md:rounded-[32px] bg-cyan-600 px-10 md:px-16 py-6 md:py-7 font-bold shadow-[0_30px_60px_rgba(0,210,255,0.2)] transition-all hover:translate-y-[-4px] hover:shadow-[0_45px_90px_rgba(0,210,255,0.4)] disabled:opacity-50 w-full md:min-w-[340px] flex items-center justify-center gap-4"
            >
               <span className="relative z-10 text-[9px] md:text-[11px] uppercase tracking-[0.5em] md:tracking-[0.6em] text-black italic font-black">
                 {saving ? (language === 'en' ? "Synchronizing..." : "আপডেট হচ্ছে...") : (language === 'en' ? "Commit Security Updates" : "সিকিউরিটি আপডেট করুন")}
               </span>
               <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <div className="hidden md:block h-2.5 w-2.5 rounded-full bg-slate-900 animate-pulse" />
          </div>

          {message ? (
             <div className={`status-msg mt-8 md:mt-12 rounded-[24px] md:rounded-[40px] border p-8 md:p-10 text-center text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] italic shadow-2xl transition-all ${status === 'success' ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" : "border-rose-500/20 bg-rose-500/5 text-rose-400"}`}>
                <span className="flex items-center justify-center gap-4 md:gap-6">
                   {status === 'success' ? <CheckCircle2 size={16} className="text-emerald-500 animate-bounce" /> : <AlertCircle size={16} className="text-rose-500 animate-pulse" />}
                   {message}
                </span>
             </div>
          ) : null}
        </form>
      </GlassCard>

      <footer className="admin-account-reveal mt-16 md:mt-32 font-display text-[8px] md:text-[11px] text-[#222] uppercase tracking-[1em] md:tracking-[1.5em] text-center border-t border-white/5 pt-12 md:pt-16 px-6 md:px-12 font-bold italic flex flex-col md:flex-row justify-between items-center gap-6">
        <span className="opacity-40">Identity Management Node</span>
        <div className="flex items-center gap-4">
          <div className="h-1 w-1 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-cyan-400/20">Authorization Level 4.9</span>
        </div>
      </footer>
    </div>
  );
}
