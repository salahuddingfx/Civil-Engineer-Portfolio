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
        await adminUpdate("projects", selectedId, payload);
      } else {
        await adminCreate("projects", payload);
      }
      
      setStatus({ type: "success", message: "Project saved successfully!" });
    } catch (err) {
      console.error("[ADMIN_PROJECT_ERROR] Save Failure:", err);
      setStatus({ type: "error", message: "Failed to save project. Please try again." });
    } finally { 
      setSaving(false); 
      await loadData();
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this project permanently?")) return;
    setSaving(true);
    setStatus({ type: "", message: "" });
    try {
      await adminDelete("projects", selectedId);
      setStatus({ type: "success", message: "Project deleted successfully." });
    } catch (err) {
      console.error("[ADMIN_PROJECT_ERROR] Delete Failure:", err);
      setStatus({ type: "error", message: "Failed to delete project." });
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

  const inputClasses = "w-full bg-[var(--admin-card)] border border-[color:var(--admin-border)] rounded-2xl px-4 sm:px-7 py-4 sm:py-5 text-[color:var(--admin-text-heading)] outline-none focus:border-sky-500 focus:bg-[var(--admin-card)] transition-all font-medium placeholder:text-[color:var(--admin-text-secondary)] shadow-sm text-sm";
  const labelClasses = "flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-[color:var(--admin-text-muted)] ml-2 sm:ml-4 mb-2 sm:mb-4";

  return (
    <AdminModuleWrapper
      title="Project Portfolio"
      subtitle="Manage your engineering projects, construction sites, and portfolio case studies."
      icon={Layers}
      loading={loading}
      saving={saving}
      status={status}
      onSave={handleSave}
      onDelete={selectedId ? handleDelete : null}
      allowCreate={!!selectedId}
      onNew={() => setSelectedId(null)}
    >
      <div className="grid lg:grid-cols-[380px_1fr] gap-8 lg:gap-16">
        {/* List Sidebar */}
        <div className="space-y-6 flex flex-col">
          <div className="relative group">
             <Search size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-[color:var(--admin-text-muted)] group-focus-within:text-sky-500 transition-colors" />
              <input 
                placeholder="Search projects..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-[var(--admin-card)] border border-[color:var(--admin-border)] rounded-2xl pl-12 sm:pl-14 pr-4 sm:pr-6 py-4 text-[11px] font-bold uppercase tracking-widest text-[color:var(--admin-text-heading)] outline-none focus:border-sky-500 transition-all shadow-inner"
              />
          </div>

          <div className="flex flex-col gap-3 max-h-[800px] overflow-y-auto pr-4 admin-scrollbar">
            {filteredItems.map(item => (
              <div 
                key={item._id}
                onClick={() => setSelectedId(item._id)}
                className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer group flex gap-5 relative overflow-hidden ${selectedId === item._id ? 'border-sky-500 bg-sky-500/5 shadow-md' : 'border-[color:var(--admin-border)] bg-[var(--admin-card)] hover:border-sky-500/40'}`}
              >
                {selectedId === item._id && <div className="absolute left-0 top-0 w-1 h-full bg-sky-500" />}
                
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-[color:var(--admin-border)] bg-slate-800">
                  <img 
                    src={item.featuredImage?.url || "/images/project-fallback.png"} 
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[8px] font-black uppercase tracking-widest text-sky-500">{item.category}</span>
                    <div className={`h-2 w-2 rounded-full ${item.isPublished ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-slate-700'}`} />
                  </div>
                  <p className="text-[11px] font-black text-[color:var(--admin-text-heading)] truncate uppercase tracking-wider mb-1">{item.title?.en || "Untitled Project"}</p>
                  <div className="flex items-center gap-2 text-[9px] text-[color:var(--admin-text-muted)] font-bold uppercase">
                    <MapPin size={10} className="text-sky-500/50" />
                    <span className="truncate">{item.tags?.[1] || "Cox's Bazar"}</span>
                  </div>
                </div>
              </div>
            ))}
            {!loading && filteredItems.length === 0 && (
               <div className="py-20 text-center space-y-4 opacity-30">
                  <Layers size={32} className="mx-auto text-[color:var(--admin-text-muted)]" />
                  <p className="text-[9px] font-black uppercase tracking-widest">No projects found</p>
               </div>
            )}
          </div>
        </div>

        {/* Editor Form */}
        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[color:var(--admin-border)] pb-8">
            <div>
               <h3 className="text-2xl font-black text-[color:var(--admin-text-heading)] tracking-tight uppercase mb-1">{selectedId ? "Edit Project Details" : "Add New Project"}</h3>
               <p className="text-[10px] text-[color:var(--admin-text-muted)] font-bold uppercase tracking-widest">Update project information, photos, and descriptions</p>
            </div>
            
            <div className="flex items-center gap-6 px-6 py-3 bg-[color:var(--admin-bg)] border border-[color:var(--admin-border)] rounded-2xl">
               <span className="text-[9px] font-black text-[color:var(--admin-text-muted)] uppercase tracking-widest">Published</span>
               <label className="flex items-center cursor-pointer scale-90">
                  <div className={`h-6 w-12 rounded-full transition-all duration-300 relative ${form.isPublished ? 'bg-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.3)]' : 'bg-slate-700'}`}>
                    <div className={`h-4 w-4 bg-white rounded-full absolute top-1 transition-all duration-300 ${form.isPublished ? 'left-7' : 'left-1'}`} />
                  </div>
                  <input type="checkbox" checked={form.isPublished} onChange={e => setForm({...form, isPublished: e.target.checked})} className="hidden" />
               </label>
            </div>
          </div>

          {/* Title Nodes */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <div className="flex justify-between items-center px-4">
                <label className={labelClasses}><Edit3 size={12} className="text-sky-500" /> Project Title (EN)</label>
                <AutoTranslate text={form.titleEn} onTranslate={val => setForm({...form, titleBn: val})} />
              </div>
              <input value={form.titleEn} onChange={e => setForm({...form, titleEn: e.target.value})} className={inputClasses} placeholder="e.g. Modern Villa Design" />
            </div>
            <div className="space-y-2">
              <label className={labelClasses}>Project Title (BN)</label>
              <input value={form.titleBn} onChange={e => setForm({...form, titleBn: e.target.value})} className={inputClasses} placeholder="প্রজেক্টের নাম (বাংলায়)" />
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className={labelClasses}><MapPin size={12} className="text-sky-500" /> Project Location</label>
              <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className={inputClasses} placeholder="Cox's Bazar, BD" />
            </div>
            <div className="space-y-2">
              <label className={labelClasses}><Calendar size={12} className="text-sky-500" /> Year</label>
              <input value={form.year} onChange={e => setForm({...form, year: e.target.value})} className={inputClasses} placeholder="2024" />
            </div>
            <div className="space-y-2">
              <label className={labelClasses}><Tag size={12} className="text-sky-500" /> Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className={`${inputClasses} appearance-none cursor-pointer`}>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Hospitality">Hospitality</option>
                <option value="Infrastructure">Infrastructure</option>
              </select>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-4">
              <label className={labelClasses}><Globe size={12} className="text-sky-500" /> Short Summary (EN)</label>
              <AutoTranslate text={form.summaryEn} onTranslate={val => setForm({...form, summaryBn: val})} />
            </div>
            <textarea rows={3} value={form.summaryEn} onChange={e => setForm({...form, summaryEn: e.target.value})} className={`${inputClasses} resize-none`} placeholder="A brief summary for the project card..." />
          </div>

          {/* Media Module */}
          <div className="pt-4">
             <div className="bg-[var(--admin-bg)] border border-[color:var(--admin-border)] rounded-[32px] p-8 relative overflow-hidden group/media shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                   <ImageIcon size={18} className="text-sky-500" />
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-[color:var(--admin-text-muted)]">Featured Image</h3>
                </div>
                <ImageUpload value={form.featuredImageUrl} onChange={val => setForm({...form, featuredImageUrl: val})} label="Upload main project photo" />
             </div>
          </div>

          {/* Extended Content */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2 px-4">
               <label className={labelClasses}><Layers size={12} className="text-sky-500" /> Detailed Description (EN)</label>
               <AutoTranslate text={form.bodyEn} onTranslate={val => setForm({...form, bodyBn: val})} />
            </div>
            <textarea rows={8} value={form.bodyEn} onChange={e => setForm({...form, bodyEn: e.target.value})} className={`${inputClasses} font-mono text-[12px] leading-relaxed resize-none custom-scrollbar`} placeholder="Write full details about the project here..." />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className={labelClasses}><Tag size={12} className="text-sky-500" /> Keywords / Tags</label>
            <p className="text-[9px] text-[color:var(--admin-text-muted)] ml-4 mb-2 uppercase font-bold tracking-widest">Separate with commas (e.g. Modern, Construction)</p>
            <input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} className={inputClasses} placeholder="Modern, Sustainable, Bridge..." />
          </div>
        </div>
      </div>
    </AdminModuleWrapper>
  );
}
