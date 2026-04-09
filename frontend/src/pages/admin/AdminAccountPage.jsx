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
  Fingerprint,
  User,
  Zap,
  Key,
  ChevronRight,
  LayoutDashboard,
  Loader2
} from "lucide-react";
import { updateAdminProfile } from "../../lib/api";
import { useLanguage } from "../../context/LanguageContext";
import AdminModuleWrapper from "./modules/AdminModuleWrapper";
import "../../styles/admin.css";

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

  const onSubmit = async (event) => {
    if (event) event.preventDefault();
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
      setMessage(language === 'en' ? "SECURITY_PROTOCOL: CREDENTIALS_UPDATED" : "সিকিউরিটি ক্রেডেনশিয়াল আপডেট করা হয়েছে");
      setCurrentPassword("");
      setNewPassword("");
      gsap.from(".status-msg", { scale: 0.98, opacity: 0, duration: 0.4, ease: "back.out" });
    } catch (error) {
      setStatus("error");
      setMessage(language === 'en' ? "AUTHENTICATION_FAILED: ACCESS_DENIED" : "অথেন্টিকেশন ব্যর্থ হয়েছে");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminModuleWrapper
      title={language === 'en' ? "Identity_Control" : "প্রোফাইল অ্যাক্সেস"}
      subtitle="Security_Protocol_v6.1"
      icon={ShieldCheck}
      loading={false}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
        {/* Left Side: Security Form */}
        <div className="space-y-12">
          <form onSubmit={onSubmit} className="space-y-10">
            {/* Primary Authorization Section */}
            <div className="space-y-8">
              <div className="flex items-center gap-3 pb-4 border-b border-white/[0.05]">
                <Key size={14} className="text-[#19D2FF]" />
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Verification_Required</h3>
              </div>
              
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1 italic">Current_Authorization_Secret</label>
                <div className="relative group">
                  <input
                    type={showPass1 ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="admin-input w-full pr-14"
                    placeholder="••••••••••••"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPass1(!showPass1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 hover:text-[#19D2FF] transition-colors"
                  >
                    {showPass1 ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Modification Section */}
            <div className="space-y-8">
              <div className="flex items-center gap-3 pb-4 border-b border-white/[0.05]">
                <Zap size={14} className="text-[#19D2FF]" />
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Node_Update_Parameters</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1 italic">Professional_Identity (Email)</label>
                  <input
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="admin@agency.com"
                    className="admin-input w-full"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1 italic">New_Security_Key</label>
                  <div className="relative group">
                    <input
                      type={showPass2 ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="admin-input w-full pr-14"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPass2(!showPass2)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 hover:text-[#19D2FF] transition-colors"
                    >
                      {showPass2 ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-10 border-t border-white/[0.05]">
              <button 
                type="submit" 
                disabled={saving} 
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-12 py-4 bg-[#19D2FF] text-black rounded-xl font-black text-[11px] uppercase tracking-[0.1em] hover:scale-105 transition-all shadow-lg shadow-[#19D2FF]/20 disabled:opacity-50"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} strokeWidth={2.5} />}
                <span>{saving ? 'SYNCHRONIZING...' : 'Commit Security Updates'}</span>
              </button>

              <div className="hidden md:flex items-center gap-3 opacity-30 italic">
                <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Authority: Master_Admin</p>
                <div className="h-1.5 w-1.5 rounded-full bg-[#19D2FF]" />
              </div>
            </div>

            {message && (
               <div className={`status-msg p-6 rounded-xl border-2 flex items-center justify-center gap-4 animate-in slide-in-from-top-2 ${status === 'success' ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-500' : 'border-red-500/20 bg-red-500/5 text-red-500'}`}>
                 {status === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                 <p className="text-[10px] font-black uppercase tracking-widest italic">{message}</p>
               </div>
            )}
          </form>
        </div>

        {/* Right Side: Identity Info / Stats */}
        <div className="space-y-8">
           <div className="p-8 bg-white/[0.02] border border-white/[0.05] rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                <Fingerprint size={64} className="text-white" />
              </div>
              <div className="relative z-10 space-y-4">
                 <div className="flex items-center gap-3">
                   <User size={16} className="text-[#19D2FF]" />
                   <h4 className="text-[10px] font-black text-white uppercase tracking-widest italic">Identity_Overview</h4>
                 </div>
                 <p className="text-[11px] text-slate-500 leading-relaxed font-bold italic">
                    All administrative actions are logged with persistent ID attribution. Security modifications require valid session tokens and 2FA where applicable.
                 </p>
                 <div className="pt-4 space-y-2">
                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest italic">
                       <span className="text-slate-700">Access_Level</span>
                       <span className="text-[#19D2FF]">Tier_04 (Root)</span>
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest italic">
                       <span className="text-slate-700">Enc_Protocol</span>
                       <span className="text-[#19D2FF]">AES-256-GCM</span>
                    </div>
                 </div>
              </div>
           </div>

           <Link to="/admin/dashboard" className="flex items-center justify-between p-6 bg-white/[0.01] border border-white/[0.05] rounded-2xl group hover:border-[#19D2FF]/30 transition-all">
              <div className="flex items-center gap-4">
                <LayoutDashboard size={18} className="text-slate-600 group-hover:text-[#19D2FF] transition-colors" />
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest group-hover:text-white transition-colors">Return_to_Nexus</span>
              </div>
              <ChevronRight size={14} className="text-slate-800 group-hover:text-[#19D2FF] translate-x-0 group-hover:translate-x-1 transition-all" />
           </Link>
        </div>
      </div>
    </AdminModuleWrapper>
  );
}
