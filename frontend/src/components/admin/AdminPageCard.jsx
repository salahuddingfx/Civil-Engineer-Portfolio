import { Link } from "react-router-dom";
import { Edit3, ChevronRight } from "lucide-react";

const getStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    case 'LIVE': return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400';
    case 'IN PROGRESS': return 'border-amber-500/20 bg-amber-500/10 text-amber-400';
    case 'DRAFT': return 'border-[color:var(--admin-border)] bg-[color:var(--admin-bg)] text-white/40';
    default: return 'border-[color:var(--admin-border)] bg-[color:var(--admin-bg)] text-white/40';
  }
};

export default function AdminPageCard({ 
  title, 
  desc, 
  to, 
  icon: Icon, 
  status = "LIVE", 
  bgImage 
}) {
  return (
    <div className="group relative h-[420px] rounded-[32px] overflow-hidden border border-white/5 bg-[#050505] transition-all hover:border-cyan-400/30 hover:shadow-[0_45px_90px_rgba(0,0,0,0.8)] flex flex-col">
       {/* Background Image Layer */}
       <div className="absolute inset-0 z-0">
          <img 
            src={bgImage || "/placeholder-arch.jpg"} 
            alt={title} 
            className="h-full w-full object-cover opacity-30 grayscale group-hover:grayscale-0 group-hover:scale-110 group-hover:opacity-40 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/80 to-transparent" />
       </div>

       {/* Content Layer */}
       <div className="relative z-10 p-8 flex-1 flex flex-col justify-between">
          <div className="flex justify-between items-start">
             <div className="h-14 w-14 rounded-2xl bg-[color:var(--admin-bg)] border border-white/5 flex items-center justify-center text-[#555] group-hover:text-cyan-400 group-hover:bg-cyan-400/10 transition-all duration-500">
                <Icon size={24} />
             </div>
             <div className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${getStatusColor(status)}`}>
                {status}
             </div>
          </div>

          <div>
             <h4 className="text-2xl font-black text-[color:var(--admin-text-heading)] italic uppercase tracking-tighter mb-4 group-hover:text-cyan-400 transition-colors">{title}</h4>
             <p className="text-[11px] font-bold text-[#444] leading-relaxed uppercase tracking-widest italic line-clamp-2">
                {desc}
             </p>
          </div>

          <Link 
            to={to} 
            className="mt-8 flex items-center justify-center gap-3 w-full py-5 rounded-2xl border border-white/5 bg-[var(--admin-card)]/2 text-[10px] font-black uppercase tracking-widest text-[#555] hover:bg-cyan-400 hover:text-black hover:border-cyan-400 transition-all duration-300 group/btn"
          >
             <Edit3 size={14} className="group-hover/btn:rotate-12 transition-transform" />
             Edit Page
             <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
          </Link>
       </div>
    </div>
  );
}
