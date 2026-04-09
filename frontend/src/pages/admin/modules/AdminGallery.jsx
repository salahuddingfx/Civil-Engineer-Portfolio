import { useState, useEffect } from "react";
import { Image as ImageIcon, Camera, Tag, Trash2, Plus, Type, Sparkles, Layers, Grid3X3, Search } from "lucide-react";
import { adminList, adminUpdate, adminCreate, adminDelete } from "../../../lib/api";
import AdminModuleWrapper from "./AdminModuleWrapper";
import ImageUpload from "../../../components/admin/ImageUpload";

export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({
    slug: "",
    titleEn: "",
    category: "Site Photo",
    featuredImageUrl: "",
    order: 0,
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const loadData = async () => {
    try {
      const response = await adminList("gallery", { limit: 100 });
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
          category: item.category || "Site Photo",
          featuredImageUrl: item.featuredImage?.url || "",
          order: item.order || 0,
        });
      }
    } else {
      setForm({ slug: "", titleEn: "", category: "Site Photo", featuredImageUrl: "", order: 0 });
    }
  }, [selectedId, items]);

  const handleSave = async () => {
    setSaving(true);
    setStatus({ type: "", message: "" });
    const payload = {
      slug: form.slug || `img-${Date.now()}`,
      title: { en: form.titleEn, bn: form.titleEn },
      category: form.category,
      featuredImage: form.featuredImageUrl ? { url: form.featuredImageUrl } : null,
      order: Number(form.order),
      isPublished: true,
    };

    try {
      if (selectedId) await adminUpdate("gallery", selectedId, payload);
      else await adminCreate("gallery", payload);
      setStatus({ type: "success", message: "VISUAL_ASSET_SYNCHRONIZED_SUCCESSFULLY" });
      if (!selectedId) setSelectedId(null);
      await loadData();
    } catch (err) {
      setStatus({ type: "error", message: "COMMIT_FAILED: Protocol Error" });
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm("DESTROY_VISUAL_ASSET: CONFIRM_PERMANENT?")) return;
    setSaving(true);
    try {
      await adminDelete("gallery", selectedId);
      setStatus({ type: "success", message: "ASSET_PURGED_FROM_ARCHIVE" });
      setSelectedId(null);
      await loadData();
    } catch (err) {
      setStatus({ type: "error", message: "PURGE_FAILURE" });
    } finally { setSaving(false); }
  };

  const filteredItems = items.filter(item => 
    item.title?.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inputClasses = "w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl px-7 py-5 text-white outline-none focus:border-cyan-400/50 focus:bg-white/[0.05] transition-all font-medium italic placeholder:text-slate-700 shadow-inner text-sm";
  const labelClasses = "flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic ml-4 mb-4";

  return (
    <AdminModuleWrapper
      title="Visual Archive"
      subtitle="Structural renders and project photography laboratory."
      icon={ImageIcon}
      loading={loading}
      saving={saving}
      status={status}
      onSave={handleSave}
      onDelete={selectedId ? handleDelete : null}
      allowCreate={!!selectedId}
      onNew={() => setSelectedId(null)}
    >
      <div className="grid lg:grid-cols-[450px_1fr] gap-16">
        {/* Gallery Grid Sidebar */}
        <div className="space-y-8 flex flex-col">
          <div className="relative group">
             <Search size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
             <input 
               placeholder="Search Archive..." 
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
               className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl pl-14 pr-6 py-5 text-[11px] font-bold uppercase tracking-widest text-white outline-none focus:border-cyan-400/40 transition-all"
             />
          </div>

          <div className="grid grid-cols-2 gap-6 max-h-[800px] overflow-y-auto pr-4 custom-scrollbar">
            {filteredItems.map(item => (
              <div 
                key={item._id}
                onClick={() => setSelectedId(item._id)}
                className={`group aspect-square rounded-[32px] border-4 overflow-hidden cursor-pointer transition-all duration-500 relative ${selectedId === item._id ? 'border-cyan-400 shadow-2xl ring-8 ring-cyan-400/10' : 'border-white/[0.05] opacity-40 hover:opacity-100 hover:border-white/20'}`}
              >
                <img src={item.featuredImage?.url} alt="" className="w-full h-full object-cover transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                   <p className="text-[8px] font-black uppercase tracking-widest text-cyan-400 italic mb-1">{item.category}</p>
                   <p className="text-[10px] text-white font-bold truncate italic">{item.title?.en || "Untitled_Asset"}</p>
                </div>
              </div>
            ))}
            {!loading && filteredItems.length === 0 && (
               <div className="col-span-2 py-20 text-center space-y-4 opacity-20">
                  <Grid3X3 size={40} className="mx-auto text-slate-500" />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">Empty Archive</p>
               </div>
            )}
          </div>
        </div>

        {/* Editor Form */}
        <div className="space-y-16 animate-in fade-in slide-in-from-right-4 duration-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-white/[0.05] pb-12">
            <div>
               <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">{selectedId ? "Configure Asset" : "Register Visual"}</h3>
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">{selectedId ? `Refining Visual Node Hardware ID: ${selectedId}` : "Initializing Fresh Structural Asset"}</p>
            </div>
            
            <div className="flex items-center gap-4 px-6 py-3 bg-cyan-400/5 border border-cyan-400/10 rounded-2xl">
               <Layers size={14} className="text-cyan-400" />
               <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest italic">Asset_Live_Node</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-2">
              <label className={labelClasses}><Type size={12} className="text-blue-400" /> Meta Identity Header</label>
              <input value={form.titleEn} onChange={e => setForm({...form, titleEn: e.target.value})} className={inputClasses} placeholder="Structural Foundation Detail" />
            </div>
            <div className="space-y-2">
              <label className={labelClasses}><Tag size={12} className="text-cyan-400" /> Technical category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className={`${inputClasses} appearance-none cursor-pointer`}>
                 <option value="Site Photo">Site Photo</option>
                 <option value="Architectural Render">Architectural Render</option>
                 <option value="Structural Detail">Structural Detail</option>
                 <option value="Certification">Certification</option>
              </select>
            </div>
          </div>

          {/* Media Module */}
          <div className="pt-8">
             <div className="bg-[#0d0f1a]/40 border border-white/[0.07] rounded-[48px] p-12 relative overflow-hidden group/media">
                <div className="absolute top-0 right-0 h-1.5 w-60 bg-gradient-to-l from-cyan-400/20 to-transparent rounded-bl-full" />
                <div className="flex items-center gap-4 mb-10">
                   <Camera size={18} className="text-cyan-400" />
                   <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 italic">Visual_Sensor_Output</h3>
                </div>
                <ImageUpload value={form.featuredImageUrl} onChange={val => setForm({...form, featuredImageUrl: val})} label="Structural Capture Output" />
             </div>
          </div>

          {/* Hierarchy */}
          <div className="space-y-2 max-w-xs">
             <label className={labelClasses}><Sparkles size={12} className="text-yellow-400" /> Display Hierarchy (Order)</label>
             <input type="number" value={form.order} onChange={e => setForm({...form, order: e.target.value})} className={inputClasses} />
          </div>
        </div>
      </div>
    </AdminModuleWrapper>
  );
}
