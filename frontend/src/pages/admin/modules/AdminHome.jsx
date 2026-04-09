import { useState, useEffect } from "react";
import { Home, Type, AlignLeft, Image as ImageIcon, Sparkles } from "lucide-react";
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
        setStatus({ type: "error", message: "LOAD_FAILED: Check Infrastructure" });
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
      isPublished: true,
    };

    try {
      if (recordId) {
        await adminUpdate("home", recordId, payload);
      } else {
        const res = await adminCreate("home", payload);
        setRecordId(res._id);
      }
      setStatus({ type: "success", message: "HOME VISION SYNCHRONIZED SUCCESSFULLY" });
    } catch (err) {
      setStatus({ type: "error", message: "COMMIT FAILED: Protocol Error" });
    } finally {
      setSaving(false);
    }
  };

  const inputClasses = "w-full bg-white border border-slate-200 rounded-2xl px-8 py-6 text-slate-900 outline-none focus:border-cyan-400/50 focus:bg-white/[0.05] transition-all font-medium italic placeholder:text-slate-700 shadow-inner";
  const labelClasses = "flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic ml-4 mb-4";

  return (
    <AdminModuleWrapper
      title="Landing Vision"
      subtitle="Configure global hero typography and architectural brand standards."
      icon={Home}
      loading={loading}
      saving={saving}
      status={status}
      onSave={handleSave}
    >
      <div className="space-y-16">
        {/* Title Infrastructure */}
        <section>
           <div className="flex items-center gap-4 mb-10">
              <Sparkles size={16} className="text-sky-600" />
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-sky-500">Hero Typography System</h3>
           </div>
           
           <div className="grid md:grid-cols-2 gap-10">
             <div className="space-y-2">
               <label className={labelClasses}>
                 <Type size={12} className="text-blue-400" /> Identity Header (EN)
               </label>
               <input 
                 value={form.titleEn} 
                 onChange={e => setForm({...form, titleEn: e.target.value})}
                 className={inputClasses} 
                 placeholder="I Build Structural Foundations"
               />
             </div>
             <div className="space-y-2">
               <label className={labelClasses}>Identity Header (BN)</label>
               <input 
                 value={form.titleBn} 
                 onChange={e => setForm({...form, titleBn: e.target.value})}
                 className={inputClasses} 
                 placeholder="আমি কাঠামোগত ভিত্তি তৈরি করি"
               />
             </div>
           </div>
        </section>

        {/* Subtitle Nodes */}
        <section>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-2">
              <label className={labelClasses}>
                <AlignLeft size={12} className="text-indigo-400" /> Strategic Subtitle (EN)
              </label>
              <textarea 
                rows={4}
                value={form.summaryEn} 
                onChange={e => setForm({...form, summaryEn: e.target.value})}
                className={`${inputClasses} resize-none`} 
                placeholder="Professional Civil Engineer & Architectural Designer..."
              />
            </div>
            <div className="space-y-2">
              <label className={labelClasses}>Strategic Subtitle (BN)</label>
              <textarea 
                rows={4}
                value={form.summaryBn} 
                onChange={e => setForm({...form, summaryBn: e.target.value})}
                className={`${inputClasses} resize-none`} 
                placeholder="পেশাদার সিভিল ইঞ্জিনিয়ার..."
              />
            </div>
          </div>
        </section>

        {/* Visual Assets */}
        <section className="pt-8">
           <div className="bg-slate-50 border border-slate-200 rounded-[48px] p-12 relative overflow-hidden">
              <div className="absolute top-0 right-10 h-1 w-20 bg-cyan-400/40" />
              <div className="flex items-center gap-4 mb-10">
                 <ImageIcon size={16} className="text-sky-600" />
                 <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 italic">High Fidelity Renders</h3>
              </div>
              <ImageUpload 
                value={form.featuredImageUrl}
                onChange={val => setForm({...form, featuredImageUrl: val})}
                label="Primary Hero Visualization"
              />
           </div>
        </section>
      </div>
    </AdminModuleWrapper>
  );
}
