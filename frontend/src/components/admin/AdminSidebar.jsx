import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Home, 
  UserCircle, 
  Briefcase, 
  Layers, 
  MessageSquare, 
  Image as ImageIcon, 
  Mail, 
  Settings,
  ShieldCheck,
  ChevronRight,
  FileText
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/admin/dashboard", id: "dashboard" },
  { label: "Home Page", icon: Home, to: "/admin/home", id: "home" },
  { label: "About Section", icon: UserCircle, to: "/admin/about", id: "about" },
  { label: "Services", icon: Briefcase, to: "/admin/services", id: "services" },
  { label: "Projects", icon: Layers, to: "/admin/projects", id: "projects" },
  { label: "Testimonials", icon: MessageSquare, to: "/admin/testimonials", id: "testimonials" },
  { label: "Gallery", icon: ImageIcon, to: "/admin/gallery", id: "gallery" },
  { label: "Contact", icon: Mail, to: "/admin/contact", id: "contact" },
  { label: "Account Settings", icon: Settings, to: "/admin/account", id: "settings" },
];

export default function AdminSidebar() {
  const { language } = useLanguage();
  const location = useLocation();

  return (
    <aside className="w-80 h-screen bg-[#050505] border-r border-white/5 flex flex-col fixed left-0 top-0 z-50">
      {/* Branding */}
      <div className="p-10 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl font-black text-white tracking-tighter">ALAM<span className="text-cyan-400">.</span>ASHIK</span>
        </div>
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#444] font-bold italic">Precision Engineering</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link 
              key={item.id}
              to={item.to}
              className={`group flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${isActive ? 'bg-cyan-400/10 text-cyan-400' : 'text-[#555] hover:bg-white/5 hover:text-white'}`}
            >
              <div className="flex items-center gap-4">
                <item.icon size={20} className={`${isActive ? 'text-cyan-400' : 'text-[#444] group-hover:text-white'} transition-colors`} />
                <span className="text-[11px] font-bold uppercase tracking-widest">{item.label}</span>
              </div>
              {isActive && <ChevronRight size={14} className="animate-pulse" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Action */}
      <div className="p-8 border-t border-white/5 bg-[#080808]/50">
         <button className="w-full py-5 bg-cyan-400 text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-[0_20px_40px_rgba(0,210,255,0.1)] hover:bg-cyan-300 hover:shadow-[0_25px_50px_rgba(0,210,255,0.2)] transition-all flex items-center justify-center gap-3 active:scale-95 group">
           <FileText size={16} className="group-hover:rotate-12 transition-transform" />
           Generate Report
         </button>
         
         <div className="mt-8 flex items-center justify-center gap-3">
            <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[9px] font-bold text-[#222] uppercase tracking-widest">Administrative Node v6.1</span>
         </div>
      </div>
    </aside>
  );
}
