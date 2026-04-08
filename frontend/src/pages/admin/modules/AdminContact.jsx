import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Globe, Facebook, Linkedin, Youtube, MessageCircle } from "lucide-react";
import { adminList, adminUpdate, adminCreate } from "../../../lib/api";
import AdminModuleWrapper from "./AdminModuleWrapper";

export default function AdminContact() {
  const [form, setForm] = useState({
    phone: "",
    email: "",
    whatsapp: "",
    whatsappEnabled: true,
    whatsappLabel: "CONTACT VIA WHATSAPP",
    addressEn: "",
    addressBn: "",
    googleMapEmbedUrl: "",
    facebook: "",
    linkedin: "",
    youtube: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [recordId, setRecordId] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await adminList("contactDetails", { limit: 1 });
        const item = response.items?.[0];
        if (item) {
          setRecordId(item._id);
          setForm({
            phone: item.phone || "",
            email: item.email || "",
            whatsapp: item.whatsapp || "",
            whatsappEnabled: item.whatsappEnabled ?? true,
            whatsappLabel: item.whatsappLabel || "WhatsApp Chat",
            addressEn: item.address?.en || "",
            addressBn: item.address?.bn || "",
            googleMapEmbedUrl: item.googleMapEmbedUrl || "",
            facebook: item.socialLinks?.facebook || "",
            linkedin: item.socialLinks?.linkedin || "",
            youtube: item.socialLinks?.youtube || "",
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
      slug: "primary",
      phone: form.phone,
      email: form.email,
      whatsapp: form.whatsapp,
      whatsappEnabled: form.whatsappEnabled,
      whatsappLabel: form.whatsappLabel,
      address: { en: form.addressEn, bn: form.addressBn },
      googleMapEmbedUrl: form.googleMapEmbedUrl,
      socialLinks: {
        facebook: form.facebook,
        linkedin: form.linkedin,
        youtube: form.youtube,
      },
      isPublished: true,
    };

    try {
      if (recordId) {
        await adminUpdate("contactDetails", recordId, payload);
      } else {
        const res = await adminCreate("contactDetails", payload);
        setRecordId(res._id);
      }
      setStatus({ type: "success", message: "SUCCESS: CONTACT INFRASTRUCTURE SYNCED" });
    } catch (err) {
      setStatus({ type: "error", message: "COMMIT_FAILED" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminModuleWrapper
      title="Contact Infrastructure"
      subtitle="Manage studio location, social nodes, and communication hubs."
      icon={Mail}
      loading={loading}
      saving={saving}
      status={status}
      onSave={handleSave}
    >
      <div className="space-y-16">
        {/* Core Communication */}
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 italic ml-2">
              <Phone size={12} className="text-cyan-400" /> Professional Phone
            </label>
            <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-black/40 border-2 border-white/5 rounded-2xl px-6 py-5 text-white outline-none focus:border-cyan-400/40 font-bold italic" />
          </div>
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 italic ml-2">
              <Mail size={12} className="text-cyan-400" /> Secure Email Hub
            </label>
            <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-black/40 border-2 border-white/5 rounded-2xl px-6 py-5 text-white outline-none focus:border-cyan-400/40 font-bold italic" />
          </div>
        </div>

        {/* WhatsApp Integration */}
        <div className="bg-white/2 border border-white/5 rounded-[40px] p-10 md:p-12 relative overflow-hidden">
           <div className="absolute top-0 right-10 h-1 w-20 bg-emerald-500/40" />
           <div className="flex flex-col md:flex-row gap-10">
              <div className="flex-1 space-y-4">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400/60 italic ml-2">
                  <MessageCircle size={12} className="text-emerald-400" /> WhatsApp Direct Node
                </label>
                <input value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} className="w-full bg-black/60 border-2 border-white/5 rounded-2xl px-6 py-5 text-white outline-none focus:border-emerald-500/40 font-bold italic" />
              </div>
              <div className="flex-1 space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-400/60 italic ml-2">Button Annotation</label>
                <input value={form.whatsappLabel} onChange={e => setForm({...form, whatsappLabel: e.target.value})} className="w-full bg-black/60 border-2 border-white/5 rounded-2xl px-6 py-5 text-white outline-none focus:border-emerald-500/40 font-bold italic" />
              </div>
           </div>
        </div>

        {/* Physical Nodes */}
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-4 text-left">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 italic ml-2">
              <MapPin size={12} className="text-cyan-400" /> Studio Location (EN)
            </label>
            <textarea rows={3} value={form.addressEn} onChange={e => setForm({...form, addressEn: e.target.value})} className="w-full bg-black/40 border-2 border-white/5 rounded-2xl px-6 py-5 text-white outline-none focus:border-cyan-400/40 italic font-medium" />
          </div>
          <div className="space-y-4 text-left">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic ml-2">Studio Location (BN)</label>
            <textarea rows={3} value={form.addressBn} onChange={e => setForm({...form, addressBn: e.target.value})} className="w-full bg-black/40 border-2 border-white/5 rounded-2xl px-6 py-5 text-white outline-none focus:border-cyan-400/40 italic font-medium" />
          </div>
        </div>

        {/* Social Infrastructure */}
        <div className="pt-8 text-left">
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400/60 mb-8 italic ml-2">Digital Social Coordination</p>
           <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-700 uppercase tracking-widest italic ml-1"><Facebook size={12} /> Facebook</label>
                <input value={form.facebook} onChange={e => setForm({...form, facebook: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-xl px-5 py-3 text-white outline-none focus:border-blue-500/40 italic font-mono text-[11px]" />
              </div>
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-700 uppercase tracking-widest italic ml-1"><Linkedin size={12} /> LinkedIn</label>
                <input value={form.linkedin} onChange={e => setForm({...form, linkedin: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-xl px-5 py-3 text-white outline-none focus:border-blue-400/40 italic font-mono text-[11px]" />
              </div>
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-700 uppercase tracking-widest italic ml-1"><Youtube size={12} /> YouTube</label>
                <input value={form.youtube} onChange={e => setForm({...form, youtube: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-xl px-5 py-3 text-white outline-none focus:border-red-500/40 italic font-mono text-[11px]" />
              </div>
           </div>
        </div>
      </div>
    </AdminModuleWrapper>
  );
}
