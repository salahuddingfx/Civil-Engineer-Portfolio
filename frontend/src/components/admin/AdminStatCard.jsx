import { TrendingUp, TrendingDown } from "lucide-react";

export default function AdminStatCard({ 
  label, 
  value, 
  trend, 
  trendValue, 
  icon: Icon, 
  chartType = "bar",
  status = "Active"
}) {
  return (
    <div className="relative group overflow-hidden rounded-[32px] border border-white/5 bg-[#080808]/60 p-8 backdrop-blur-3xl transition-all hover:border-cyan-400/30 hover:shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
       {/* Background Accent */}
       <div className="absolute top-0 right-0 h-32 w-32 bg-[radial-gradient(circle_at_top_right,_rgba(0,210,255,0.05),_transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />
       
       <div className="flex justify-between items-start mb-6">
          <div>
             <p className="text-[10px] font-black text-[#444] uppercase tracking-[0.4em] mb-4 italic group-hover:text-cyan-400 transition-colors">{label}</p>
             <div className="flex items-end gap-4">
                <h3 className="text-5xl font-black text-slate-900 tracking-tighter italic">{value}</h3>
                {trendValue && (
                  <div className={`flex items-center gap-1 mb-2 text-[11px] font-bold italic ${trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
                     {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                     {trendValue}
                  </div>
                )}
             </div>
          </div>
          <div className="h-12 w-12 rounded-xl border border-white/5 bg-white/2 flex items-center justify-center text-[#444] group-hover:text-cyan-400 group-hover:scale-110 transition-all">
             <Icon size={20} />
          </div>
       </div>

       {/* Sub-indicator */}
       <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest pt-6 border-t border-white/5">
          <span className="text-cyan-400/40 group-hover:text-cyan-400 transition-colors italic">{status}</span>
          
          {/* Mock Visualization */}
          <div className="flex items-end gap-1 h-8 opacity-20 group-hover:opacity-60 transition-opacity">
            {chartType === "bar" ? (
               [40, 70, 50, 90, 60, 80].map((h, i) => (
                 <div key={i} className="w-1 bg-sky-500 rounded-full" style={{ height: `${h}%` }} />
               ))
            ) : (
               <div className="w-20 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent relative">
                  <div className="absolute inset-0 bg-sky-500 blur-sm animate-pulse" />
               </div>
            )}
          </div>
       </div>
    </div>
  );
}
