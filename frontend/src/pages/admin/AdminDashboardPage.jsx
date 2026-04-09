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
  Plus,
  ArrowUpRight,
  TrendingUp,
  ExternalLink,
  History,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { adminList, api } from "../../lib/api";
import { Link } from "react-router-dom";
import "../../styles/admin.css";

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState({
    projects: 0,
    inquiries: 0,
    visits: 0,
    services: 0
  });

  const [recentLogs] = useState([
    { id: 1, action: "Project Updated", details: "Bridge Structural Analysis Rev B", time: "2h ago", icon: CheckCircle2, color: "text-emerald-500" },
    { id: 2, action: "New Inquiry", details: "Modern Residential Complex / Cox's Bazar", time: "5h ago", icon: Mail, color: "text-[#19D2FF]" },
    { id: 3, action: "Service Modified", details: "Structural Health Monitoring", time: "Yesterday", icon: Settings, color: "text-amber-500" },
  ]);

  useEffect(() => {
    const fetchRealCounts = async () => {
      try {
        const [projectData, inquiryData, serviceData, statData] = await Promise.all([
          adminList("projects", { limit: 1 }),
          adminList("contactSubmissions", { limit: 1 }),
          adminList("services", { limit: 1 }),
          api.get("/stats")
        ]);
        
        setCounts({
          projects: projectData.meta?.total || 0,
          inquiries: inquiryData.meta?.total || 0,
          services: serviceData.meta?.total || 0,
          visits: statData.data?.success ? statData.data.count : 0
        });
      } catch (err) {
        console.warn("Analytics Sync: Using cached local state.");
      }
    };

    fetchRealCounts();
  }, []);

  const stats = [
    { label: "Engineering Assets", title: "Total Projects", val: counts.projects, icon: Layers, color: "text-[#19D2FF]" },
    { label: "Consultancy Scope", title: "Active Services", val: counts.services, icon: Briefcase, color: "text-amber-500" },
    { label: "Request Nodes", title: "Site Inquiries", val: counts.inquiries, icon: Mail, color: "text-emerald-500" },
    { label: "Traffic Flow", title: "System Visits", val: counts.visits, icon: MousePointer2, color: "text-indigo-500" },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* 1. Professional Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-white/[0.05] pb-6">
        <div>
          <h2 className="text-2xl font-black text-white tracking-widest uppercase leading-none">System Dashboard</h2>
          <p className="text-[10px] text-[#19D2FF] font-bold uppercase tracking-[0.3em] mt-2">Studio_Operations_Overview</p>
        </div>
        <div className="flex items-center gap-4 bg-[#0D1627] border border-white/[0.05] p-1.5 rounded-lg">
           <div className="h-7 px-3 flex items-center bg-cyan-500/10 rounded text-[9px] font-black uppercase tracking-widest text-[#19D2FF]">
             Synced: {new Date().toLocaleDateString()}
           </div>
        </div>
      </div>

      {/* 2. Simplified Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="admin-card p-5 flex flex-col gap-4 relative overflow-hidden group">
            {/* Sharp side accent */}
            <div className={`absolute top-0 left-0 w-1 h-full opacity-50 transition-all duration-300 group-hover:opacity-100 ${stat.color.replace('text-', 'bg-')}`} />
            
            <div className="flex items-center justify-between pl-3 ">
               <div className="space-y-1">
                 <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.title}</h3>
                 <p className="text-3xl font-black text-white tracking-tight">{stat.val}</p>
               </div>
               <div className={`p-2.5 rounded-lg bg-[#0D1627] border border-white/[0.05] ${stat.color}`}>
                 <stat.icon size={18} />
               </div>
            </div>
            <div className="pl-3 border-t border-white/[0.05] pt-3 mt-1">
               <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* 3. Quick Action Nodes */}
        <div className="xl:col-span-2 space-y-8">
           <div className="flex items-center gap-4 mb-2 border-b border-white/[0.05] pb-4">
              <Plus size={16} className="text-[#19D2FF]" />
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Rapid_Commit_Nodes</h3>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "New Project Asset", to: "/admin/projects", icon: Layers, desc: "Add structural case study" },
                { label: "Register Service", to: "/admin/services", icon: Briefcase, desc: "Define consultancy package" },
                { label: "Media Intake", to: "/admin/gallery", icon: ImageIcon, desc: "Upload architectural renders" },
                { label: "Post Testimonial", to: "/admin/testimonials", icon: MessageSquareQuote, desc: "Log client endorsement" },
              ].map((action, i) => (
                <Link key={i} to={action.to} className="admin-card p-5 flex items-center gap-5 group hover:border-[#19D2FF]/30 transition-colors">
                   <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-[#0D1627] border border-white/[0.05] flex items-center justify-center text-slate-400 group-hover:text-[#19D2FF] group-hover:border-[#19D2FF]/20 transition-all">
                      <action.icon size={20} />
                   </div>
                   <div className="flex-1">
                      <h4 className="text-[11px] font-bold text-slate-200 uppercase tracking-widest group-hover:text-white transition-colors">{action.label}</h4>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight mt-1">{action.desc}</p>
                   </div>
                   <ArrowUpRight size={14} className="text-slate-600 group-hover:text-[#19D2FF] transition-colors" />
                </Link>
              ))}
           </div>

           {/* Core Navigation Nodes (Secondary) */}
           <div className="admin-card p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.05]">
                 <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500">Management_Index</p>
                 <Link to="/admin/home" className="text-[9px] font-bold text-[#19D2FF] hover:text-white transition-colors uppercase tracking-widest">Configure Home</Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {[
                  { label: "About", to: "/admin/about", icon: UserCircle },
                  { label: "Contact", to: "/admin/contact", icon: Mail },
                  { label: "Account", to: "/admin/account", icon: Users },
                  { label: "SEO", to: "/admin/dashboard/seoMeta", icon: ExternalLink },
                ].map((node, i) => (
                  <Link key={i} to={node.to} className="flex flex-col items-center gap-3 group">
                    <div className="h-10 w-10 rounded-lg bg-[#0D1627] border border-white/[0.05] flex items-center justify-center text-slate-500 group-hover:text-[#19D2FF] group-hover:border-[#19D2FF]/30 transition-all">
                      <node.icon size={18} />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-300">{node.label}</span>
                  </Link>
                ))}
              </div>
           </div>
        </div>

        {/* 4. Recent Records (Activity) */}
        <div className="space-y-6">
           <div className="flex items-center gap-4 mb-2 border-b border-white/[0.05] pb-4">
              <History size={16} className="text-[#19D2FF]" />
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Sequential_Logs</h3>
           </div>

           <div className="admin-card p-6 space-y-6">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-4 relative group">
                  <div className={`mt-1.5 h-2 w-2 rounded-full ring-2 ring-[#0B1220] ${log.color.replace('text-', 'bg-')}`} />
                  <div className="flex-1 space-y-1 border-b border-white/[0.03] pb-4">
                    <div className="flex items-center justify-between">
                       <h4 className="text-[10px] font-bold text-slate-200 uppercase tracking-widest">{log.action}</h4>
                       <span className="text-[8px] font-bold text-slate-500 uppercase">{log.time}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium line-clamp-1">{log.details}</p>
                  </div>
                </div>
              ))}

              <button className="w-full pt-2 text-[9px] font-bold text-slate-500 hover:text-[#19D2FF] uppercase tracking-[0.3em] flex items-center justify-center gap-2 transition-colors">
                View All Activity
                <ArrowRight size={10} />
              </button>
           </div>
           
           {/* Studio Branding Card */}
           <div className="admin-card p-6 border-l-4 border-l-[#19D2FF] relative overflow-hidden bg-[#0D1627]">
              <div className="absolute -top-4 -right-4 p-2 opacity-[0.03]">
                 <ShieldCheck size={120} className="text-[#19D2FF]" />
              </div>
              <p className="text-[9px] font-black text-[#19D2FF] uppercase tracking-[0.5em] mb-2">Protocol_Active</p>
              <h4 className="text-lg font-black text-white uppercase tracking-widest">Secured Terminal</h4>
              <p className="text-[10px] text-slate-400 font-medium mt-2 leading-relaxed">
                Authorized access only. All structural commits are logged with precision timestamps.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
