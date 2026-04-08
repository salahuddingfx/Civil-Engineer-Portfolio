import { useState } from "react";
import { Search, Bell, Settings2, User } from "lucide-react";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ children }) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-[#020202] text-white flex">
      {/* Persistent Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 ml-80 flex flex-col min-h-screen overflow-x-hidden">
        
        {/* Top Professional Header */}
        <header className="h-24 px-12 border-b border-white/5 bg-[#050505]/50 backdrop-blur-3xl flex items-center justify-between sticky top-0 z-40">
          <div className="flex-1 max-w-xl">
             <div className="relative group">
                <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#444] group-focus-within:text-cyan-400 transition-colors" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search administrative parameters..."
                  className="w-full bg-white/2 border border-white/5 rounded-2xl py-4 pl-16 pr-6 text-[11px] font-bold uppercase tracking-widest outline-none focus:border-cyan-400/30 focus:bg-white/5 transition-all"
                />
             </div>
          </div>

          <div className="flex items-center gap-10">
             <div className="flex items-center gap-6 border-r border-white/10 pr-10">
                <button className="relative group p-2">
                   <Bell size={20} className="text-[#555] group-hover:text-cyan-400 transition-colors" />
                   <span className="absolute top-1 right-1 h-2 w-2 bg-cyan-400 rounded-full shadow-[0_0_8px_#00d2ff]" />
                </button>
                <button className="group p-2">
                   <Settings2 size={20} className="text-[#555] group-hover:text-cyan-400 transition-colors" />
                </button>
             </div>

             <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                   <p className="text-[10px] font-black text-white uppercase tracking-widest">ALAM ASHIK</p>
                   <p className="text-[9px] font-bold text-cyan-400/40 uppercase tracking-widest mt-1">Lead Architect</p>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 p-[1px] shadow-lg shadow-cyan-950/20">
                   <div className="h-full w-full rounded-2xl bg-[#0a0a0a] flex items-center justify-center text-cyan-400">
                      <User size={24} />
                   </div>
                </div>
             </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="p-12 relative">
           <div className="absolute top-0 right-0 h-[600px] w-[600px] bg-cyan-400/5 blur-[120px] rounded-full -mr-40 -mt-20 pointer-events-none" />
           {children}
        </div>

        {/* Micro Footer */}
        <footer className="mt-auto p-12 border-t border-white/5 flex justify-between items-center text-[9px] font-bold text-[#222] uppercase tracking-[0.5em] italic">
           <span>© 2026 ALAM ASHIK STUDIO · PERSISTENT DATA ENCRYPTION ENABLED</span>
           <div className="flex gap-10">
              <span className="text-cyan-400/20">Latency: 12ms</span>
              <span className="text-cyan-400/20">Core Temp: 42°C</span>
           </div>
        </footer>
      </main>
    </div>
  );
}
