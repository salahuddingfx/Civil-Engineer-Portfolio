import { useState, useEffect } from "react";
import { Layers, MapPin, Calendar, Tag, Plus, Trash2, Edit3, Globe } from "lucide-react";
import { adminList, adminUpdate, adminCreate, adminDelete } from "../../../lib/api";
import AdminModuleWrapper from "./AdminModuleWrapper";
import ImageUpload from "../../../components/admin/ImageUpload";

export default function AdminProjects() {
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
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
      console.log("Fetching project registry...");
      const response = await adminList("projects", { limit: 100 });
      console.log("Registry Response:", response);
      const fetchedItems = response.items || [];
      setItems(fetchedItems);
      
      // Auto-select first item if exists and none selected
      if (fetchedItems.length > 0 && !selectedId) {
        setSelectedId(fetchedItems[0]._id);
      }
    } catch (err) {
      console.error("LOAD_ERROR:", err);
      setStatus({ type: "error", message: "LOAD_FAILED" });
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
    }
  }, [selectedId, items]);

  const handleSave = async () => {
    setSaving(true);
    setStatus({ type: "", message: "" });
    const payload = {
      slug: form.slug || form.titleEn.toLowerCase().replace(/\s+/g, '-'),
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
      setStatus({ type: "success", message: "SUCCESS: PROJECT REGISTRY UPDATED" });
      setSelectedId(null);
      await loadData();
    } catch (err) {
      setStatus({ type: "error", message: "COMMIT_FAILED" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("DESTROY RECORD: PERMANENT?")) return;
    setSaving(true);
    try {
      await adminDelete("projects", selectedId);
      setStatus({ type: "success", message: "SUCCESS: RECORD REMOVED" });
      setSelectedId(null);
      await loadData();
    } catch (err) {
      setStatus({ type: "error", message: "ERASE_FAILED" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminModuleWrapper
      title="Project Registry"
      subtitle="Document high-performance architectural and structural assets."
      icon={Layers}
      loading={loading}
      saving={saving}
      status={status}
      onSave={handleSave}
      onDelete={selectedId ? handleDelete : null}
      allowCreate={!!selectedId}
      onNew={() => setSelectedId(null)}
    >
      <div className="grid lg:grid-cols-[300px_1fr] gap-16">
        {/* List Sidebar */}
        <div className="space-y-6 max-h-[700px] overflow-y-auto pr-4 custom-scrollbar">
          {items.map(item => (
            <div 
              key={item._id}
              onClick={() => setSelectedId(item._id)}
              className={`p-6 rounded-2xl border transition-all cursor-pointer group ${selectedId === item._id ? 'border-cyan-400/40 bg-cyan-400/5' : 'border-white/5 bg-white/1 hover:border-white/10'}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] font-black uppercase tracking-widest text-cyan-400/60 italic">{item.category}</span>
                {item.isPublished && <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />}
              </div>
              <p className="text-sm font-bold text-white italic truncate">{item.title?.en || "Untitled Asset"}</p>
            </div>
          ))}
          {!loading && items.length === 0 && <p className="text-[10px] text-center text-[#222] font-black uppercase tracking-widest py-10">No Assets Registry</p>}
        </div>

        {/* Editor Form */}
        <div className="space-y-12">
          <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-8">
            <h3 className="text-2xl font-black text-white italic tracking-tight">{selectedId ? "Configure Unit" : "Initialize New Record"}</h3>
            <div className="flex items-center gap-4">
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">Live Status</span>
               <label className="flex items-center cursor-pointer group">
                  <div className={`h-6 w-12 rounded-full transition-all duration-300 ${form.isPublished ? 'bg-cyan-500' : 'bg-slate-800'}`}>
                    <div className={`h-4 w-4 bg-white rounded-full mt-1 ml-1 transition-all ${form.isPublished ? 'translate-x-6' : ''}`} />
                  </div>
                  <input type="checkbox" checked={form.isPublished} onChange={e => setForm({...form, isPublished: e.target.checked})} className="hidden" />
               </label>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 italic ml-2"><Edit3 size={12} className="text-cyan-400" /> Title (EN)</label>
              <input value={form.titleEn} onChange={e => setForm({...form, titleEn: e.target.value})} className="w-full bg-black/40 border-2 border-white/5 rounded-2xl px-6 py-5 text-white outline-none focus:border-cyan-400/40 font-bold italic" />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic ml-2">Title (BN)</label>
              <input value={form.titleBn} onChange={e => setForm({...form, titleBn: e.target.value})} className="w-full bg-black/40 border-2 border-white/5 rounded-2xl px-6 py-5 text-white outline-none focus:border-cyan-400/40 font-bold italic" />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 italic ml-2"><MapPin size={12} className="text-cyan-400" /> Location</label>
              <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full bg-black/40 border-2 border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-cyan-400/40 italic" />
            </div>
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 italic ml-2"><Calendar size={12} className="text-cyan-400" /> Year</label>
              <input value={form.year} onChange={e => setForm({...form, year: e.target.value})} className="w-full bg-black/40 border-2 border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-cyan-400/40 italic" />
            </div>
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 italic ml-2"><Tag size={12} className="text-cyan-400" /> Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full bg-black/40 border-2 border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-cyan-400/40 italic">
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Hospitality">Hospitality</option>
                <option value="Infrastructure">Infrastructure</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 italic ml-2"><Globe size={12} className="text-cyan-400" /> Technical Abstract (EN)</label>
            <textarea rows={3} value={form.summaryEn} onChange={e => setForm({...form, summaryEn: e.target.value})} className="w-full bg-black/40 border-2 border-white/5 rounded-2xl px-6 py-5 text-white outline-none focus:border-cyan-400/40 font-medium italic" />
          </div>

          <div className="bg-white/2 border border-white/5 rounded-[40px] p-10">
             <ImageUpload value={form.featuredImageUrl} onChange={val => setForm({...form, featuredImageUrl: val})} label="Central Project Media" />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic ml-2">Legacy Body (markdown allowed)</label>
            <textarea rows={10} value={form.bodyEn} onChange={e => setForm({...form, bodyEn: e.target.value})} className="w-full bg-black/40 border-2 border-white/5 rounded-[32px] px-8 py-7 text-white outline-none focus:border-cyan-400/40 custom-scrollbar font-mono text-sm leading-relaxed" />
          </div>
        </div>
      </div>
    </AdminModuleWrapper>
  );
}
