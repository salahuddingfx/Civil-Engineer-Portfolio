import { useState, useEffect } from "react";
import { UserCircle, PenTool, Award, Users } from "lucide-react";
import { adminList, adminUpdate, adminCreate } from "../../../lib/api";
import AdminModuleWrapper from "./AdminModuleWrapper";
import ImageUpload from "../../../components/admin/ImageUpload";

export default function AdminAbout() {
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
        const response = await adminList("about", { limit: 1 });
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
        setStatus({ type: "error", message: "LOAD_FAILED" });
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
      slug: "about",
      title: { en: form.titleEn, bn: form.titleBn },
      summary: { en: form.summaryEn, bn: form.summaryBn },
      body: { en: form.bodyEn, bn: form.bodyBn },
      featuredImage: form.featuredImageUrl ? { url: form.featuredImageUrl } : null,
    };

    try {
      if (recordId) {
        await adminUpdate("about", recordId, payload);
      } else {
        const res = await adminCreate("about", payload);
        setRecordId(res._id);
      }
      setStatus({ type: "success", message: "SUCCESS: ABOUT PROFILE SYNCHRONIZED" });
    } catch (err) {
      setStatus({ type: "error", message: "COMMIT_FAILED" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminModuleWrapper
      title="Professional Profile"
      subtitle="Refine consultancy legacy and structural journey details."
      icon={UserCircle}
      loading={loading}
      saving={saving}
      status={status}
      onSave={handleSave}
    >
      <div className="space-y-12">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 italic ml-2">
              <PenTool size={12} className="text-cyan-400" /> Identity Label (EN)
            </label>
            <input value={form.titleEn} onChange={e => setForm({...form, titleEn: e.target.value})} className="w-full bg-black/40 border-2 border-white/5 rounded-2xl px-6 py-5 text-white outline-none focus:border-cyan-400/40 font-bold italic shadow-inner" />
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic ml-2">Identity Label (BN)</label>
            <input value={form.titleBn} onChange={e => setForm({...form, titleBn: e.target.value})} className="w-full bg-black/40 border-2 border-white/5 rounded-2xl px-6 py-5 text-white outline-none focus:border-cyan-400/40 font-bold italic" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 italic ml-2">
              <Award size={12} className="text-cyan-400" /> Role Summary (EN)
            </label>
            <input value={form.summaryEn} onChange={e => setForm({...form, summaryEn: e.target.value})} className="w-full bg-black/40 border-2 border-white/5 rounded-2xl px-6 py-5 text-white outline-none focus:border-cyan-400/40 font-medium italic shadow-inner" />
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic ml-2">Role Summary (BN)</label>
            <input value={form.summaryBn} onChange={e => setForm({...form, summaryBn: e.target.value})} className="w-full bg-black/40 border-2 border-white/5 rounded-2xl px-6 py-5 text-white outline-none focus:border-cyan-400/40 font-medium italic" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 italic ml-2">
              <Users size={12} className="text-cyan-400" /> Technical Biography (EN)
            </label>
            <textarea rows={8} value={form.bodyEn} onChange={e => setForm({...form, bodyEn: e.target.value})} className="w-full bg-black/40 border-2 border-white/5 rounded-[32px] px-8 py-7 text-white outline-none focus:border-cyan-400/40 custom-scrollbar font-medium italic" />
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic ml-2">Technical Biography (BN)</label>
            <textarea rows={8} value={form.bodyBn} onChange={e => setForm({...form, bodyBn: e.target.value})} className="w-full bg-black/40 border-2 border-white/5 rounded-[32px] px-8 py-7 text-white outline-none focus:border-cyan-400/40 custom-scrollbar font-medium italic" />
          </div>
        </div>

        <div className="pt-8">
           <ImageUpload value={form.featuredImageUrl} onChange={val => setForm({...form, featuredImageUrl: val})} label="Principal Portrait Card" />
        </div>
      </div>
    </AdminModuleWrapper>
  );
}
