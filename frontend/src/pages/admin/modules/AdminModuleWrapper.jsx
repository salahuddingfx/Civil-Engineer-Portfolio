import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Save, Trash2, CheckCircle2, ShieldAlert } from "lucide-react";
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
    <div className="mx-auto mt-8 md:mt-12 max-w-[1200px] px-4 md:px-8 pb-32 animate-in fade-in duration-700">
      {/* Module Header */}
      <header className="mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 rounded-[40px] border border-white/5 bg-[#080808]/60 p-10 md:p-16 shadow-2xl backdrop-blur-3xl">
        <div className="flex items-center gap-8">
          <div className="h-16 w-16 rounded-2xl border border-white/5 bg-white/2 flex items-center justify-center text-cyan-400">
            <Icon size={28} />
          </div>
          <div className="text-left">
            <p className="font-display text-[10px] tracking-[0.4em] text-cyan-400 uppercase font-black mb-2 italic">Module Intelligence Hub</p>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter italic uppercase">{title}</h1>
            <p className="mt-2 text-[10px] text-[#444] uppercase tracking-[0.3em] font-bold italic">{subtitle}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Link to="/admin/dashboard" className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl border border-white/5 bg-white/2 font-display text-[10px] font-bold text-cyan-400 uppercase tracking-widest hover:bg-white/10 transition-all italic">
            <ArrowLeft size={14} />
            Back
          </Link>
          {allowCreate && (
             <button onClick={onNew} className="px-8 py-4 rounded-2xl bg-cyan-400 text-black font-display text-[10px] font-black uppercase tracking-widest hover:bg-cyan-300 transition-all italic">
               New Entry
             </button>
          )}
        </div>
      </header>

      {/* Status Notifications */}
      {status.message && (
        <div className={`mb-8 rounded-2xl border p-6 text-center shadow-xl animate-in slide-in-from-top-4 duration-500 ${
          status.type === 'error' ? 'border-rose-500/20 bg-rose-500/5 text-rose-500' : 'border-cyan-400/20 bg-cyan-400/5 text-cyan-400'
        }`}>
          <div className="flex items-center justify-center gap-3">
            {status.type === 'error' ? <ShieldAlert size={16} /> : <CheckCircle2 size={16} />}
            <p className="text-[10px] font-black uppercase tracking-[0.4em] italic">{status.message}</p>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="grid gap-12">
        {loading ? (
          <GlassCard className="flex flex-col items-center justify-center py-32">
            <Loader2 className="animate-spin text-cyan-400 mb-6" size={40} />
            <p className="text-[11px] font-black uppercase tracking-[0.5em] text-[#333] italic">Synchronizing Assets...</p>
          </GlassCard>
        ) : (
          <>
            <GlassCard className="p-8 md:p-16 rounded-[48px] shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 h-1 w-40 bg-cyan-500/40" />
               {children}
            </GlassCard>

            {/* Global Actions Footer */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-8 border-t border-white/5">
              <div className="flex gap-4 w-full md:w-auto">
                <button 
                  onClick={onSave}
                  disabled={saving}
                  className="flex-1 md:flex-none flex items-center justify-center gap-4 px-12 py-6 rounded-2xl bg-cyan-600 text-black font-black text-[10px] uppercase tracking-[0.4em] italic shadow-2xl hover:bg-cyan-400 transition-all disabled:opacity-50"
                >
                  {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  {saving ? "EXECUTING..." : "COMMIT CHANGES"}
                </button>
                {onDelete && (
                  <button 
                    onClick={onDelete}
                    disabled={saving}
                    className="flex-1 md:flex-none flex items-center justify-center gap-4 px-10 py-6 rounded-2xl border border-rose-500/20 bg-rose-500/5 text-rose-500 font-bold text-[10px] uppercase tracking-[0.4em] italic hover:bg-rose-500/10 transition-all"
                  >
                    <Trash2 size={18} />
                    ERASE
                  </button>
                )}
              </div>
              <p className="text-[9px] font-black text-[#222] uppercase tracking-[0.5em] italic">Precision Execution Node // v6.1</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
