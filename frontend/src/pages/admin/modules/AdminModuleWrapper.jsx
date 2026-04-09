import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Plus, 
  ChevronRight,
  ShieldCheck,
  Zap,
  LayoutDashboard,
  CheckCircle2,
  ShieldAlert,
  Loader2
} from "lucide-react";
import "../../../styles/admin.css";

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
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto pb-32">
      {/* 1. Simplified Breadcrumbs & Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
        <div className="flex items-center gap-5">
          <button 
            onClick={() => navigate("/admin/dashboard")}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-sky-600 hover:border-sky-400 transition-all group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] italic mb-1">
              <LayoutDashboard size={10} />
              <span>Dashboard</span>
              <ChevronRight size={10} />
              <span className="text-[#19D2FF]/60">{title?.split(' ')[0]}</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">{title}</h2>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {allowCreate && (
             <button 
              onClick={onNew}
              className="flex items-center gap-2 px-5 py-2.5 bg-sky-500 text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg"
             >
               <Plus size={14} strokeWidth={3} />
               Register Node
             </button>
          )}
          <div className="hidden sm:flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200 rounded-xl">
            <Zap size={12} className="text-sky-600 animate-pulse" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{subtitle || 'Active Session'}</span>
          </div>
        </div>
      </div>

      {/* 2. Status Notifications */}
      {status?.message && (
        <div className={`mx-4 rounded-xl border p-4 backdrop-blur-3xl animate-in slide-in-from-top-2 duration-300 ${
          status.type === 'error' ? 'border-red-500/20 bg-red-500/5 text-red-500' : 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400'
        }`}>
          <div className="flex items-center justify-center gap-4">
            {status.type === 'error' ? <ShieldAlert size={18} /> : <CheckCircle2 size={18} />}
            <p className="text-[11px] font-black uppercase tracking-widest italic">{status.message.replace(/ /g, ' ')}</p>
          </div>
        </div>
      )}

      {/* 3. Main Content Container */}
      <div className="px-4">
        {loading ? (
          <div className="admin-card h-[400px] flex flex-col items-center justify-center gap-8">
            <div className="relative">
               <Loader2 className="animate-spin text-sky-600" size={48} strokeWidth={1.5} />
               <div className="absolute inset-0 bg-sky-100 blur-[40px] rounded-full" />
            </div>
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] animate-pulse italic text-center">Synchronizing Data...</p>
          </div>
        ) : (
          <div className="admin-card p-6 md:p-12 relative overflow-hidden group/content">
             <div className="absolute top-0 right-0 h-1 w-64 bg-gradient-to-l from-[#19D2FF]/20 to-transparent" />
             <div className="relative z-10 transition-all duration-700 animate-in fade-in slide-in-from-bottom-2">
                {children}
             </div>
          </div>
        )}
      </div>

      {/* 4. Persistence Controls (Footer) - Temporary placement until modules use AdminSaveBar */}
      {loading === false && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4 pt-10 border-t border-slate-200">
          <div className="flex items-center gap-4 w-full sm:w-auto">
             <button 
              onClick={onSave}
              disabled={saving}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-3 px-12 py-4 bg-sky-500 text-black rounded-xl font-black text-[11px] uppercase tracking-[0.1em] hover:scale-105 active:scale-95 transition-all shadow-[0_0_24px_rgba(25,210,255,0.2)] disabled:opacity-50"
             >
               {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} strokeWidth={2.5} />}
               <span>{saving ? 'SYNCHRONIZING...' : 'Execute Commit'}</span>
             </button>
             {onDelete && (
                <button 
                  onClick={onDelete}
                  disabled={saving}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-3 px-8 py-4 bg-red-500/5 border border-red-500/10 text-red-500 rounded-xl font-black text-[11px] uppercase tracking-[0.1em] hover:bg-red-500 hover:text-slate-900 transition-all active:scale-95"
                >
                  <Trash2 size={16} />
                  Erase Node
                </button>
             )}
          </div>
          <div className="hidden md:flex items-center gap-4 opacity-30">
             <ShieldCheck size={14} className="text-sky-600" />
             <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] italic">Authority: Master Admin</p>
          </div>
        </div>
      )}
    </div>
  );
}
