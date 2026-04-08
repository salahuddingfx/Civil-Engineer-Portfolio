import { useState, useEffect } from "react";
import { MessageSquare, Star, Type, User, Quote, Trash2 } from "lucide-react";
import { adminList, adminUpdate, adminCreate, adminDelete } from "../../../lib/api";
import AdminModuleWrapper from "./AdminModuleWrapper";
import ImageUpload from "../../../components/admin/ImageUpload";

export default function AdminTestimonials() {
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    role: "",
    company: "",
    text: "",
    textBn: "",
    rating: 5,
    featuredImageUrl: "",
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const loadData = async () => {
    try {
      console.log("Fetching testimonial heritage...");
      const response = await adminList("testimonials", { limit: 100 });
      console.log("Testimonial Response:", response);
      const fetchedItems = response.items || [];
      setItems(fetchedItems);
      
      if (fetchedItems.length > 0 && !selectedId) {
        setSelectedId(fetchedItems[0]._id);
      }
    } catch (err) {
      console.error("TESTIMONIAL_LOAD_ERROR:", err);
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
          name: item.title?.en || "",
          role: item.summary?.en || "",
          company: item.category || "",
          text: item.body?.en || "",
          textBn: item.body?.bn || "",
          rating: item.rating || 5,
          featuredImageUrl: item.featuredImage?.url || "",
        });
      }
    } else {
      setForm({ name: "", role: "", company: "", text: "", textBn: "", rating: 5, featuredImageUrl: "" });
    }
  }, [selectedId, items]);

  const handleSave = async () => {
    setSaving(true);
    setStatus({ type: "", message: "" });
    const payload = {
      slug: (form.name || "client").toLowerCase().replace(/\s+/g, '-'),
      title: { en: form.name, bn: form.name },
      summary: { en: form.role, bn: form.role },
      category: form.company,
      body: { en: form.text, bn: form.textBn },
      rating: Number(form.rating),
      featuredImage: form.featuredImageUrl ? { url: form.featuredImageUrl } : null,
      isPublished: true,
    };

    try {
      if (selectedId) {
        await adminUpdate("testimonials", selectedId, payload);
      } else {
        await adminCreate("testimonials", payload);
      }
      setStatus({ type: "success", message: "SUCCESS: CLIENT HERITAGE UPDATED" });
      setSelectedId(null);
      await loadData();
    } catch (err) {
      setStatus({ type: "error", message: "COMMIT_FAILED" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("ERASE REVIEW: PERMANENT?")) return;
    setSaving(true);
    try {
      await adminDelete("testimonials", selectedId);
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
      title="Client Heritage"
      subtitle="Industry-standard feedback and professional client reviews."
      icon={MessageSquare}
      loading={loading}
      saving={saving}
      status={status}
      onSave={handleSave}
      onDelete={selectedId ? handleDelete : null}
      allowCreate={!!selectedId}
      onNew={() => setSelectedId(null)}
    >
      <div className="grid lg:grid-cols-[320px_1fr] gap-16">
        <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
          {items.map(item => (
            <div 
              key={item._id}
              onClick={() => setSelectedId(item._id)}
              className={`p-6 rounded-2xl border transition-all cursor-pointer ${selectedId === item._id ? 'border-cyan-400/40 bg-cyan-400/5 shadow-xl' : 'border-white/5 bg-white/1'}`}
            >
              <p className="text-sm font-bold text-white italic truncate">{item.title?.en || "Client Feedback"}</p>
              <p className="text-[10px] text-slate-700 font-black uppercase tracking-widest mt-2">{item.category}</p>
            </div>
          ))}
        </div>

        <div className="space-y-12">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 italic ml-2"><User size={12} className="text-cyan-400" /> Client Name</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-black/40 border-2 border-white/5 rounded-2xl px-6 py-5 text-white outline-none focus:border-cyan-400/40 font-bold italic" />
            </div>
            <div className="space-y-4">
               <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic ml-2">Company / Org</label>
               <input value={form.company} onChange={e => setForm({...form, company: e.target.value})} className="w-full bg-black/40 border-2 border-white/5 rounded-2xl px-6 py-5 text-white outline-none focus:border-cyan-400/40 font-bold italic" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic ml-2">Professional Role</label>
              <input value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full bg-black/40 border-2 border-white/5 rounded-2xl px-6 py-5 text-white outline-none focus:border-cyan-400/40 font-medium italic" />
            </div>
            <div className="space-y-4 text-left">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 italic ml-2"><Star size={12} className="text-yellow-500" /> Rating (1-5)</label>
              <input type="number" min="1" max="5" value={form.rating} onChange={e => setForm({...form, rating: e.target.value})} className="w-full bg-black/40 border-2 border-white/5 rounded-2xl px-6 py-5 text-white outline-none focus:border-cyan-400/40 font-mono" />
            </div>
          </div>

          <div className="space-y-4 text-left">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 italic ml-2"><Quote size={12} className="text-cyan-400" /> Endorsement Text (EN)</label>
            <textarea rows={4} value={form.text} onChange={e => setForm({...form, text: e.target.value})} className="w-full bg-black/40 border-2 border-white/5 rounded-[24px] px-8 py-6 text-white outline-none focus:border-cyan-400/40 italic font-medium" />
          </div>

          <div className="bg-white/2 border border-white/5 rounded-[40px] p-10">
             <ImageUpload value={form.featuredImageUrl} onChange={val => setForm({...form, featuredImageUrl: val})} label="Client Identity Avatar" />
          </div>
        </div>
      </div>
    </AdminModuleWrapper>
  );
}
