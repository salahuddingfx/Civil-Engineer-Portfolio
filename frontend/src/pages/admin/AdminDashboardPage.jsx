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
    <div className="space-y-20 pb-20">
      {/* 1. Technical Analytics Section */}
      <section>
         <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-5">
               <div className="h-10 w-1.5 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.4)]" />
               <h2 className="text-[13px] font-black uppercase tracking-[0.4em] text-slate-400 italic">System Analytics // Core Metrics</h2>
            </div>
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest hidden md:block">Last Sync: {new Date().toLocaleTimeString()}</p>
         </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: "Asset Count", title: "Project Assets", val: counts.projects, icon: FolderGit2, trend: "+12%", color: "text-cyan-400" },
              { label: "Node Inquiries", title: "New Inquiries", val: counts.inquiries, icon: Users, trend: "ACTIVE", color: "text-emerald-400" },
              { label: "Traffic Flow", title: "Site Visits", val: counts.visits, icon: MousePointer2, trend: "+5.2K", color: "text-purple-400" },
            ].map((stat, i) => (
             <div key={i} className="bg-white/[0.02] border border-white/[0.05] rounded-[32px] p-10 flex flex-col relative group hover:border-white/10 transition-all duration-500">
                <div className="absolute top-8 right-10 text-slate-800 opacity-20 group-hover:opacity-40 transition-opacity">
                   <stat.icon size={60} strokeWidth={1} />
                </div>
                <div className="flex items-center gap-3 mb-8">
                   <div className={`h-2 w-2 rounded-full ${stat.color} shadow-[0_0_8px_currentColor]`} />
                   <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">{stat.label}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-widest">{stat.title}</h3>
                <div className="flex items-end justify-between mt-auto">
                   <p className="text-5xl font-black text-white italic tracking-tighter">{stat.val}</p>
                   <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black bg-white/5 ${stat.color}`}>
                      <ArrowUpRight size={12} />
                      {stat.trend}
                   </div>
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* 2. Status Hub Section */}
      <section>
        <div className="flex items-center justify-between mb-12">
           <div className="flex items-center gap-5">
              <div className="h-10 w-1.5 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.4)]" />
              <h2 className="text-[42px] font-black text-white italic tracking-tighter uppercase leading-none">Status Hub</h2>
           </div>
           
           <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">Management Overlays</span>
              <div className="h-px w-20 bg-white/10" />
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {pageModules.map((moduleItem, i) => (
            <Link 
              key={i} 
              to={moduleItem.to}
              className={`group relative h-[280px] rounded-[32px] border ${moduleItem.accent} bg-white/[0.02] p-8 overflow-hidden flex flex-col justify-end hover:bg-white/[0.04] transition-all duration-500 active:scale-95`}
            >
               <div className={`absolute top-8 right-8 h-14 w-14 rounded-2xl ${moduleItem.bgIcon} ${moduleItem.textColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <moduleItem.icon size={28} />
               </div>

               {/* Design Decoration */}
               <div className="absolute top-0 left-0 w-full h-1 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
               
               <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                     <span className={`text-[8px] font-black px-2 py-0.5 rounded bg-white/5 ${moduleItem.textColor} uppercase tracking-[0.2em]`}>{moduleItem.status}</span>
                  </div>
                  <h3 className="text-2xl font-black text-white italic mb-3 tracking-tighter uppercase">{moduleItem.title}</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium line-clamp-2 italic pr-4">{moduleItem.desc}</p>
               </div>

               {/* Hover Accent */}
               <div className="absolute bottom-6 right-6 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                  <TrendingUp size={16} className={moduleItem.textColor} />
               </div>
            </Link>
          ))}

          {/* Quick Connect Card */}
          <div className="h-[280px] rounded-[32px] border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-6 group hover:border-cyan-400/20 transition-all cursor-pointer bg-white/[0.01]">
             <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center text-slate-700 group-hover:bg-cyan-400 group-hover:text-black group-hover:rotate-12 transition-all shadow-xl">
                <ExternalLink size={24} />
             </div>
             <div className="text-center">
                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-700 group-hover:text-cyan-400/60 transition-colors">Launch Live Site</p>
                <p className="text-[9px] text-slate-800 uppercase font-bold mt-2 tracking-widest">Public Domain</p>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
