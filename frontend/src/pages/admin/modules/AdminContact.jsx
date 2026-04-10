import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Globe, MessageCircle, Share2, Users, Sparkles, Map, Smartphone } from "lucide-react";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "../../../components/BrandIcons";
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
    instagram: "",
    twitter: "",
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
            instagram: item.socialLinks?.instagram || "",
            twitter: item.socialLinks?.twitter || "",
          });
        }
      } catch (err) {
        setStatus({ type: "error", message: "LOAD_FAILED: Protocol Error" });
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
        instagram: form.instagram,
        twitter: form.twitter,
      },
      isPublished: true,
    };

    try {
      if (recordId) await adminUpdate("contactDetails", recordId, payload);
      else {
        const res = await adminCreate("contactDetails", payload);
        setRecordId(res._id);
      }
      setStatus({ type: "success", message: "CONTACT INFRASTRUCTURE SYNCHRONIZED SUCCESSFULLY" });
    } catch (err) {
      setStatus({ type: "error", message: "COMMIT_FAILED: Protocol Error" });
    } finally { setSaving(false); }
  };

  const inputClasses = "w-full bg-[var(--admin-card)] border border-[color:var(--admin-border)] rounded-2xl px-7 py-5 text-[color:var(--admin-text-heading)] outline-none focus:border-cyan-400/50 focus:bg-[var(--admin-card)] opacity-90 transition-all font-medium italic placeholder:text-[color:var(--admin-text-secondary)] shadow-inner text-sm";
  const labelClasses = "flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-[color:var(--admin-text-muted)] italic ml-4 mb-4";

  return (
    <AdminModuleWrapper
      title="Contact Infrastructure"
      subtitle="Manage studio location, communication hubs, and digital social nodes."
      icon={Mail}
      loading={loading}
      saving={saving}
      status={status}
      onSave={handleSave}
    >
      <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Core Communication Nodes */}
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-2">
            <label className={labelClasses}><Phone size={12} className="text-sky-600" /> Operational Phone Hub</label>
            <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className={inputClasses} placeholder="+880 1XXX XXXXXX" />
          </div>
          <div className="space-y-2">
            <label className={labelClasses}><Mail size={12} className="text-sky-600" /> Secure Email Gateway</label>
            <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} className={inputClasses} placeholder="architect@studio.com" />
          </div>
        </div>

        {/* Messaging Interface */}
        <div className="bg-[#0d0f1a]/40 border border-[color:var(--admin-border)] rounded-[48px] p-12 relative overflow-hidden group/whatsapp">
           <div className="absolute top-0 right-0 h-1.5 w-60 bg-gradient-to-l from-emerald-400/20 to-transparent rounded-bl-full" />
           <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                 <MessageCircle size={18} className="text-emerald-400" />
                 <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-[color:var(--admin-text-muted)] italic">Messaging Signal Center</h3>
              </div>
              <label className="flex items-center cursor-pointer scale-75">
                  <div className={`h-7 w-14 rounded-full transition-all duration-500 relative ${form.whatsappEnabled ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-slate-800'}`}>
                    <div className={`h-5 w-5 bg-[var(--admin-card)] rounded-full absolute top-1 transition-all duration-500 ${form.whatsappEnabled ? 'left-8' : 'left-1'}`} />
                  </div>
                  <input type="checkbox" checked={form.whatsappEnabled} onChange={e => setForm({...form, whatsappEnabled: e.target.checked})} className="hidden" />
              </label>
           </div>

           <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-2">
                <label className={labelClasses}>WhatsApp Direct Link/Phone</label>
                <input value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} className={`${inputClasses} focus:border-emerald-500/50`} placeholder="8801XXXXXXXXX" />
              </div>
              <div className="space-y-2">
                <label className={labelClasses}>Interface Annotation (Label)</label>
                <input value={form.whatsappLabel} onChange={e => setForm({...form, whatsappLabel: e.target.value})} className={`${inputClasses} focus:border-emerald-500/50`} placeholder="DIRECT WHATSAPP CHANNEL" />
              </div>
           </div>
        </div>

        {/* Spatial Information Nodes */}
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-2">
            <label className={labelClasses}><MapPin size={12} className="text-sky-600" /> Studio Headquarters (EN)</label>
            <textarea rows={4} value={form.addressEn} onChange={e => setForm({...form, addressEn: e.target.value})} className={`${inputClasses} resize-none leading-relaxed`} placeholder="Architectural Floor, Tech Center, Dhaka" />
          </div>
          <div className="space-y-2">
            <label className={labelClasses}>Studio Headquarters (BN)</label>
            <textarea rows={4} value={form.addressBn} onChange={e => setForm({...form, addressBn: e.target.value})} className={`${inputClasses} resize-none leading-relaxed`} placeholder="আর্কিটেকচারাল ফ্লোর, টেক সেন্টার, ঢাকা" />
          </div>
        </div>

        {/* Global Map Integration */}
        <div className="space-y-2">
           <label className={labelClasses}><Map size={12} className="text-indigo-400" /> Google Maps Embed Protocol (URL Source)</label>
           <input value={form.googleMapEmbedUrl} onChange={e => setForm({...form, googleMapEmbedUrl: e.target.value})} className={inputClasses} placeholder="https://www.google.com/maps/embed?..." />
        </div>

        {/* Social Architecture Hub */}
        <div className="pt-8">
           <div className="bg-[#090b14]/60 border border-[color:var(--admin-border)] rounded-[56px] p-16 relative overflow-hidden group/social">
              <div className="absolute top-0 left-0 h-1.5 w-80 bg-gradient-to-r from-blue-400/20 to-transparent rounded-br-full" />
              <div className="flex items-center gap-4 mb-14">
                 <Share2 size={24} className="text-blue-400" />
                 <h3 className="text-[14px] font-black uppercase tracking-[0.5em] text-[color:var(--admin-text-heading)] italic">Social Grid Architecture</h3>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                 <div className="space-y-2">
                    <label className={labelClasses}><Facebook size={12} className="text-blue-500" /> Facebook Bridge</label>
                    <input value={form.facebook} onChange={e => setForm({...form, facebook: e.target.value})} className={inputClasses} placeholder="https://facebook.com/identity" />
                 </div>
                 <div className="space-y-2">
                    <label className={labelClasses}><Linkedin size={12} className="text-blue-400" /> LinkedIn Node</label>
                    <input value={form.linkedin} onChange={e => setForm({...form, linkedin: e.target.value})} className={inputClasses} placeholder="https://linkedin.com/in/identity" />
                 </div>
                 <div className="space-y-2">
                    <label className={labelClasses}><Instagram size={12} className="text-pink-500" /> Instagram Feed</label>
                    <input value={form.instagram} onChange={e => setForm({...form, instagram: e.target.value})} className={inputClasses} placeholder="https://instagram.com/identity" />
                 </div>
                 <div className="space-y-2">
                    <label className={labelClasses}><Twitter size={12} className="text-sky-600" /> Twitter / X Stream</label>
                    <input value={form.twitter} onChange={e => setForm({...form, twitter: e.target.value})} className={inputClasses} placeholder="https://twitter.com/identity" />
                 </div>
                 <div className="space-y-2">
                    <label className={labelClasses}><Youtube size={12} className="text-red-500" /> YouTube Channel</label>
                    <input value={form.youtube} onChange={e => setForm({...form, youtube: e.target.value})} className={inputClasses} placeholder="https://youtube.com/@channel" />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </AdminModuleWrapper>
  );
}
