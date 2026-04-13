import { useState, useEffect } from "react";
import { Layers, MapPin, Calendar, Tag, Plus, Trash2, Edit3, Globe, Sparkles, Image as ImageIcon, CheckCircle2, Search } from "lucide-react";
import { adminList, adminUpdate, adminCreate, adminDelete } from "../../../lib/api";
import AdminModuleWrapper from "./AdminModuleWrapper";
import ImageUpload from "../../../components/admin/ImageUpload";
import AutoTranslate from "../../../components/admin/AutoTranslate";

export default function AdminProjects() {
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({
    slug: "",
    titleEn: "",
    titleBn: "",
    category: "Residential",
    summaryEn: "",
    summaryBn: "",
    bodyEn: "",
    bodyBn: "",
    location: "Cox's Bazar",
    year: "2024",
    featuredImageUrl: "",
    tags: "",
    isPublished: true,
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const loadData = async () => {
    try {
      const response = await adminList("projects", { limit: 100 });
      const fetchedItems = response.items || [];
      setItems(fetchedItems);
      if (fetchedItems.length > 0 && !selectedId) {
        setSelectedId(fetchedItems[0]._id);
      }
    } catch (err) {
      setStatus({ type: "error", message: "LOAD_FAILED: Check Infrastructure" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    if (selectedId) {
      const item = items.find(i => i._id === selectedId);
      if (item) {
        setForm({
          slug: item.slug || "",
          titleEn: item.title?.en || "",
          titleBn: item.title?.bn || "",
          category: item.category || "Residential",
          summaryEn: item.summary?.en || "",
          summaryBn: item.summary?.bn || "",
          bodyEn: item.body?.en || "",
          bodyBn: item.body?.bn || "",
          location: item.tags?.[1] || "Cox's Bazar",
          year: item.tags?.[0] || "2024",
          featuredImageUrl: item.featuredImage?.url || "",
          tags: Array.isArray(item.tags) ? item.tags.join(", ") : "",
          isPublished: item.isPublished ?? true,
        });
      }
    } else {
      setForm({
        slug: "", titleEn: "", titleBn: "", category: "Residential",
        summaryEn: "", summaryBn: "", bodyEn: "", bodyBn: "",
        location: "Cox's Bazar", year: "2024", featuredImageUrl: "",
        tags: "", isPublished: true,
      });
    }
  }, [selectedId, items]);

  const handleSave = async () => {
    setSaving(true);
    setStatus({ type: "", message: "" });
    const payload = {
      slug: selectedId ? form.slug : `${(form.slug || form.titleEn.toLowerCase().replace(/\s+/g, '-'))}-${Date.now()}`,
      title: { en: form.titleEn, bn: form.titleBn },
      summary: { en: form.summaryEn, bn: form.summaryBn },
      body: { en: form.bodyEn, bn: form.bodyBn },
      category: form.category,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      featuredImage: form.featuredImageUrl ? { url: form.featuredImageUrl } : null,
      isPublished: form.isPublished,
    };

    try {
      if (selectedId) {
        console.log(`[ADMIN_PROJECTS] Committing update to asset node: ${selectedId}`);
        await adminUpdate("projects", selectedId, payload);
      } else {
        console.log("[ADMIN_PROJECTS] Initializing new structural asset record...");
        await adminCreate("projects", payload);
      }
      
      setStatus({ type: "success", message: "PROJECT ASSET SYNCHRONIZED SUCCESSFULLY" });
    } catch (err) {
      console.error("[ADMIN_PROJECT_ERROR] Save Protocol Failure:", err);
      setStatus({ type: "error", message: "COMMIT FAILED: Protocol Error" });
    } finally { 
      setSaving(false); 
      await loadData();
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("DESTROY_ASSET_RECORD: CONFIRM_PERMANENT?")) return;
    setSaving(true);
    setStatus({ type: "", message: "" });
    try {
      console.log(`[ADMIN_PROJECTS] Purging asset from registry: ${selectedId}`);
      await adminDelete("projects", selectedId);
      setStatus({ type: "success", message: "ASSET PURGED FROM REGISTRY" });
    } catch (err) {
      console.error("[ADMIN_PROJECT_ERROR] Delete Protocol Failure:", err);
      setStatus({ type: "error", message: "PURGE_FAILURE" });
    } finally { 
      setSaving(false); 
      setSelectedId(null);
      await loadData();
    }
  };

  const filteredItems = items.filter(item => 
    item.title?.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inputClasses = "w-full bg-[var(--admin-card)] border border-[color:var(--admin-border)] rounded-2xl px-7 py-5 text-[color:var(--admin-text-heading)] outline-none focus:border-cyan-400/50 focus:bg-[var(--admin-card)] opacity-90 transition-all font-medium italic placeholder:text-[color:var(--admin-text-secondary)] shadow-inner text-sm";
  const labelClasses = "flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-[color:var(--admin-text-muted)] italic ml-4 mb-4";

  return (
    <AdminModuleWrapper
      title="Asset Registry"
      subtitle="Document and manage high-performance structural and architectural assets."
      icon={Layers}
      loading={loading}
      saving={saving}
      status={status}
      onSave={handleSave}
      onDelete={selectedId ? handleDelete : null}
      allowCreate={!!selectedId}
      onNew={() => setSelectedId(null)}
    >
      <div className="grid lg:grid-cols-[380px_1fr] gap-16">
        {/* List Sidebar */}
        <div className="space-y-8 flex flex-col">
          <div className="relative group">
             <Search size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-[color:var(--admin-text-muted)] group-focus-within:text-cyan-400 transition-colors" />
             <input 
               placeholder="Search Registry..." 
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
               className="w-full bg-[var(--admin-card)] border border-[color:var(--admin-border)] rounded-2xl pl-14 pr-6 py-5 text-[11px] font-bold uppercase tracking-widest text-[color:var(--admin-text-heading)] outline-none focus:border-cyan-400/40 transition-all"
             />
          </div>

          <div className="space-y-4 max-h-[800px] overflow-y-auto pr-4 custom-scrollbar">
            {filteredItems.map(item => (
              <div 
                key={item._id}
                onClick={() => setSelectedId(item._id)}
                className={`p-6 rounded-[32px] border transition-all duration-500 cursor-pointer group flex gap-5 relative overflow-hidden ${selectedId === item._id ? 'border-cyan-400/40 bg-cyan-400/[0.03]' : 'border-[color:var(--admin-border)] bg-[var(--admin-card)] opacity-90 hover:border-white/10 hover:bg-[var(--admin-card)] opacity-90'}`}
              >
                {selectedId === item._id && <div className="absolute left-0 top-0 w-1 h-full bg-sky-500" />}
                
                <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border border-[color:var(--admin-border)] shadow-xl transition-transform duration-500">
                  <img 
                    src={item.featuredImage?.url || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=100&q=40"} 
                    className={`w-full h-full object-cover transition-all duration-700 ${selectedId === item._id ? 'grayscale-0' : 'grayscale group-hover:grayscale-0 opacity-40 group-hover:opacity-100'}`}
                    alt=""
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[8px] font-black uppercase tracking-[0.2em] italic ${selectedId === item._id ? 'text-sky-600' : 'text-[color:var(--admin-text-label)]'}`}>{item.category}</span>
                    <div className={`h-2 w-2 rounded-full ${item.isPublished ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-slate-800'}`} />
                  </div>
                  <p className="text-sm font-black text-[color:var(--admin-text-heading)] italic truncate tracking-tight mb-2 uppercase">{item.title?.en || "Untitled Node"}</p>
                  <div className="flex items-center gap-3 text-[9px] text-[color:var(--admin-text-muted)] font-bold uppercase tracking-widest">
                    <MapPin size={10} className="text-cyan-400/40" />
                    <span className="truncate">{item.tags?.[1] || "Cox's Bazar"}</span>
                    <span className="text-[color:var(--admin-text-primary)]">•</span>
                    <span className="truncate">{item.tags?.[0] || "2024"}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 overflow-hidden">
                    <span className="text-[7px] font-black uppercase text-[color:var(--admin-text-secondary)] tracking-widest bg-[color:var(--admin-bg)] px-2 py-0.5 rounded truncate">SLUG: {item.slug}</span>
                    <span className="text-[7px] font-black uppercase text-emerald-500/40 tracking-widest bg-[color:var(--admin-bg)] px-2 py-0.5 rounded">SYNCED</span>
                  </div>
                </div>
              </div>
            ))}
            {!loading && filteredItems.length === 0 && (
               <div className="py-20 text-center space-y-4 opacity-20">
                  <Layers size={40} className="mx-auto text-[color:var(--admin-text-muted)]" />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[color:var(--admin-text-muted)] italic">No Registry Found</p>
               </div>
            )}
          </div>
        </div>

        {/* Editor Form */}
        <div className="space-y-16 animate-in fade-in slide-in-from-right-4 duration-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-[color:var(--admin-border)] pb-12">
            <div>
               <h3 className="text-3xl font-black text-[color:var(--admin-text-heading)] italic tracking-tighter uppercase mb-2">{selectedId ? "Configure Unit" : "Initialize New Record"}</h3>
               <p className="text-[10px] text-[color:var(--admin-text-muted)] font-bold uppercase tracking-widest italic">{selectedId ? `Refining Asset Hardware ID: ${selectedId}` : "Initializing Fresh Structural Asset"}</p>
            </div>
            
            <div className="flex items-center gap-6 px-8 py-4 bg-[color:var(--admin-bg)] border border-[color:var(--admin-border)] rounded-3xl">
               <span className="text-[9px] font-black text-[color:var(--admin-text-muted)] uppercase tracking-[0.3em] italic">Deployment Status</span>
               <label className="flex items-center cursor-pointer group scale-90">
                  <div className={`h-7 w-14 rounded-full transition-all duration-500 relative ${form.isPublished ? 'bg-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.3)]' : 'bg-slate-800'}`}>
                    <div className={`h-5 w-5 bg-[var(--admin-card)] rounded-full absolute top-1 transition-all duration-500 ${form.isPublished ? 'left-8' : 'left-1'}`} />
                  </div>
                  <input type="checkbox" checked={form.isPublished} onChange={e => setForm({...form, isPublished: e.target.checked})} className="hidden" />
               </label>
            </div>
          </div>

          {/* Title Nodes */}
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <div className="flex justify-between items-center px-4">
                <label className={labelClasses}><Edit3 size={12} className="text-blue-400" /> Identity Header (EN)</label>
                <AutoTranslate text={form.titleEn} onTranslate={val => setForm({...form, titleBn: val})} />
              </div>
              <input value={form.titleEn} onChange={e => setForm({...form, titleEn: e.target.value})} className={inputClasses} placeholder="Luxury Structural Node" />
            </div>
            <div className="space-y-2">
              <label className={labelClasses}>Identity Header (BN)</label>
              <input value={form.titleBn} onChange={e => setForm({...form, titleBn: e.target.value})} className={inputClasses} placeholder="বিলাসবহুল কাঠামো" />
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-2">
              <label className={labelClasses}><MapPin size={12} className="text-emerald-400" /> Location Node</label>
              <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className={inputClasses} placeholder="Cox's Bazar, BD" />
            </div>
            <div className="space-y-2">
              <label className={labelClasses}><Calendar size={12} className="text-violet-400" /> Completion Year</label>
              <input value={form.year} onChange={e => setForm({...form, year: e.target.value})} className={inputClasses} placeholder="2024" />
            </div>
            <div className="space-y-2">
              <label className={labelClasses}><Tag size={12} className="text-orange-400" /> Asset Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className={`${inputClasses} appearance-none cursor-pointer`}>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Hospitality">Hospitality</option>
                <option value="Infrastructure">Infrastructure</option>
              </select>
            </div>
          </div>

          {/* Abstract */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-4">
              <label className={labelClasses}><Globe size={12} className="text-sky-600" /> Technical Abstract (EN)</label>
              <AutoTranslate text={form.summaryEn} onTranslate={val => setForm({...form, summaryBn: val})} />
            </div>
            <textarea rows={3} value={form.summaryEn} onChange={e => setForm({...form, summaryEn: e.target.value})} className={`${inputClasses} resize-none`} placeholder="Brief technological overview of this asset..." />
          </div>

          {/* Visual Environment */}
          <div className="bg-[var(--admin-bg)] border border-[color:var(--admin-border)] rounded-[40px] p-10 relative overflow-hidden group/media shadow-inner">
             <div className="absolute top-0 right-0 h-1.5 w-60 bg-gradient-to-l from-cyan-400/20 to-transparent rounded-bl-full" />
             <div className="flex items-center gap-4 mb-10">
                <ImageIcon size={18} className="text-sky-600" />
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-[color:var(--admin-text-muted)] italic">Central Asset Media</h3>
             </div>
             <ImageUpload value={form.featuredImageUrl} onChange={val => setForm({...form, featuredImageUrl: val})} label="Primary High-Res Render" />
          </div>

          {/* Extended Content */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4 px-4">
               <label className={labelClasses}><Layers size={12} className="text-indigo-400" /> Detailed Specification Legacy (EN)</label>
               <AutoTranslate text={form.bodyEn} onTranslate={val => setForm({...form, bodyBn: val})} />
            </div>
            <textarea rows={8} value={form.bodyEn} onChange={e => setForm({...form, bodyEn: e.target.value})} className={`${inputClasses} font-mono text-[12px] leading-relaxed resize-none custom-scrollbar`} placeholder="## Technical Specifications\n- Floor Area: 5000sqft..." />
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4 px-4">
               <label className={labelClasses}><Layers size={12} className="text-indigo-400" /> Detailed Specification Legacy (BN)</label>
               <span className="text-[8px] font-black text-[color:var(--admin-text-secondary)] uppercase tracking-widest italic">Bengali Sync</span>
            </div>
            <textarea rows={8} value={form.bodyBn} onChange={e => setForm({...form, bodyBn: e.target.value})} className={`${inputClasses} font-mono text-[12px] leading-relaxed resize-none custom-scrollbar`} placeholder="## বিস্তারিত বিবরণ..." />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className={labelClasses}><Tag size={12} className="text-pink-400" /> Technical Tags (Comma Separated)</label>
            <input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} className={inputClasses} placeholder="Modern, Sustainable, High-Rise..." />
          </div>
        </div>
      </div>
    </AdminModuleWrapper>
  );
}
