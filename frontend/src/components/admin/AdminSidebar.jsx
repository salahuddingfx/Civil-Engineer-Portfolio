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
  FileText,
  Zap,
  Clock,
  Users
} from "lucide-react";

const navItems = [
  { label: "Control Hub", icon: LayoutDashboard, to: "/admin/dashboard", id: "dashboard", color: "text-cyan-400" },
  { label: "Home Vision", icon: Home, to: "/admin/home", id: "home", color: "text-blue-400" },
  { label: "About Legacy", icon: UserCircle, to: "/admin/about", id: "about", color: "text-indigo-400" },
  { label: "Skills Node", icon: Zap, to: "/admin/dashboard/skills", id: "skills", color: "text-yellow-400" },
  { label: "Career Timeline", icon: Clock, to: "/admin/dashboard/timeline", id: "timeline", color: "text-emerald-400" },
  { label: "Studio Team", icon: Users, to: "/admin/dashboard/team", id: "team", color: "text-rose-400" },
  { label: "Service Catalog", icon: Briefcase, to: "/admin/services", id: "services", color: "text-orange-400" },
  { label: "Project Assets", icon: Layers, to: "/admin/projects", id: "projects", color: "text-violet-400" },
  { label: "Client Reviews", icon: MessageSquare, to: "/admin/testimonials", id: "testimonials", color: "text-pink-400" },
  { label: "Media Gallery", icon: ImageIcon, to: "/admin/gallery", id: "gallery", color: "text-sky-400" },
  { label: "Contact Nodes", icon: Mail, to: "/admin/contact", id: "contact", color: "text-teal-400" },
  { label: "Core Security", icon: Settings, to: "/admin/account", id: "settings", color: "text-slate-400" },
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="w-80 h-screen bg-[#05060f] border-r border-white/[0.05] flex flex-col fixed left-0 top-0 z-50 shadow-2xl">
      {/* Abstract Background Decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
         <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-cyan-500/20 to-transparent" />
      </div>

      {/* Branding */}
      <div className="p-10 mb-4 relative z-10">
        <Link to="/" className="flex items-center gap-2 mb-2 group">
          <div className="h-8 w-8 rounded-lg bg-cyan-400 flex items-center justify-center text-black font-black rotate-3 group-hover:rotate-0 transition-transform">
             A
          </div>
          <span className="text-xl font-black text-white tracking-tighter uppercase italic">ALAM<span className="text-cyan-400">.</span>ASHIK</span>
        </Link>
        <div className="flex items-center gap-3 mt-4">
           <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
           <p className="text-[9px] uppercase tracking-[0.3em] text-slate-600 font-bold italic">Persistence: Online</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 space-y-1.5 overflow-y-auto custom-scrollbar relative z-10 pb-10">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link 
              key={item.id}
              to={item.to}
              className={`group flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 relative overflow-hidden ${isActive ? 'bg-white/[0.03] text-white shadow-inner' : 'text-slate-500 hover:text-slate-200'}`}
            >
              <div className="flex items-center gap-5 relative z-10">
                <item.icon size={18} className={`${isActive ? item.color : 'text-slate-700 group-hover:text-slate-400'} transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className={`text-[10px] font-black uppercase tracking-[0.15em] transition-all ${isActive ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>{item.label}</span>
              </div>
              
              {isActive && (
                <>
                  <ChevronRight size={12} className="text-cyan-400 animate-pulse" />
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-cyan-400 rounded-r-full shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Profile/Quick Action */}
      <div className="p-8 border-t border-white/[0.05] bg-black/40 relative z-10">
         <button className="w-full py-4 bg-white/5 border border-white/10 text-white text-[9px] font-black uppercase tracking-[0.25em] rounded-xl hover:bg-cyan-400 hover:text-black hover:border-cyan-400 transition-all flex items-center justify-center gap-3 active:scale-95 group">
           <ShieldCheck size={14} className="group-hover:rotate-12 transition-transform" />
           Security Audit
         </button>
      </div>
    </aside>
  );
}
