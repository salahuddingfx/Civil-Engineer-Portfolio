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
  Search as SearchIcon,
  X,
  History,
  Lock,
  Globe
} from "lucide-react";

const navigation = [
  {
    title: "Dashboard",
    items: [
      { label: "Overview", icon: LayoutDashboard, to: "/admin/dashboard", id: "dashboard" },
    ]
  },
  {
    title: "Content Management",
    items: [
      { label: "Home", icon: Home, to: "/admin/home", id: "home" },
      { label: "About", icon: UserCircle, to: "/admin/about", id: "about" },
      { label: "Services", icon: Briefcase, to: "/admin/services", id: "services" },
      { label: "Projects", icon: Layers, to: "/admin/projects", id: "projects" },
      { label: "Testimonials", icon: MessageSquare, to: "/admin/testimonials", id: "testimonials" },
      { label: "Gallery", icon: ImageIcon, to: "/admin/gallery", id: "gallery" },
    ]
  },
  {
    title: "Communication",
    items: [
      { label: "Contact", icon: Mail, to: "/admin/contact", id: "contact" },
    ]
  },
  {
    title: "System",
    items: [
      { label: "Account", icon: UserCircle, to: "/admin/account", id: "account" },
      { label: "Security", icon: Lock, to: "/admin/security", id: "security" },
      { label: "SEO Settings", icon: Globe, to: "/admin/dashboard/seoMeta", id: "seo" },
    ]
  }
];

export default function AdminSidebar({ onClose }) {
  const location = useLocation();

  return (
    <div className="h-full flex flex-col bg-[#0B1220] border-r border-white/[0.08]">
      {/* Brand Header */}
      <div className="h-20 px-8 flex items-center justify-between border-b border-white/[0.05]">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-7 w-7 rounded-lg bg-[#19D2FF] flex items-center justify-center text-black font-black text-xs rotate-3 group-hover:rotate-0 transition-transform">
             A
          </div>
          <span className="text-lg font-black text-white tracking-widest uppercase italic">ALAM<span className="text-[#19D2FF]">.</span>ASHIK</span>
        </Link>
        <button 
          className="p-2 rounded-lg hover:bg-white/5 lg:hidden text-slate-500"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto admin-scrollbar p-6 space-y-10">
        {navigation.map((group) => (
          <div key={group.title} className="space-y-4">
            <h3 className="px-4 text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link 
                    key={item.id}
                    to={item.to}
                    onClick={onClose}
                    className={`
                      group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 relative border border-transparent
                      ${isActive ? 'bg-[#19D2FF]/10 text-white border-[#19D2FF]/20' : 'text-slate-400 hover:text-white hover:bg-[#0D1627] hover:border-white/[0.05]'}
                    `}
                  >
                    <item.icon size={18} className={`${isActive ? 'text-[#19D2FF]' : 'text-slate-500 group-hover:text-[#19D2FF]'} transition-colors`} />
                    <span className={`text-[11px] font-bold uppercase tracking-widest ${isActive ? 'translate-x-1' : 'group-hover:translate-x-1'} transition-transform`}>
                      {item.label}
                    </span>
                    
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#19D2FF] rounded-r-full shadow-[0_0_12px_rgba(25,210,255,0.4)]" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Quick Access Footer */}
      <div className="p-6 border-t border-white/[0.05] bg-black/10">
         <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-4">
            <div className="flex items-center justify-between">
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">System v2.1</span>
               <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            </div>
            <button className="w-full py-2.5 bg-white/5 border border-white/10 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-lg hover:bg-[#19D2FF] hover:text-black hover:border-[#19D2FF] transition-all flex items-center justify-center gap-2">
              <History size={12} />
              Recent Logs
            </button>
         </div>
      </div>
    </div>
  );
}
