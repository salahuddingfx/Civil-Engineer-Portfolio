import { useState, useEffect } from "react";
import { Search, Bell, Menu, X, User, Shield, ChevronLeft } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import "../../styles/admin.css";

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#070B14] text-white flex font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Blueprint Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-0 admin-blueprint-grid opacity-[0.03]" />

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden transition-all duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Responsive Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 transform bg-[#0B1220] border-r border-white/[0.08] transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <AdminSidebar onClose={() => setIsSidebarOpen(false)} />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen relative z-10">
        
        {/* Top Bar - Functional & Minimal */}
        <header className={`
          h-20 px-6 sm:px-10 border-b border-white/[0.08] flex items-center justify-between sticky top-0 z-40 transition-all duration-300
          ${isScrolled ? "bg-[#0B1220]/80 backdrop-blur-xl" : "bg-transparent"}
        `}>
          <div className="flex items-center gap-4">
            <button 
              className="p-2 rounded-lg hover:bg-white/5 lg:hidden text-slate-400 hover:text-white"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="hidden sm:flex items-center gap-3">
              <div className="h-6 w-[1.5px] bg-cyan-500/30" />
              <h1 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 italic">Structural_CMS // v2.0</h1>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-8">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/[0.07] rounded-xl text-slate-400">
               <Search size={14} />
               <input type="text" placeholder="Quick Search..." className="bg-transparent border-none outline-none text-[10px] uppercase font-bold tracking-widest w-40 placeholder:text-slate-600" />
            </div>

            <div className="flex items-center gap-4 border-l border-white/10 pl-4 sm:pl-8">
              <button className="relative p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-cyan-400 transition-colors">
                <Bell size={18} />
                <span className="absolute top-2 right-2 h-1.5 w-1.5 bg-cyan-400 rounded-full" />
              </button>

              <div className="flex items-center gap-3">
                <div className="hidden lg:block text-right">
                   <p className="text-[10px] font-black text-white uppercase tracking-wider">ALAM ASHIK</p>
                   <p className="text-[8px] font-bold text-cyan-400/60 uppercase tracking-widest">Master Admin</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-[1px] border border-white/10">
                   <div className="h-full w-full rounded-xl bg-[#070B14] flex items-center justify-center text-cyan-400">
                      <User size={20} />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 sm:p-10 flex-1 flex flex-col">
           {children}
        </div>

        {/* Sticky Mobile Save Hint / Info (Optional) */}
        <footer className="mt-auto px-10 py-6 border-t border-white/[0.05] opacity-50 flex flex-col sm:flex-row justify-between items-center gap-4">
           <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest italic">© 2026 ALAM ASHIK STUDIO · ENGINEERING PORTAL</p>
           <div className="flex gap-6">
              <span className="text-[8px] font-black text-cyan-500/40 uppercase">LATENCY: 8ms</span>
              <span className="text-[8px] font-black text-cyan-500/40 uppercase">STATUS: SECURE</span>
           </div>
        </footer>
      </main>
    </div>
  );
}
