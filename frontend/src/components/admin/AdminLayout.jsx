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
    <div className="min-h-screen flex font-sans selection:bg-cyan-500/30 overflow-x-hidden transition-colors duration-500" style={{ background: "var(--admin-bg)", color: "var(--admin-text-primary)" }}>
      {/* Blueprint Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-0 admin-blueprint-grid opacity-[0.05]" />

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 lg:hidden transition-all duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Responsive Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `} style={{ background: "var(--admin-card)", borderRight: "1px solid var(--admin-border)" }}>
        <AdminSidebar onClose={() => setIsSidebarOpen(false)} />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen relative z-10">
        
        {/* Top Bar - Functional & Minimal */}
        <header className={`
          h-20 px-6 sm:px-10 flex items-center justify-between sticky top-0 z-40 transition-all duration-300
          ${isScrolled ? "backdrop-blur-xl border-b" : "bg-transparent"}
        `} style={{ 
          background: isScrolled ? "var(--admin-card)" : "transparent",
          borderBottom: "1px solid var(--admin-border)"
        }}>
          <div className="flex items-center gap-4">
            <button 
              className="p-2 rounded-lg lg:hidden hover:bg-[color:var(--admin-bg)]0/10 transition-colors"
              style={{ color: "var(--admin-text-secondary)" }}
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--admin-border)] bg-[var(--admin-bg)] opacity-30 scale-90 origin-left">
              <Shield size={10} className="text-sky-500" />
              <span className="text-[8px] font-black uppercase tracking-[0.4em] whitespace-nowrap" style={{ color: "var(--admin-text-primary)" }}>Admin Control Panel</span>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-8">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 border border-[var(--admin-border)] rounded-xl transition-all"
              style={{ background: "var(--admin-input-bg)", color: "var(--admin-text-secondary)" }}>
               <Search size={14} />
               <input type="text" placeholder="Quick Search..." className="bg-transparent border-none outline-none text-[10px] uppercase font-bold tracking-widest w-40 placeholder:opacity-40" style={{ color: "var(--admin-text-primary)" }} />
            </div>

            <div className="flex items-center gap-4 border-l pl-4 sm:pl-8" style={{ borderLeftColor: "var(--admin-border)" }}>
              <button className="relative p-2 rounded-lg hover:bg-[color:var(--admin-bg)]0/10 transition-colors" style={{ color: "var(--admin-text-secondary)" }}>
                <Bell size={18} />
                <span className="absolute top-2 right-2 h-1.5 w-1.5 bg-sky-500 rounded-full" />
              </button>

              <div className="flex items-center gap-3">
                <div className="hidden lg:block text-right">
                   <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: "var(--admin-text-primary)" }}>ENGR ALAM ASHIK</p>
                   <p className="text-[8px] font-bold text-sky-500 uppercase tracking-widest">Master Admin</p>
                </div>
                <div className="h-10 w-10 rounded-xl p-[1px] border border-[var(--admin-border)]" style={{ background: "var(--admin-bg)" }}>
                   <div className="h-full w-full rounded-xl flex items-center justify-center text-sky-500">
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
        <footer className="mt-auto px-10 py-6 border-t" style={{ borderTopColor: "var(--admin-border)", opacity: 0.5 }}>
           <p className="text-[9px] font-bold uppercase tracking-widest italic" style={{ color: "var(--admin-text-secondary)" }}>© {new Date().getFullYear()} ENGR ALAM ASHIK · Professional Portfolio</p>
        </footer>
      </main>
    </div>
  );
}
