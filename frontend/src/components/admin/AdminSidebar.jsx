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
    title: "Edit Website",
    items: [
      { label: "Home Page", icon: Home, to: "/admin/home", id: "home" },
      { label: "About Me", icon: UserCircle, to: "/admin/about", id: "about" },
      { label: "Services", icon: Briefcase, to: "/admin/services", id: "services" },
      { label: "Projects", icon: Layers, to: "/admin/projects", id: "projects" },
      { label: "Testimonials", icon: MessageSquare, to: "/admin/testimonials", id: "testimonials" },
      { label: "Photo Gallery", icon: ImageIcon, to: "/admin/gallery", id: "gallery" },
    ]
  },
  {
    title: "Messages",
    items: [
      { label: "Inbox", icon: Mail, to: "/admin/dashboard/contactSubmissions", id: "contact" },
      { label: "Contact Details", icon: Settings, to: "/admin/contact", id: "contact-info" },
    ]
  },
  {
    title: "Settings",
    items: [
      { label: "My Account", icon: UserCircle, to: "/admin/account", id: "account" },
      { label: "Google / SEO", icon: Globe, to: "/admin/dashboard/seoMeta", id: "seo" },
    ]
  }
];

export default function AdminSidebar({ onClose }) {
  const location = useLocation();

  return (
    <div className="h-full flex flex-col transition-colors duration-500" style={{ background: "var(--admin-card)", borderRight: "1px solid var(--admin-border)" }}>
      {/* Brand Header */}
      <div className="h-20 px-8 flex items-center justify-between border-b" style={{ borderBottomColor: "var(--admin-border)" }}>
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-7 w-7 rounded-lg bg-sky-500 flex items-center justify-center text-black font-black text-xs rotate-3 group-hover:rotate-0 transition-transform">
             A
          </div>
          <span className="text-lg font-black tracking-tight uppercase" style={{ color: "var(--admin-text-primary)" }}>Admin Panel</span>
        </Link>
        <button 
          className="p-2 rounded-lg hover:bg-[color:var(--admin-bg)]0/10 lg:hidden"
          style={{ color: "var(--admin-text-secondary)" }}
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto admin-scrollbar p-6 space-y-10">
        {navigation.map((group) => (
          <div key={group.title} className="space-y-4">
            <h3 className="px-4 text-[9px] font-black uppercase tracking-[0.4em] opacity-60 truncate" style={{ color: "var(--admin-text-primary)" }}>
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
                      group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 relative border
                      ${isActive ? 'shadow-sm' : 'hover:bg-[color:var(--admin-bg)]0/5'}
                    `}
                    style={{ 
                      background: isActive ? "var(--admin-bg)" : "transparent",
                      borderColor: isActive ? "var(--admin-border)" : "transparent",
                      color: isActive ? "var(--admin-text-primary)" : "var(--admin-text-secondary)"
                    }}
                  >
                    <item.icon size={18} className={`${isActive ? 'text-sky-500' : 'opacity-50 group-hover:text-sky-500 group-hover:opacity-100'} transition-all`} />
                    <span className={`text-[11px] font-bold uppercase tracking-widest truncate ${isActive ? 'translate-x-1' : 'group-hover:translate-x-1'} transition-transform`}>
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
      <div className="p-6 border-t space-y-4" style={{ borderTopColor: "var(--admin-border)", background: "var(--admin-bg)" }}>
          <a 
            href="/" 
            target="_blank"
            className="flex items-center justify-between p-4 rounded-xl border group hover:border-sky-500 transition-all" 
            style={{ background: "var(--admin-card)", borderColor: "var(--admin-border)" }}
          >
             <span className="text-[9px] font-black uppercase tracking-widest text-sky-500">View Website</span>
             <Globe size={14} className="text-sky-500 group-hover:rotate-12 transition-transform" />
          </a>
      </div>
    </div>
  );
}
