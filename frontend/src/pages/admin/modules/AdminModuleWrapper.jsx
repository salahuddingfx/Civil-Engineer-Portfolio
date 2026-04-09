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
    <div className="mx-auto mt-8 md:mt-12 max-w-[1400px] px-6 md:px-12 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
      
      {/* Module Header */}
      <header className="mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 rounded-[48px] border border-white/[0.05] bg-[#0d0f1a]/40 p-10 md:p-14 shadow-2xl backdrop-blur-3xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="flex items-center gap-8 relative z-10">
          <div className="h-20 w-20 rounded-3xl border border-white/[0.07] bg-white/[0.03] flex items-center justify-center text-cyan-400 shadow-inner group-hover:scale-105 transition-transform duration-500">
            <Icon size={32} />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-3 mb-2">
               <Cpu size={12} className="text-cyan-400/60" />
               <p className="font-display text-[9px] tracking-[0.5em] text-cyan-400/60 uppercase font-black italic underline decoration-cyan-400/20 underline-offset-4">Module_Protocol</p>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter italic uppercase leading-none">{title}</h1>
            <p className="mt-3 text-[10px] text-slate-500 uppercase tracking-[0.35em] font-bold italic line-clamp-1">{subtitle}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-5 w-full md:w-auto relative z-10">
          <Link to="/admin/dashboard" className="flex items-center justify-center gap-3 px-10 py-5 rounded-2xl border border-white/[0.07] bg-white/[0.02] font-display text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-white/[0.05] hover:text-white transition-all italic group/back">
            <ArrowLeft size={16} className="group-hover/back:-translate-x-1 transition-transform" />
            Control Hub
          </Link>
          {allowCreate && (
             <button onClick={onNew} className="px-10 py-5 rounded-2xl bg-cyan-400 text-black font-display text-[11px] font-black uppercase tracking-widest shadow-[0_20px_40px_rgba(34,211,238,0.15)] hover:bg-cyan-300 hover:shadow-[0_25px_50px_rgba(34,211,238,0.25)] transition-all italic flex items-center gap-3">
               <Save size={16} />
               Assemble
             </button>
          )}
        </div>
      </header>

      {/* Status Notifications */}
      {status.message && (
        <div className={`mb-10 rounded-3xl border p-8 text-center shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500 backdrop-blur-3xl ${
          status.type === 'error' ? 'border-rose-500/20 bg-rose-500/5 text-rose-500' : 'border-emerald-400/20 bg-emerald-400/5 text-emerald-400'
        }`}>
          <div className="flex items-center justify-center gap-4">
            {status.type === 'error' ? <ShieldAlert size={20} /> : <CheckCircle2 size={20} />}
            <p className="text-[12px] font-black uppercase tracking-[0.4em] italic leading-relaxed">{status.message}</p>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="grid gap-12 relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-48 bg-[#0d0f1a]/40 backdrop-blur-3xl border border-white/[0.05] rounded-[64px] shadow-2xl">
            <div className="relative mb-10">
               <Loader2 className="animate-spin text-cyan-400" size={64} strokeWidth={1.5} />
               <div className="absolute inset-0 bg-cyan-400/20 blur-3xl rounded-full" />
            </div>
            <p className="text-[13px] font-black uppercase tracking-[0.5em] text-slate-500 italic animate-pulse">Synchronizing Data Nodes...</p>
          </div>
        ) : (
          <>
            <div className="p-10 md:p-20 bg-[#0d0f1a]/30 backdrop-blur-3xl border border-white/[0.07] rounded-[64px] shadow-[0_40px_100px_rgba(0,0,0,0.4)] relative overflow-hidden group">
               <div className="absolute top-0 right-0 h-[300px] w-[300px] bg-cyan-500/5 blur-[100px] rounded-full -mr-20 -mt-20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
               <div className="absolute top-0 right-0 h-1.5 w-60 bg-gradient-to-l from-cyan-400/40 to-transparent rounded-bl-full" />
               
               <div className="relative z-10">
                  {children}
               </div>
            </div>

            {/* Global Actions Footer */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-10 pt-16 border-t border-white/[0.05]">
              <div className="flex gap-6 w-full md:w-auto">
                <button 
                  onClick={onSave}
                  disabled={saving}
                  className="flex-1 md:flex-none flex items-center justify-center gap-5 px-16 py-7 rounded-3xl bg-cyan-600 text-black font-black text-[12px] uppercase tracking-[0.4em] italic shadow-2xl hover:bg-cyan-400 hover:shadow-[0_20px_60px_rgba(34,211,238,0.2)] transition-all disabled:opacity-50 relative group/commit overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/commit:translate-x-[100%] transition-transform duration-1000 skew-x-12" />
                  {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                  <span className="relative z-10">{saving ? "SYNCHRONIZING..." : "COMMIT CHANGES"}</span>
                </button>
                {onDelete && (
                  <button 
                    onClick={onDelete}
                    disabled={saving}
                    className="flex-1 md:flex-none flex items-center justify-center gap-5 px-12 py-7 rounded-3xl border border-rose-500/20 bg-rose-500/5 text-rose-500 font-bold text-[12px] uppercase tracking-[0.4em] italic hover:bg-rose-500/10 hover:border-rose-500/40 transition-all"
                  >
                    <Trash2 size={20} />
                    ERASE
                  </button>
                )}
              </div>
              <div className="text-right hidden md:block">
                 <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.6em] italic mb-1">DESIGNER_ID: ASHIK_6.1</p>
                 <p className="text-[8px] font-bold text-cyan-400/20 uppercase tracking-[0.4em] italic">SECURE_TUNNEL_ACTIVE</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
