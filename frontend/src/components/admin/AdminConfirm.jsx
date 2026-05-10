import { AlertCircle, Trash2, X } from "lucide-react";

export default function AdminConfirm({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete", type = "danger" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-[var(--admin-card)] border border-[color:var(--admin-border)] rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl hover:bg-white/5 transition-colors text-[color:var(--admin-text-muted)]"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className={`h-16 w-16 rounded-2xl flex items-center justify-center mb-6 ${type === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-sky-500/10 text-sky-500'}`}>
            {type === 'danger' ? <Trash2 size={32} /> : <AlertCircle size={32} />}
          </div>

          <h3 className="text-2xl font-black text-[color:var(--admin-text-heading)] tracking-tight uppercase mb-2">
            {title}
          </h3>
          <p className="text-[11px] text-[color:var(--admin-text-muted)] font-bold uppercase tracking-widest leading-relaxed mb-10 max-w-[280px]">
            {message}
          </p>

          <div className="flex gap-4 w-full">
            <button 
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl bg-white/5 border border-[color:var(--admin-border)] text-[11px] font-black uppercase tracking-widest text-[color:var(--admin-text-heading)] hover:bg-white/10 transition-all shadow-sm"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white transition-all shadow-lg ${type === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'bg-sky-500 hover:bg-sky-600 shadow-sky-500/20'}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
