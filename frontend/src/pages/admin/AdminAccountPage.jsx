import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
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

    try {
      const payload = {
        currentPassword,
        ...(newEmail ? { newEmail } : {}),
        ...(newPassword ? { newPassword } : {}),
      };
      await updateAdminProfile(payload);
      setMessage(language === 'en' ? "Success: Security Credentials Updated" : "সফলভাবে সিকিউরিটি ক্রেডেনশিয়াল আপডেট করা হয়েছে");
      setCurrentPassword("");
      setNewPassword("");
      gsap.from(".status-msg", { scale: 0.95, opacity: 0, duration: 0.5 });
    } catch (error) {
      setMessage(language === 'en' ? "Error: Authentication Failure" : "ত্রুটি: অথেন্টিকেশন ব্যর্থ হয়েছে");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div ref={containerRef} className="mx-auto mt-8 md:mt-16 max-w-4xl px-4 md:px-8 pb-32 bg-tech-grid min-h-screen">
      <header className="admin-account-reveal mb-8 md:mb-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-10 text-left">
        <div>
          <p className="font-display text-[9px] md:text-[11px] tracking-[0.4em] md:tracking-[0.6em] text-cyan-400 uppercase font-bold italic mb-4 md:mb-6">{language === 'en' ? "Security Protocol" : "সিকিউরিটি প্রোটোকল"}</p>
          <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter italic uppercase">{language === 'en' ? "Profile Access" : "প্রোফাইল অ্যাক্সেস"}</h1>
        </div>
        <Link to="/admin/dashboard" className="w-full md:w-auto px-10 py-5 rounded-[20px] md:rounded-[28px] border border-white/5 bg-white/2 font-display text-[9px] md:text-[11px] font-bold text-cyan-400 uppercase tracking-widest hover:bg-white/5 transition-all text-center italic">{language === 'en' ? "Exit Settings" : "সেটিংস থেকে বের হন"}</Link>
      </header>

      <GlassCard className="admin-account-reveal relative overflow-hidden p-8 md:p-24 shadow-[0_80px_160px_rgba(0,0,0,0.8)] text-left rounded-[40px] md:rounded-[80px]">
        <div className="absolute top-0 right-0 h-1.5 md:h-2 w-40 md:w-60 bg-cyan-400 opacity-60" />
        
        <div className="mb-12 md:mb-20 border-b border-white/5 pb-8 md:pb-12">
          <p className="font-display text-[10px] md:text-[11px] tracking-[0.4em] md:tracking-[0.5em] text-cyan-400 uppercase font-bold italic mb-4 md:mb-6">{language === 'en' ? "Management Suite" : "ম্যানেজমেন্ট স্যুট"}</p>
          <p className="text-base md:text-lg text-[#555] leading-relaxed font-medium italic">{language === 'en' ? "Administrative security framework and professional access control. Multi-layer verification established for all sensitive data modifications." : "প্রশাসনিক নিরাপত্তা কাঠামো এবং পেশাদার অ্যাক্সেস নিয়ন্ত্রণ। সমস্ত সংবেদনশীল তথ্য পরিবর্তনের জন্য মাল্টি-লেয়ার ভেরিফিকেশন প্রতিষ্ঠিত।"}</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-12 md:space-y-16">
          <div className="space-y-4 md:space-y-6">
            <label className="text-[10px] md:text-[11px] font-bold text-[#333] uppercase tracking-[0.3em] md:tracking-[0.4em] ml-2 italic">{language === 'en' ? "Current Authorization Key" : "বর্তমান পাসওয়ার্ড"}</label>
            <div className="relative group">
               <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-cyan-400 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
               </span>
               <input
                type={showPass1 ? "text" : "password"}
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                required
                className="w-full rounded-[24px] md:rounded-[32px] border border-white/5 bg-black/40 px-6 md:px-14 py-5 md:py-7 text-white outline-none focus:border-cyan-400/40 font-bold tracking-widest italic"
                placeholder="••••••••••••"
              />
              <button 
                 type="button" 
                 onClick={() => setShowPass1(!showPass1)}
                 className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 font-display text-[8px] md:text-[10px] font-bold text-cyan-400 uppercase tracking-widest hover:text-white transition-colors italic"
              >
                {showPass1 ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="grid gap-10 md:gap-16 md:grid-cols-2">
             <div className="space-y-4 md:space-y-6">
                <label className="text-[10px] md:text-[11px] font-bold text-[#333] uppercase tracking-[0.3em] md:tracking-[0.4em] ml-2 italic">{language === 'en' ? "Professional Identity (Email)" : "ইমেইল অ্যাড্রেস"}</label>
                <div className="relative group">
                   <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-cyan-400 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206"/></svg>
                   </span>
                   <input
                     value={newEmail}
                     onChange={(event) => setNewEmail(event.target.value)}
                     placeholder="admin@engralamashik.com"
                     className="w-full rounded-[24px] md:rounded-[32px] border border-white/5 bg-black/40 px-6 md:px-14 py-5 md:py-7 text-white outline-none focus:border-cyan-400/40 font-bold italic"
                   />
                </div>
             </div>

             <div className="space-y-4 md:space-y-6">
                <label className="text-[10px] md:text-[11px] font-bold text-[#333] uppercase tracking-[0.3em] md:tracking-[0.4em] ml-2 italic">{language === 'en' ? "New Access Secret" : "নতুন পাসওয়ার্ড"}</label>
                <div className="relative group">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-cyan-400 transition-colors">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                  </span>
                  <input
                    type={showPass2 ? "text" : "password"}
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-[24px] md:rounded-[32px] border border-white/5 bg-black/40 px-6 md:px-14 py-5 md:py-7 text-white outline-none focus:border-cyan-400/40 font-bold tracking-widest italic"
                  />
                  <button 
                     type="button" 
                     onClick={() => setShowPass2(!showPass2)}
                     className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 font-display text-[8px] md:text-[10px] font-bold text-cyan-400 uppercase tracking-widest hover:text-white transition-colors italic"
                  >
                    {showPass2 ? "Hide" : "Show"}
                  </button>
                </div>
             </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-12 border-t border-white/5 pt-12 md:pt-16">
            <button 
              type="submit" 
              disabled={saving} 
              className="group relative overflow-hidden rounded-[20px] md:rounded-[32px] bg-cyan-600 px-10 md:px-16 py-6 md:py-7 font-bold shadow-[0_30px_60px_rgba(0,210,255,0.2)] transition-all hover:translate-y-[-4px] hover:shadow-[0_45px_90px_rgba(0,210,255,0.4)] disabled:opacity-50 w-full md:min-w-[340px]"
            >
               <span className="relative z-10 text-[9px] md:text-[11px] uppercase tracking-[0.5em] md:tracking-[0.6em] text-black italic font-black">
                 {saving ? (language === 'en' ? "Synchronizing..." : "আপডেট হচ্ছে...") : (language === 'en' ? "Commit Security Updates" : "সিকিউরিটি আপডেট করুন")}
               </span>
               <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <div className="hidden md:block h-2.5 w-2.5 rounded-full bg-slate-900 animate-pulse" />
          </div>

          {message ? (
             <div className={`status-msg mt-8 md:mt-12 rounded-[24px] md:rounded-[40px] border p-8 md:p-10 text-center text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] italic shadow-2xl ${message.includes("Success") ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" : "border-rose-500/20 bg-rose-500/5 text-rose-400"}`}>
                <span className="flex items-center justify-center gap-4 md:gap-6">
                   <div className={`h-2 w-2 md:h-2.5 md:w-2.5 rounded-full ${message.includes("Success") ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse shadow-[0_0_15px_currentColor]`} />
                   {message}
                </span>
             </div>
          ) : null}
        </form>
      </GlassCard>

      <footer className="admin-account-reveal mt-16 md:mt-32 font-display text-[8px] md:text-[11px] text-[#222] uppercase tracking-[0.5em] md:tracking-[0.8em] text-center border-t border-white/5 pt-12 md:pt-16 px-6 md:px-12 font-bold italic">
        Identity Management Node · Secure Environment · Authorization Level 4.9
      </footer>
    </div>
  );
}
