import { useEffect, useState } from "react";
import { 
  FolderGit2, 
  MessageSquareQuote, 
  Settings, 
  Users, 
  MousePointer2,
  Home,
  UserCircle,
  Briefcase,
  Layers,
  Image as ImageIcon,
  Mail,
  Search as SearchIcon,
  Activity,
  Plus,
  ArrowUpRight,
  TrendingUp,
  ExternalLink
} from "lucide-react";
import { adminList, api } from "../../lib/api";
import { Link } from "react-router-dom";

const pageModules = [
  { 
    title: "Home Vision", 
    desc: "Update primary vision, hero typography, and technical highlights.", 
    to: "/admin/home", 
    icon: Home,
    status: "OPTIMIZED",
    accent: "border-blue-500/30",
    bgIcon: "bg-blue-500/5",
    textColor: "text-blue-400"
  },
  { 
    title: "About Legacy", 
    desc: "Refine consultancy legacy and structural journey details.", 
    to: "/admin/about", 
    icon: UserCircle,
    status: "SYNCED",
    accent: "border-indigo-500/30",
    bgIcon: "bg-indigo-500/5",
    textColor: "text-indigo-400"
  },
  { 
    title: "Service Catalog", 
    desc: "Configure engineering and architectural service portfolio.", 
    to: "/admin/services", 
    icon: Briefcase,
    status: "EXPANDED",
    accent: "border-orange-500/30",
    bgIcon: "bg-orange-500/5",
    textColor: "text-orange-400"
  },
  { 
    title: "Project Assets", 
    desc: "Document high-performance architectural and structural assets.", 
    to: "/admin/projects", 
    icon: Layers,
    status: "ACTIVE",
    accent: "border-violet-500/30",
    bgIcon: "bg-violet-500/5",
    textColor: "text-violet-400"
  },
  { 
    title: "Client Reviews", 
    desc: "Curate verified client feedback and professional endorsements.", 
    to: "/admin/testimonials", 
    icon: MessageSquareQuote,
    status: "VERIFIED",
    accent: "border-pink-500/30",
    bgIcon: "bg-pink-500/5",
    textColor: "text-pink-400"
  },
  { 
    title: "Media Gallery", 
    desc: "Manage site photography and high-resolution architectural renders.", 
    to: "/admin/gallery", 
    icon: ImageIcon,
    status: "STAGING",
    accent: "border-sky-500/30",
    bgIcon: "bg-sky-500/5",
    textColor: "text-sky-400"
  },
  { 
    title: "Contact Nodes", 
    desc: "Manage studio location, social nodes, and communication hubs.", 
    to: "/admin/contact", 
    icon: Mail,
    status: "ONLINE",
    accent: "border-teal-500/30",
    bgIcon: "bg-teal-500/5",
    textColor: "text-teal-400"
  },
  { 
    title: "Strategic SEO", 
    desc: "Enhance discovery and global technical authority settings.", 
    to: "/admin/dashboard/seoMeta", 
    icon: SearchIcon,
    status: "INDEXED",
    accent: "border-slate-500/30",
    bgIcon: "bg-slate-500/5",
    textColor: "text-slate-400"
  },
];

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState({
    projects: 0,
    inquiries: 0,
    visits: 0
  });

  useEffect(() => {
    const fetchRealCounts = async () => {
      try {
        const [projectData, inquiryData, statData] = await Promise.all([
          adminList("projects", { limit: 1 }),
          adminList("contactSubmissions", { limit: 1 }),
          api.get("/stats")
        ]);
        
        setCounts({
          projects: projectData.meta?.total || 0,
          inquiries: inquiryData.meta?.total || 0,
          visits: statData.data?.success ? statData.data.count : 0
        });
      } catch (err) {
        console.warn("Analytics Sync: Deferred to cached metrics.");
      }
    };

    fetchRealCounts();
  }, []);

  return (
    <div className="space-y-24 pb-32 animate-in fade-in slide-in-from-bottom-10 duration-1000">
      {/* 1. Technical Analytics Section */}
      <section className="relative px-4">
         <div className="flex items-center justify-between mb-16 px-4">
            <div className="flex items-center gap-6">
               <div className="h-12 w-2 bg-cyan-500 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.5)]" />
               <div>
                  <h2 className="text-[14px] font-black uppercase tracking-[0.5em] text-cyan-400/80 italic mb-1">System_Analytics</h2>
                  <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest italic">Core_Network_Diagnostics // Active_Flow</p>
               </div>
            </div>
            <div className="hidden md:flex items-center gap-6 px-6 py-3 bg-white/[0.02] border border-white/[0.05] rounded-2xl">
               <Activity size={12} className="text-cyan-400 animate-pulse" />
               <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.3em] italic">Real-Time Sync: {new Date().toLocaleTimeString()}</p>
            </div>
         </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { label: "Storage Units", title: "Project Assets", val: counts.projects, icon: FolderGit2, trend: "+12%", color: "text-cyan-400", glow: "shadow-cyan-500/10" },
              { label: "Request Nodes", title: "Active Inquiries", val: counts.inquiries, icon: Users, trend: "ACTIVE", color: "text-emerald-400", glow: "shadow-emerald-500/10" },
              { label: "Traffic Volume", title: "System Visits", val: counts.visits, icon: MousePointer2, trend: "+5.2K", color: "text-purple-400", glow: "shadow-purple-500/10" },
            ].map((stat, i) => (
             <div key={i} className="bg-[#080c14]/40 border border-white/[0.05] rounded-[48px] p-12 flex flex-col relative group hover:border-white/10 transition-all duration-700 shadow-2xl backdrop-blur-3xl overflow-hidden">
                <div className="absolute -top-10 -right-10 text-white opacity-[0.02] group-hover:opacity-[0.05] group-hover:scale-110 transition-all duration-1000">
                   <stat.icon size={220} strokeWidth={0.5} />
                </div>
                
                <div className="flex items-center gap-4 mb-10">
                   <div className={`h-2.5 w-2.5 rounded-full ${stat.color} shadow-[0_0_12px_currentColor]`} />
                   <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 italic">{stat.label}</span>
                </div>
                
                <h3 className="text-[11px] font-black text-slate-400 mb-2 uppercase tracking-[0.4em] italic leading-none">{stat.title}</h3>
                
                <div className="flex items-end justify-between mt-6">
                   <p className="text-6xl font-black text-white italic tracking-tighter leading-none">{stat.val}</p>
                   <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black bg-white/[0.03] border border-white/[0.05] ${stat.color} shadow-xl`}>
                      <TrendingUp size={12} />
                      {stat.trend}
                   </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-40 transition-opacity" style={{ color: `var(--${stat.color.split('-')[1]})` }} />
             </div>
           ))}
        </div>
      </section>

      {/* 2. Status Hub Section */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-16 px-4">
           <div className="flex items-center gap-6">
              <div className="h-12 w-2 bg-violet-500 rounded-full shadow-[0_0_20px_rgba(139,92,246,0.5)]" />
              <div>
                 <h2 className="text-[48px] font-black text-white italic tracking-tighter uppercase leading-none">Status Hub</h2>
                 <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.5em] italic mt-2 ml-1">Universal_Control_Interface</p>
              </div>
           </div>
           
           <div className="hidden lg:flex items-center gap-6">
              <div className="h-px w-32 bg-gradient-to-l from-white/10 to-transparent" />
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em] italic">System v6.1</span>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10">
          {pageModules.map((moduleItem, i) => (
            <Link 
              key={i} 
              to={moduleItem.to}
              className={`group relative h-[320px] rounded-[56px] border ${moduleItem.accent} bg-[#080c14]/40 p-10 overflow-hidden flex flex-col justify-end hover:bg-[#0c1222]/60 transition-all duration-700 active:scale-95 shadow-2xl backdrop-blur-3xl`}
            >
               <div className={`absolute top-10 right-10 h-16 w-16 rounded-3xl ${moduleItem.bgIcon} ${moduleItem.textColor} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 border border-white/[0.05] shadow-xl`}>
                  <moduleItem.icon size={28} strokeWidth={1.5} />
               </div>

               {/* Design Decoration */}
               <div className="absolute top-0 left-0 w-full h-1 bg-white/[0.05] opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-current opacity-[0.02] blur-[80px] rounded-full" style={{ color: `var(--${moduleItem.textColor.split('-')[1]})` }} />
               
               <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-5">
                     <span className={`text-[8px] font-black px-3 py-1 rounded-full bg-white/[0.05] ${moduleItem.textColor} uppercase tracking-[0.3em] border border-white/[0.03]`}>{moduleItem.status}</span>
                  </div>
                  <h3 className="text-3xl font-black text-white italic mb-4 tracking-tighter uppercase leading-none">{moduleItem.title}</h3>
                  <p className="text-[12px] text-slate-500 leading-relaxed font-bold italic line-clamp-2 pr-4 tracking-tight group-hover:text-slate-400 transition-colors uppercase">{moduleItem.desc}</p>
               </div>

               {/* Hover Accent */}
               <div className="absolute bottom-10 right-10 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  <div className={`p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05] ${moduleItem.textColor} shadow-2xl`}>
                     <Plus size={20} strokeWidth={3} />
                  </div>
               </div>
            </Link>
          ))}

          {/* Quick Connect & Legacy Hub Card */}
          <div className="h-[320px] rounded-[56px] border-2 border-dashed border-white/[0.03] flex flex-col items-center justify-center gap-8 group hover:border-cyan-400/20 transition-all duration-700 cursor-pointer bg-white/[0.01] relative overflow-hidden">
             <div className="absolute inset-0 bg-tech-grid opacity-[0.03] pointer-events-none" />
             <div className="h-20 w-20 rounded-3xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-slate-800 group-hover:bg-cyan-400 group-hover:text-black group-hover:rotate-12 transition-all duration-700 shadow-2xl">
                <ExternalLink size={32} />
             </div>
             <div className="text-center">
                <p className="text-[12px] font-black uppercase tracking-[0.5em] text-slate-700 group-hover:text-cyan-400/80 transition-colors italic">External Portal</p>
                <div className="h-[1px] w-12 bg-white/5 mx-auto my-4" />
                <p className="text-[9px] text-slate-800 uppercase font-bold tracking-[0.4em] italic">Architecture_Public_UI</p>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
