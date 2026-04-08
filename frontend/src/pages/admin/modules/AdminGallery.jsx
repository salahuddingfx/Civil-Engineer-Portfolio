import { useState, useEffect } from "react";
import { Image as ImageIcon, Camera, Tag, Trash2, Plus, Type } from "lucide-react";
import { adminList, adminUpdate, adminCreate, adminDelete } from "../../../lib/api";
import AdminModuleWrapper from "./AdminModuleWrapper";
import ImageUpload from "../../../components/admin/ImageUpload";

export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
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
      setItems(response.items || []);
    } catch (err) {
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
      if (selectedId) {
        await adminUpdate("gallery", selectedId, payload);
      } else {
        await adminCreate("gallery", payload);
      }
      setStatus({ type: "success", message: "SUCCESS: VISUAL ARCHIVE SYNCHRONIZED" });
      setSelectedId(null);
      await loadData();
    } catch (err) {
      setStatus({ type: "error", message: "COMMIT_FAILED" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("DESTROY ASSET: PERMANENT?")) return;
    setSaving(true);
    try {
      await adminDelete("gallery", selectedId);
      setStatus({ type: "success", message: "SUCCESS: ASSET REMOVED" });
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
      <div className="grid lg:grid-cols-[300px_1fr] gap-16">
        <div className="grid grid-cols-2 gap-4 max-h-[700px] overflow-y-auto pr-4 custom-scrollbar">
          {items.map(item => (
            <div 
              key={item._id}
              onClick={() => setSelectedId(item._id)}
              className={`aspect-square rounded-2xl border-2 overflow-hidden cursor-pointer transition-all ${selectedId === item._id ? 'border-cyan-400 shadow-2xl scale-95' : 'border-white/5 opacity-50 hover:opacity-100'}`}
            >
              <img src={item.featuredImage?.url} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
          {!loading && items.length === 0 && <p className="col-span-2 text-[10px] text-center text-[#222] font-black uppercase tracking-widest py-10 italic">Empty Archive</p>}
        </div>

        <div className="space-y-12">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 italic ml-2"><Type size={12} className="text-cyan-400" /> Asset Meta Title</label>
              <input value={form.titleEn} onChange={e => setForm({...form, titleEn: e.target.value})} className="w-full bg-black/40 border-2 border-white/5 rounded-2xl px-6 py-5 text-white outline-none focus:border-cyan-400/40 font-bold italic" />
            </div>
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 italic ml-2"><Tag size={12} className="text-cyan-400" /> Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full bg-black/40 border-2 border-white/5 rounded-2xl px-6 py-5 text-white outline-none focus:border-cyan-400/40 font-bold italic">
                 <option value="Site Photo">Site Photo</option>
                 <option value="Architectural Render">Architectural Render</option>
                 <option value="Structural Detail">Structural Detail</option>
                 <option value="Certification">Certification</option>
              </select>
            </div>
          </div>

          <div className="bg-white/2 border border-white/5 rounded-[40px] p-10">
             <ImageUpload value={form.featuredImageUrl} onChange={val => setForm({...form, featuredImageUrl: val})} label="Structural Capture Output" />
          </div>

          <div className="space-y-4">
             <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic ml-2">Display Hierarchy (Order)</label>
             <input type="number" value={form.order} onChange={e => setForm({...form, order: e.target.value})} className="w-full bg-black/40 border-2 border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-cyan-400/40 italic font-mono" />
          </div>
        </div>
      </div>
    </AdminModuleWrapper>
  );
}
