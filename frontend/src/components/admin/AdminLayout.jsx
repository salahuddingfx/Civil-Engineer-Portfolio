import { useState } from "react";
import { Search, Bell, Settings2, User, Globe, Shield } from "lucide-react";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ children }) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-[#020308] text-white flex font-sans selection:bg-cyan-500/30">
      {/* Persistent Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 ml-80 flex flex-col min-h-screen overflow-x-hidden relative">
        
        {/* Architectural Background Patterns */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-20">
           <div className="absolute top-0 right-0 h-[800px] w-[800px] bg-cyan-500/5 blur-[160px] rounded-full -mr-40 -mt-40" />
           <div className="absolute bottom-0 left-0 h-[600px] w-[600px] bg-blue-600/5 blur-[140px] rounded-full -ml-40 -mb-40" />
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
        </div>

        {/* Top Professional Header */}
        <header className="h-24 px-12 border-b border-white/[0.05] bg-[#05060f]/60 backdrop-blur-3xl flex items-center justify-between sticky top-0 z-40">
          <div className="flex-1 max-w-xl">
             <div className="relative group">
                <Search size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="SEARCH ADMINISTRATIVE PARAMETERS..."
                  className="w-full bg-white/[0.03] border border-white/[0.07] rounded-2xl py-4 pl-16 pr-6 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-cyan-400/40 focus:bg-white/[0.05] transition-all placeholder:text-slate-600"
                />
             </div>
          </div>

          <div className="flex items-center gap-10">
             <div className="flex items-center gap-6 border-r border-white/10 pr-10">
                <button className="relative group p-2.5 rounded-xl hover:bg-white/5 transition-all" title="Notifications">
                   <Bell size={18} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
                   <span className="absolute top-2 right-2 h-2 w-2 bg-cyan-400 rounded-full shadow-[0_0_12px_#00d2ff]" />
                </button>
                <button className="group p-2.5 rounded-xl hover:bg-white/5 transition-all" title="Global Settings">
                   <Settings2 size={18} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </button>
             </div>

             <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                   <p className="text-[11px] font-black text-white uppercase tracking-widest">ALAM ASHIK</p>
                   <div className="flex items-center justify-end gap-2 mt-1">
                      <Shield size={10} className="text-cyan-400/60" />
                      <p className="text-[9px] font-bold text-cyan-400/50 uppercase tracking-widest">Master Admin</p>
                   </div>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-400/40 to-blue-600/40 p-[1.5px] shadow-2xl shadow-cyan-950/20">
                   <div className="h-full w-full rounded-2xl bg-[#0d0f1a] flex items-center justify-center text-cyan-400 border border-white/5">
                      <User size={24} />
                   </div>
                </div>
             </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="p-12 relative z-10 flex-1">
           {children}
        </div>

        {/* Micro Footer */}
        <footer className="mt-auto p-12 border-t border-white/[0.05] bg-black/20 flex justify-between items-center text-[10px] font-bold text-slate-700 uppercase tracking-[0.4em] italic z-10">
           <div className="flex items-center gap-4">
              <Globe size={14} className="text-slate-800" />
              <span>© 2026 ALAM ASHIK STUDIO · PERSISTENT DATA ENCRYPTION</span>
           </div>
           <div className="flex gap-10">
              <span className="text-cyan-400/10">LATENCY: 12ms</span>
              <span className="text-cyan-400/10">LOAD: SUB-ZERO</span>
           </div>
        </footer>
      </main>
    </div>
  );
}
