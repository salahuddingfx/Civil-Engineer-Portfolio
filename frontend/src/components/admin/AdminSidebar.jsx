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
    <div className="h-full flex flex-col bg-white border-r border-slate-200">
      {/* Brand Header */}
      <div className="h-20 px-8 flex items-center justify-between border-b border-slate-200">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-7 w-7 rounded-lg bg-sky-500 flex items-center justify-center text-black font-black text-xs rotate-3 group-hover:rotate-0 transition-transform">
             A
          </div>
          <span className="text-lg font-black text-slate-900 tracking-tight uppercase">ENGR. ALAM ASHIK</span>
        </Link>
        <button 
          className="p-2 rounded-lg hover:bg-slate-100 lg:hidden text-slate-500"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto admin-scrollbar p-6 space-y-10">
        {navigation.map((group) => (
          <div key={group.title} className="space-y-4">
            <h3 className="px-4 text-[9px] font-black uppercase tracking-[0.4em] text-slate-600">
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
                      ${isActive ? 'bg-sky-100 text-slate-900 border-sky-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300'}
                    `}
                  >
                    <item.icon size={18} className={`${isActive ? 'text-sky-600' : 'text-slate-500 group-hover:text-sky-600'} transition-colors`} />
                    <span className={`text-[11px] font-bold uppercase tracking-widest ${isActive ? 'translate-x-1' : 'group-hover:translate-x-1'} transition-transform`}>
                      {item.label}
                    </span>
                    
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-sky-500 rounded-r-full shadow-[0_0_12px_rgba(14,165,233,0.3)]" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Quick Access Footer */}
      <div className="p-6 border-t border-slate-200 bg-slate-50">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
             <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Server Status</span>
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
             </div>
          </div>
      </div>
    </div>
  );
}
