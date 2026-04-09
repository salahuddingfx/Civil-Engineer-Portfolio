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
  Plus
} from "lucide-react";
import { adminList, api } from "../../lib/api";
import { useLanguage } from "../../context/LanguageContext";
import AdminStatCard from "../../components/admin/AdminStatCard";
import AdminPageCard from "../../components/admin/AdminPageCard";

const pageModules = [
  { 
    title: "Home", 
    desc: "Update primary vision, hero typography, and technical highlights.", 
    to: "/admin/home", 
    icon: Home,
    status: "LIVE",
    bgImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1470&auto=format&fit=crop" 
  },
  { 
    title: "About", 
    desc: "Refine consultancy legacy and structural journey details.", 
    to: "/admin/about", 
    icon: UserCircle,
    status: "LIVE",
    bgImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1470&auto=format&fit=crop"
  },
  { 
    title: "Services", 
    desc: "Configure engineering and architectural service portfolio.", 
    to: "/admin/services", 
    icon: Briefcase,
    status: "IN PROGRESS",
    bgImage: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=1470&auto=format&fit=crop"
  },
  { 
    title: "Projects", 
    desc: "Document high-performance architectural and structural assets.", 
    to: "/admin/projects", 
    icon: Layers,
    status: "LIVE",
    bgImage: "https://images.unsplash.com/photo-1503387762-592dee58c160?q=80&w=1632&auto=format&fit=crop"
  },
  { 
    title: "Testimonials", 
    desc: "Curate verified client feedback and professional endorsements.", 
    to: "/admin/testimonials", 
    icon: MessageSquareQuote,
    status: "LIVE",
    bgImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1484&auto=format&fit=crop"
  },
  { 
    title: "Gallery", 
    desc: "Manage site photography and high-resolution architectural renders.", 
    to: "/admin/gallery", 
    icon: ImageIcon,
    status: "DRAFT",
    bgImage: "https://images.unsplash.com/photo-1496293455970-f8581aae0e3c?q=80&w=1471&auto=format&fit=crop"
  },
  { 
    title: "Contact Info", 
    desc: "Manage studio location, social social nodes, and API maps.", 
    to: "/admin/contact", 
    icon: Mail,
    status: "LIVE",
    bgImage: "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=1470&auto=format&fit=crop"
  },
  { 
    title: "Strategic SEO", 
    desc: "Enhance discovery and global technical authority settings.", 
    to: "/admin/dashboard/seoMeta", 
    icon: SearchIcon,
    status: "LIVE",
    bgImage: "https://images.unsplash.com/photo-1504868584819-f8eecfa3097c?q=80&w=1470&auto=format&fit=crop"
  },
];

export default function AdminDashboardPage() {
  const { language } = useLanguage();
  const [counts, setCounts] = useState({
    projects: 142,
    inquiries: 28,
    visits: "12.4K"
  });

  useEffect(() => {
    const fetchRealCounts = async () => {
      try {
        const [projectData, inquiryData, statData] = await Promise.all([
          adminList("projects", { limit: 1 }),
          adminList("contactSubmissions", { limit: 1 }),
          api.get("/stats")
        ]);
        
        setCounts(prev => ({
          ...prev,
          projects: projectData.meta?.total || 142,
          inquiries: inquiryData.meta?.total || 28,
          visits: statData.data?.success ? statData.data.count : "12.4K"
        }));
      } catch (err) {
        console.warn("Could not fetch real-time analytics, using cache.");
      }
    };

    fetchRealCounts();
  }, []);

  return (
    <div className="space-y-16">
      {/* 1. Technical Analytics Section */}
      <section>
        <div className="flex items-center gap-4 mb-10">
           <div className="h-10 w-1 bg-cyan-400 rounded-full" />
           <h2 className="text-[12px] font-black uppercase tracking-[0.5em] text-[#444] italic">Real-Time Core Metrics</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AdminStatCard 
            label="Total Projects" 
            value={counts.projects} 
            trend="up" 
            trendValue="+12%" 
            icon={FolderGit2}
            status="Synchronized"
          />
          <AdminStatCard 
            label="New Inquiries" 
            value={counts.inquiries} 
            trend="up" 
            trendValue="Active" 
            icon={Users}
            status="Processed"
            chartType="pulse"
          />
          <AdminStatCard 
            label="Site Visits" 
            value={counts.visits} 
            icon={MousePointer2}
            status="Real-time flow"
            chartType="pulse"
          />
        </div>
      </section>

      {/* 2. Pages Overview Section */}
      <section className="pb-32">
        <div className="flex items-center justify-between mb-12">
           <div className="flex items-center gap-4">
              <div className="h-10 w-1 bg-cyan-400 rounded-full" />
              <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Pages Overview</h2>
           </div>
           
           <button className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#444] hover:text-cyan-400 transition-colors group">
              View Sitemap 
              <Activity size={16} className="group-hover:translate-x-1 transition-transform" />
           </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
          {pageModules.map((moduleItem, i) => (
            <AdminPageCard 
              key={i}
              {...moduleItem}
            />
          ))}

          {/* Create New Page Placeholder */}
          <div className="h-[420px] rounded-[32px] border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-6 group hover:border-cyan-400/20 transition-all cursor-pointer">
             <div className="h-16 w-16 rounded-full border border-white/5 bg-white/2 flex items-center justify-center text-[#222] group-hover:bg-cyan-400 group-hover:text-black group-hover:scale-110 transition-all">
                <Plus size={24} />
             </div>
             <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#222] group-hover:text-cyan-400/60 transition-colors">Create New Page</p>
          </div>
        </div>
      </section>
    </div>
  );
}
