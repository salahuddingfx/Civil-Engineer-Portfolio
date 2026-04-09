import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Save, Trash2, CheckCircle2, ShieldAlert, Cpu } from "lucide-react";
import GlassCard from "../../../components/GlassCard";

export default function AdminModuleWrapper({ 
  title, 
  subtitle, 
  icon: Icon, 
  onSave, 
  onDelete, 
  loading, 
  saving, 
  status,
  allowCreate = false,
  onNew,
  children 
}) {
  return (
    <div className="mx-auto mt-12 md:mt-16 max-w-[1300px] px-6 md:px-12 pb-32 animate-in fade-in slide-in-from-bottom-8 duration-1000 relative z-10">
      
      {/* Module Header - Command Center Style */}
      <header className="mb-14 relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/10 via-transparent to-violet-500/10 rounded-[48px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-10 rounded-[48px] border border-white/[0.05] bg-[#080c14]/60 p-10 md:p-14 shadow-2xl backdrop-blur-3xl overflow-hidden">
          <div className="absolute top-0 right-0 h-1.5 w-60 bg-gradient-to-l from-cyan-400/20 to-transparent rounded-bl-full" />
          
          <div className="flex items-center gap-10 relative z-10">
            <div className="h-24 w-24 rounded-3xl border border-white/[0.08] bg-white/[0.02] flex items-center justify-center text-cyan-400 shadow-[inset_0_0_20px_rgba(34,211,238,0.05)] group-hover:scale-105 transition-all duration-700">
              <Icon size={40} strokeWidth={1.2} />
            </div>
            
            <div className="text-left space-y-2">
              <div className="flex items-center gap-3">
                 <div className="h-1 w-1 rounded-full bg-cyan-400" />
                 <p className="font-display text-[9px] tracking-[0.5em] text-slate-500 uppercase font-black italic">System_Module::Protocol_Active</p>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight italic uppercase leading-none">{title}</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-[0.4em] font-bold italic line-clamp-1 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-white/10" />
                {subtitle}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 w-full md:w-auto relative z-10">
            <Link to="/admin/dashboard" className="flex items-center justify-center gap-4 px-10 py-5 rounded-2xl border border-white/[0.05] bg-white/[0.01] font-display text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-white/[0.03] hover:text-white transition-all italic group/back">
              <ArrowLeft size={16} className="group-hover/back:-translate-x-2 transition-transform" />
              Control Hub
            </Link>
            {allowCreate && (
               <button onClick={onNew} className="px-10 py-5 rounded-2xl bg-cyan-500 text-black font-display text-[11px] font-black uppercase tracking-widest shadow-[0_20px_40px_rgba(34,211,238,0.1)] hover:bg-cyan-400 hover:shadow-[0_20px_50px_rgba(34,211,238,0.2)] transition-all italic flex items-center gap-4 active:scale-95">
                 <Plus size={18} strokeWidth={3} />
                 Initialize Node
               </button>
            )}
          </div>
        </div>
      </header>

      {/* Status Notifications */}
      {status.message && (
        <div className={`mb-12 rounded-[32px] border p-8 shadow-2xl animate-in fade-in slide-in-from-top-6 duration-700 backdrop-blur-3xl relative overflow-hidden ${
          status.type === 'error' ? 'border-rose-500/10 bg-rose-500/[0.02] text-rose-500' : 'border-emerald-500/10 bg-emerald-500/[0.02] text-emerald-400'
        }`}>
          <div className="absolute top-0 right-0 h-full w-1 bg-current opacity-20" />
          <div className="flex items-center justify-center gap-5">
            {status.type === 'error' ? <ShieldAlert size={24} /> : <CheckCircle2 size={24} />}
            <p className="text-[13px] font-black uppercase tracking-[0.4em] italic leading-relaxed">{status.message.replace(/_/g, ' ')}</p>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-56 bg-[#080c14]/40 backdrop-blur-3xl border border-white/[0.05] rounded-[64px] shadow-2xl">
            <div className="relative mb-12">
               <Loader2 className="animate-spin text-cyan-400" size={80} strokeWidth={1} />
               <div className="absolute inset-0 bg-cyan-400/20 blur-[60px] rounded-full" />
            </div>
            <p className="text-[11px] font-black uppercase tracking-[0.6em] text-slate-700 italic animate-pulse">Synchronizing_Data_Nodes...</p>
          </div>
        ) : (
          <div className="space-y-16">
            <div className="p-10 md:p-20 bg-[#080c14]/30 backdrop-blur-3xl border border-white/[0.08] rounded-[64px] shadow-2xl relative overflow-hidden group/content">
               <div className="absolute inset-0 bg-tech-grid opacity-[0.05] pointer-events-none" />
               <div className="absolute top-0 right-0 h-1.5 w-80 bg-gradient-to-l from-cyan-400/30 to-transparent rounded-bl-full" />
               
               <div className="relative z-10">
                  {children}
               </div>
            </div>

            {/* Global Actions Footer */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 pt-16 border-t border-white/[0.05]">
              <div className="flex gap-6 w-full md:w-auto">
                <button 
                  onClick={onSave}
                  disabled={saving}
                  className="flex-1 md:flex-none flex items-center justify-center gap-6 px-20 py-7 rounded-3xl bg-cyan-600/90 text-black font-black text-[12px] uppercase tracking-[0.4em] italic shadow-2xl hover:bg-cyan-400 hover:shadow-[0_25px_60px_rgba(34,211,238,0.2)] transition-all disabled:opacity-50 relative group/commit overflow-hidden active:scale-95"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/commit:translate-x-[100%] transition-transform duration-1000 skew-x-12" />
                  {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} strokeWidth={2.5} />}
                  <span className="relative z-10">{saving ? "SYNCHRONIZING..." : "Execute Commit"}</span>
                </button>
                {onDelete && (
                  <button 
                    onClick={onDelete}
                    disabled={saving}
                    className="flex-1 md:flex-none flex items-center justify-center gap-5 px-14 py-7 rounded-3xl border border-rose-500/10 bg-rose-500/[0.03] text-rose-500 font-black text-[11px] uppercase tracking-[0.4em] italic hover:bg-rose-500/10 hover:border-rose-500/30 transition-all active:scale-95"
                  >
                    <Trash2 size={20} strokeWidth={2} />
                    Erase Node
                  </button>
                )}
              </div>
              <div className="text-right hidden md:block opacity-40">
                 <div className="flex items-center justify-end gap-3 mb-2">
                    <Cpu size={10} className="text-cyan-400" />
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic">Authority_Reference::ASHIK_6.1</p>
                 </div>
                 <p className="text-[8px] font-bold text-cyan-400/40 uppercase tracking-[0.5em] italic">Secure_Encrypted_Tunnel_Active</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
