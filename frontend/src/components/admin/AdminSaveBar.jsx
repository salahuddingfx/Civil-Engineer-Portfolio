import { Save, RotateCcw, Trash2, Send } from "lucide-react";

export default function AdminSaveBar({ 
  onSave, 
  onReset, 
  onDelete, 
  isDirty = true, 
  isSaving = false,
  isPublished = true,
  onPublishToggle
}) {
  return (
    <div className={`
      fixed bottom-0 left-0 right-0 lg:left-72 z-40 p-4 sm:p-6 transition-all duration-500 transform
      ${isDirty ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}
    `}>
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className={`h-2 w-2 rounded-full ${isDirty ? 'bg-sky-500 animate-pulse' : 'bg-slate-600'}`} />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 italic">
                {isSaving ? 'Synchronizing Changes...' : 'Unsaved Modifications Detected'}
              </p>
            </div>
            <div className="hidden md:flex items-center gap-4 border-l border-slate-200 pl-6">
               <button 
                onClick={onReset}
                className="flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest"
               >
                 <RotateCcw size={12} />
                 Discard
               </button>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {onDelete && (
              <button 
                onClick={onDelete}
                className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl hover:bg-red-500 hover:text-slate-900 transition-all duration-300"
              >
                <Trash2 size={18} />
              </button>
            )}
            
            <button 
              onClick={onSave}
              disabled={isSaving}
              className={`
                flex-1 sm:flex-initial flex items-center justify-center gap-3 px-8 py-3 bg-sky-500 text-white rounded-xl font-black text-[11px] uppercase tracking-[0.1em] hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] disabled:opacity-50
              `}
            >
              <Save size={16} strokeWidth={3} />
              {isSaving ? 'Processing...' : 'Execute Commit'}
            </button>

            {onPublishToggle && (
              <button 
                onClick={onPublishToggle}
                className={`
                  flex items-center gap-3 px-6 py-3 border rounded-xl font-black text-[11px] uppercase tracking-[0.1em] transition-all
                  ${isPublished 
                    ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-500 hover:bg-emerald-500/10' 
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900'}
                `}
              >
                <Send size={14} />
                {isPublished ? 'Published' : 'Draft'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
