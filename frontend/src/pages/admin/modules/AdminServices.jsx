import { useState, useEffect } from "react";
import { Briefcase, Settings, Edit3, Trash2, Plus, Type } from "lucide-react";
import { adminList, adminUpdate, adminCreate, adminDelete } from "../../../lib/api";
import AdminModuleWrapper from "./AdminModuleWrapper";

export default function AdminServices() {
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState({
    slug: "",
    titleEn: "",
    titleBn: "",
    summaryEn: "",
    summaryBn: "",
    icon: "Briefcase",
    isPublished: true,
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const loadData = async () => {
    try {
      console.log("Fetching service catalog...");
      const response = await adminList("services", { limit: 100 });
      console.log("Service Response:", response);
      const fetchedItems = response.items || [];
      setItems(fetchedItems);
      
      if (fetchedItems.length > 0 && !selectedId) {
        setSelectedId(fetchedItems[0]._id);
      }
    } catch (err) {
      console.error("SERVICE_LOAD_ERROR:", err);
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
          summaryEn: item.summary?.en || "",
          summaryBn: item.summary?.bn || "",
          icon: item.tags?.[0] || "Briefcase",
          isPublished: item.isPublished ?? true,
        });
      }
    } else {
      setForm({
         slug: "", titleEn: "", titleBn: "", summaryEn: "", summaryBn: "", icon: "Briefcase", isPublished: true
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
      tags: [form.icon],
      isPublished: form.isPublished,
    };

    try {
      if (selectedId) {
        await adminUpdate("services", selectedId, payload);
      } else {
        await adminCreate("services", payload);
      }
      setStatus({ type: "success", message: "SUCCESS: SERVICE CATALOG UPDATED" });
      setSelectedId(null);
      await loadData();
    } catch (err) {
      setStatus({ type: "error", message: "COMMIT_FAILED" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("ERASE SERVICE: PERMANENT?")) return;
    setSaving(true);
    try {
      await adminDelete("services", selectedId);
      setStatus({ type: "success", message: "SUCCESS: SERVICE REMOVED" });
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
      title="Service Catalog"
      subtitle="Configure engineering packages and architectural consultancy definitions."
      icon={Briefcase}
      loading={loading}
      saving={saving}
      status={status}
      onSave={handleSave}
      onDelete={selectedId ? handleDelete : null}
      allowCreate={!!selectedId}
      onNew={() => setSelectedId(null)}
    >
      <div className="grid lg:grid-cols-[300px_1fr] gap-16">
        <div className="space-y-6">
          {items.map(item => (
            <div 
              key={item._id}
              onClick={() => setSelectedId(item._id)}
              className={`p-6 rounded-2xl border transition-all cursor-pointer ${selectedId === item._id ? 'border-cyan-400/40 bg-cyan-400/5' : 'border-white/5 bg-white/1'}`}
            >
              <p className="text-sm font-bold text-white italic truncate">{item.title?.en || "Untitled Service"}</p>
            </div>
          ))}
        </div>

        <div className="space-y-12">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 italic ml-2"><Type size={12} className="text-cyan-400" /> Service Title (EN)</label>
              <input value={form.titleEn} onChange={e => setForm({...form, titleEn: e.target.value})} className="w-full bg-black/40 border-2 border-white/5 rounded-2xl px-6 py-5 text-white outline-none focus:border-cyan-400/40 font-bold italic" />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic ml-2">Service Title (BN)</label>
              <input value={form.titleBn} onChange={e => setForm({...form, titleBn: e.target.value})} className="w-full bg-black/40 border-2 border-white/5 rounded-2xl px-6 py-5 text-white outline-none focus:border-cyan-400/40 font-bold italic" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic ml-2">Capability Brief (EN)</label>
              <textarea rows={4} value={form.summaryEn} onChange={e => setForm({...form, summaryEn: e.target.value})} className="w-full bg-black/40 border-2 border-white/5 rounded-2xl px-6 py-5 text-white outline-none focus:border-cyan-400/40 italic" />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic ml-2">Capability Brief (BN)</label>
              <textarea rows={4} value={form.summaryBn} onChange={e => setForm({...form, summaryBn: e.target.value})} className="w-full bg-black/40 border-2 border-white/5 rounded-2xl px-6 py-5 text-white outline-none focus:border-cyan-400/40 italic" />
            </div>
          </div>

          <div className="space-y-4">
             <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic ml-2">Icon Type (Lucide Name)</label>
             <input value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} className="w-full bg-black/40 border-2 border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-cyan-400/40 italic font-mono" />
          </div>
        </div>
      </div>
    </AdminModuleWrapper>
  );
}
