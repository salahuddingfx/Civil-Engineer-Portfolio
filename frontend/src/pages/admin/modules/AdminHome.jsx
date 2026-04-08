import { useState, useEffect } from "react";
import { Home, Layout, Type, AlignLeft } from "lucide-react";
import { adminList, adminUpdate, adminCreate } from "../../../lib/api";
import AdminModuleWrapper from "./AdminModuleWrapper";
import ImageUpload from "../../../components/admin/ImageUpload";

export default function AdminHome() {
  const [form, setForm] = useState({
    titleEn: "",
    titleBn: "",
    summaryEn: "",
    summaryBn: "",
    bodyEn: "",
    bodyBn: "",
    featuredImageUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [recordId, setRecordId] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await adminList("home", { limit: 1 });
        const item = response.items?.[0];
        if (item) {
          setRecordId(item._id);
          setForm({
            titleEn: item.title?.en || "",
            titleBn: item.title?.bn || "",
            summaryEn: item.summary?.en || "",
            summaryBn: item.summary?.bn || "",
            bodyEn: item.body?.en || "",
            bodyBn: item.body?.bn || "",
            featuredImageUrl: item.featuredImage?.url || "",
          });
        }
      } catch (err) {
        setStatus({ type: "error", message: "LOAD_FAILED: Check Connection" });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setStatus({ type: "", message: "" });
    const payload = {
      slug: "home",
      title: { en: form.titleEn, bn: form.titleBn },
      summary: { en: form.summaryEn, bn: form.summaryBn },
      body: { en: form.bodyEn, bn: form.bodyBn },
      featuredImage: form.featuredImageUrl ? { url: form.featuredImageUrl } : null,
    };

    try {
      if (recordId) {
        await adminUpdate("home", recordId, payload);
      } else {
        const res = await adminCreate("home", payload);
        setRecordId(res._id);
      }
      setStatus({ type: "success", message: "SUCCESS: HOME ARCHITECTURE UPDATED" });
    } catch (err) {
      setStatus({ type: "error", message: "COMMIT_FAILED: Server Error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminModuleWrapper
      title="Landing Architecture"
      subtitle="Configure global hero typography and initial brand standards."
      icon={Home}
      loading={loading}
      saving={saving}
      status={status}
      onSave={handleSave}
    >
      <div className="space-y-12">
        {/* Title Section */}
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 italic ml-2">
              <Type size={12} className="text-cyan-400" /> Hero Title (EN)
            </label>
            <input 
              value={form.titleEn} 
              onChange={e => setForm({...form, titleEn: e.target.value})}
              className="w-full bg-black/40 border-2 border-white/5 rounded-2xl px-6 py-5 text-white outline-none focus:border-cyan-400/40 font-bold text-lg italic shadow-inner" 
              placeholder="I Build Structural Foundations"
            />
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic ml-2">Hero Title (BN)</label>
            <input 
              value={form.titleBn} 
              onChange={e => setForm({...form, titleBn: e.target.value})}
              className="w-full bg-black/40 border-2 border-white/5 rounded-2xl px-6 py-5 text-white outline-none focus:border-cyan-400/40 font-bold text-lg italic" 
              placeholder="আমি কাঠামোগত ভিত্তি তৈরি করি"
            />
          </div>
        </div>

        {/* Subtitle Section */}
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 italic ml-2">
              <AlignLeft size={12} className="text-cyan-400" /> Professional Subtitle (EN)
            </label>
            <textarea 
              rows={3}
              value={form.summaryEn} 
              onChange={e => setForm({...form, summaryEn: e.target.value})}
              className="w-full bg-black/40 border-2 border-white/5 rounded-2xl px-6 py-5 text-white outline-none focus:border-cyan-400/40 font-medium italic" 
            />
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic ml-2">Professional Subtitle (BN)</label>
            <textarea 
              rows={3}
              value={form.summaryBn} 
              onChange={e => setForm({...form, summaryBn: e.target.value})}
              className="w-full bg-black/40 border-2 border-white/5 rounded-2xl px-6 py-5 text-white outline-none focus:border-cyan-400/40 font-medium italic" 
            />
          </div>
        </div>

        {/* Media Block */}
        <div className="pt-8">
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400/60 mb-6 italic ml-2">Architectural Visual Environment</p>
           <div className="bg-white/2 border border-white/5 rounded-[32px] p-8 md:p-12">
              <ImageUpload 
                value={form.featuredImageUrl}
                onChange={val => setForm({...form, featuredImageUrl: val})}
                label="Primary Hero Renders"
              />
           </div>
        </div>
      </div>
    </AdminModuleWrapper>
  );
}
