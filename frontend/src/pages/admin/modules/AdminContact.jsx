import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Globe, MessageCircle, Share2, Users, Sparkles, Map, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "../../../components/BrandIcons";
import { adminList, adminUpdate, adminCreate } from "../../../lib/api";
import AdminModuleWrapper from "./AdminModuleWrapper";
import AutoTranslate from "../../../components/admin/AutoTranslate";

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
        toast.error("Failed to load contact information.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);

    const payload = {
      slug: "primary",
      phone: form.phone.trim(),
      email: form.email.trim(),
      whatsapp: form.whatsapp.trim(),
      whatsappEnabled: form.whatsappEnabled,
      whatsappLabel: form.whatsappLabel,
      address: { 
        en: form.addressEn.trim(), 
        bn: form.addressBn.trim() 
      },
      googleMapEmbedUrl: form.googleMapEmbedUrl.trim(),
      socialLinks: {
        facebook: form.facebook.trim(),
        linkedin: form.linkedin.trim(),
        youtube: form.youtube.trim(),
        instagram: form.instagram.trim(),
        twitter: form.twitter.trim(),
      },
      isPublished: true,
    };

    try {
      if (recordId) {
        await adminUpdate("contactDetails", recordId, payload);
      } else {
        const result = await adminCreate("contactDetails", payload);
        setRecordId(result._id);
      }

      toast.success("Contact information saved successfully!");
    } catch (err) {
      console.error("[ADMIN_CONTACT_ERROR] Save Failure:", err);
      toast.error("Failed to save contact information.");
    } finally { 
      setSaving(false); 
    }
  };

  const inputClasses = "w-full bg-[var(--admin-card)] border border-[color:var(--admin-border)] rounded-2xl px-7 py-5 text-[color:var(--admin-text-heading)] outline-none focus:border-sky-500 focus:bg-[var(--admin-card)] transition-all font-medium placeholder:text-[color:var(--admin-text-muted)] shadow-sm text-sm";
  const labelClasses = "flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-[color:var(--admin-text-secondary)] ml-4 mb-4";

  return (
    <AdminModuleWrapper
      title="Contact Information"
      subtitle="Manage your office address, contact numbers, and social media links."
      icon={Mail}
      loading={loading}
      saving={saving}
      status={status}
      onSave={handleSave}
    >
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Core Communication Nodes */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className={labelClasses}><Phone size={12} className="text-sky-500" /> Phone Number</label>
            <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className={inputClasses} placeholder="+880 1XXX XXXXXX" />
          </div>
          <div className="space-y-2">
            <label className={labelClasses}><Mail size={12} className="text-sky-500" /> Email Address</label>
            <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} className={inputClasses} placeholder="architect@studio.com" />
          </div>
        </div>

        {/* Messaging Interface */}
        <div className="bg-[var(--admin-bg)] border border-[color:var(--admin-border)] rounded-[32px] p-8 relative overflow-hidden group/whatsapp shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                 <MessageCircle size={18} className="text-emerald-500" />
                 <h3 className="text-[11px] font-black uppercase tracking-widest text-[color:var(--admin-text-muted)]">WhatsApp Settings</h3>
              </div>
              <label className="flex items-center cursor-pointer scale-90">
                  <div className={`h-6 w-12 rounded-full transition-all duration-300 relative ${form.whatsappEnabled ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-slate-700'}`}>
                    <div className={`h-4 w-4 bg-white rounded-full absolute top-1 transition-all duration-300 ${form.whatsappEnabled ? 'left-7' : 'left-1'}`} />
                  </div>
                  <input type="checkbox" checked={form.whatsappEnabled} onChange={e => setForm({...form, whatsappEnabled: e.target.checked})} className="hidden" />
              </label>
           </div>

           <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className={labelClasses}>WhatsApp Number</label>
                <input value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} className={`${inputClasses} focus:border-emerald-500/50`} placeholder="e.g. 8801XXXXXXXXX" />
              </div>
              <div className="space-y-2">
                <label className={labelClasses}>Button Text (on website)</label>
                <input value={form.whatsappLabel} onChange={e => setForm({...form, whatsappLabel: e.target.value})} className={`${inputClasses} focus:border-emerald-500/50`} placeholder="e.g. Chat with us" />
              </div>
           </div>
        </div>

        {/* Spatial Information Nodes */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className={labelClasses}><MapPin size={12} className="text-sky-500" /> Office Address (EN)</label>
            <textarea rows={4} value={form.addressEn} onChange={e => setForm({...form, addressEn: e.target.value})} className={`${inputClasses} resize-none leading-relaxed`} placeholder="Enter office address in English" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center px-4">
              <label className={labelClasses}>Office Address (BN)</label>
              <AutoTranslate text={form.addressEn} onTranslate={val => setForm({...form, addressBn: val})} />
            </div>
            <textarea rows={4} value={form.addressBn} onChange={e => setForm({...form, addressBn: e.target.value})} className={`${inputClasses} resize-none leading-relaxed`} placeholder="অফিসের ঠিকানা (বাংলায়)" />
          </div>
        </div>

        {/* Global Map Integration */}
        <div className="space-y-2">
           <label className={labelClasses}><Map size={12} className="text-sky-500" /> Google Maps Location (Embed URL)</label>
           <p className="text-[9px] text-[color:var(--admin-text-muted)] ml-4 mb-2 uppercase font-bold tracking-widest">Paste the "src" URL from Google Maps embed code</p>
           <input value={form.googleMapEmbedUrl} onChange={e => setForm({...form, googleMapEmbedUrl: e.target.value})} className={inputClasses} placeholder="https://www.google.com/maps/embed?..." />
        </div>

        {/* Social Architecture Hub */}
        <div className="pt-4">
           <div className="bg-[var(--admin-bg)] border border-[color:var(--admin-border)] rounded-[32px] p-8 relative overflow-hidden group/social shadow-sm">
              <div className="flex items-center gap-4 mb-10">
                 <Share2 size={20} className="text-sky-500" />
                 <h3 className="text-[12px] font-black uppercase tracking-widest text-[color:var(--admin-text-heading)]">Social Media Links</h3>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                 <div className="space-y-2">
                    <label className={labelClasses}><Facebook size={12} className="text-blue-600" /> Facebook URL</label>
                    <input value={form.facebook} onChange={e => setForm({...form, facebook: e.target.value})} className={inputClasses} placeholder="https://facebook.com/..." />
                 </div>
                 <div className="space-y-2">
                    <label className={labelClasses}><Linkedin size={12} className="text-blue-500" /> LinkedIn URL</label>
                    <input value={form.linkedin} onChange={e => setForm({...form, linkedin: e.target.value})} className={inputClasses} placeholder="https://linkedin.com/in/..." />
                 </div>
                 <div className="space-y-2">
                    <label className={labelClasses}><Instagram size={12} className="text-pink-600" /> Instagram URL</label>
                    <input value={form.instagram} onChange={e => setForm({...form, instagram: e.target.value})} className={inputClasses} placeholder="https://instagram.com/..." />
                 </div>
                 <div className="space-y-2">
                    <label className={labelClasses}><Twitter size={12} className="text-sky-500" /> Twitter / X URL</label>
                    <input value={form.twitter} onChange={e => setForm({...form, twitter: e.target.value})} className={inputClasses} placeholder="https://twitter.com/..." />
                 </div>
                 <div className="space-y-2">
                    <label className={labelClasses}><Youtube size={12} className="text-red-600" /> YouTube URL</label>
                    <input value={form.youtube} onChange={e => setForm({...form, youtube: e.target.value})} className={inputClasses} placeholder="https://youtube.com/..." />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </AdminModuleWrapper>
  );
}
