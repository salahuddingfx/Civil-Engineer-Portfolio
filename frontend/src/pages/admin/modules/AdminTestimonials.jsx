import { useState, useEffect } from "react";
import { MessageSquare, Star, Type, User, Quote, Trash2, Sparkles, CheckCircle2, Crown, Search, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { adminList, adminUpdate, adminCreate, adminDelete } from "../../../lib/api";
import AdminModuleWrapper from "./AdminModuleWrapper";
import AdminConfirm from "../../../components/admin/AdminConfirm";
import ImageUpload from "../../../components/admin/ImageUpload";
import AutoTranslate from "../../../components/admin/AutoTranslate";

export default function AdminTestimonials() {
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({
    nameEn: "",
    nameBn: "",
    roleEn: "",
    roleBn: "",
    company: "",
    text: "",
    textBn: "",
    rating: 5,
    featuredImageUrl: "",
    isFeatured: false,
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const loadData = async () => {
    try {
      const response = await adminList("testimonials", { limit: 100 });
      const fetchedItems = response.items || [];
      setItems(fetchedItems);
      if (fetchedItems.length > 0 && !selectedId) {
        setSelectedId(fetchedItems[0]._id);
      }
    } catch (err) {
      toast.error("Failed to load testimonials.");
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
          nameEn: item.title?.en || "",
          nameBn: item.title?.bn || "",
          roleEn: item.summary?.en || "",
          roleBn: item.summary?.bn || "",
          company: item.category || "",
          text: item.body?.en || "",
          textBn: item.body?.bn || "",
          rating: item.rating || 5,
          featuredImageUrl: item.featuredImage?.url || "",
          isFeatured: item.isFeatured || false,
        });
      }
    } else {
      setForm({ nameEn: "", nameBn: "", roleEn: "", roleBn: "", company: "", text: "", textBn: "", rating: 5, featuredImageUrl: "", isFeatured: false });
    }
  }, [selectedId, items]);

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      slug: selectedId ? items.find(i => i._id === selectedId)?.slug : `${(form.nameEn || "client").toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      title: { en: form.nameEn, bn: form.nameBn },
      summary: { en: form.roleEn, bn: form.roleBn },
      category: form.company,
      body: { en: form.text, bn: form.textBn },
      rating: Number(form.rating),
      featuredImage: form.featuredImageUrl ? { url: form.featuredImageUrl } : null,
      isFeatured: form.isFeatured,
      isPublished: true,
    };

    try {
      if (selectedId) {
        await adminUpdate("testimonials", selectedId, payload);
      } else {
        await adminCreate("testimonials", payload);
      }
      
      toast.success("Review saved successfully!");
    } catch (err) {
      console.error("[ADMIN_TESTIMONIAL_ERROR] Save Failure:", err);
      toast.error("Failed to save review. Please try again.");
    } finally { 
      setSaving(false); 
      await loadData();
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await adminDelete("testimonials", selectedId);
      toast.success("Review deleted successfully.");
      setSelectedId(null);
      await loadData();
    } catch (err) {
      console.error("[ADMIN_TESTIMONIAL_ERROR] Delete Failure:", err);
      toast.error("Failed to delete review.");
    } finally { 
      setSaving(false); 
    }
  };

  const filteredItems = items.filter(item => 
    item.title?.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inputClasses = "w-full bg-[var(--admin-card)] border border-[color:var(--admin-border)] rounded-2xl px-7 py-5 text-[color:var(--admin-text-heading)] outline-none focus:border-sky-500 focus:bg-[var(--admin-card)] transition-all font-medium placeholder:text-[color:var(--admin-text-muted)] shadow-sm text-sm";
  const labelClasses = "flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-[color:var(--admin-text-secondary)] ml-4 mb-4";

  return (
    <>
      <AdminConfirm 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Review"
        message="Are you sure you want to delete this testimonial? This feedback will no longer be visible to potential clients."
      />
      <AdminModuleWrapper
        title="Client Reviews"
        subtitle="Manage your client feedback, recommendations, and professional testimonials."
        icon={MessageSquare}
        loading={loading}
        saving={saving}
        onSave={handleSave}
        onDelete={selectedId ? () => setIsConfirmOpen(true) : null}
        allowCreate={!!selectedId}
        onNew={() => setSelectedId(null)}
      >
      <div className="grid lg:grid-cols-[380px_1fr] gap-12">
        {/* List Sidebar */}
        <div className="space-y-6 flex flex-col">
          <div className="relative group">
             <Search size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-[color:var(--admin-text-muted)] group-focus-within:text-sky-500 transition-colors" />
             <input 
               placeholder="Search reviews..." 
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
               className="w-full bg-[var(--admin-card)] border border-[color:var(--admin-border)] rounded-2xl pl-14 pr-6 py-4 text-[11px] font-bold uppercase tracking-widest text-[color:var(--admin-text-heading)] outline-none focus:border-sky-500 transition-all shadow-inner"
             />
          </div>

          <div className="flex flex-col gap-3 max-h-[800px] overflow-y-auto pr-2 admin-scrollbar">
            {filteredItems.map(item => (
              <div 
                key={item._id}
                onClick={() => setSelectedId(item._id)}
                className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer group flex gap-4 relative overflow-hidden ${selectedId === item._id ? 'border-sky-500 bg-sky-500/5 shadow-md' : 'border-[color:var(--admin-border)] bg-[var(--admin-card)] hover:border-sky-500/40'}`}
              >
                {selectedId === item._id && <div className="absolute left-0 top-0 w-1 h-full bg-sky-500" />}
                
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-[color:var(--admin-border)] bg-slate-800">
                  <img 
                    src={item.featuredImage?.url || "https://avatar.iran.liara.run/public"} 
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[8px] font-black uppercase tracking-widest text-sky-500">{item.category || "Client"}</span>
                    <div className="flex gap-1.5 items-center">
                       {item.isFeatured && <Crown size={10} className="text-yellow-500" />}
                       <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    </div>
                  </div>
                  <p className="text-[11px] font-black text-[color:var(--admin-text-heading)] truncate uppercase tracking-wider mb-1">{item.title?.en || "Client Name"}</p>
                  <p className="text-[9px] text-[color:var(--admin-text-muted)] font-bold uppercase tracking-widest truncate">{item.summary?.en || "Reviewer"}</p>
                </div>
              </div>
            ))}
            {!loading && filteredItems.length === 0 && (
               <div className="py-20 text-center space-y-4 opacity-30">
                  <MessageSquare size={32} className="mx-auto text-[color:var(--admin-text-muted)]" />
                  <p className="text-[9px] font-black uppercase tracking-widest">No reviews found</p>
               </div>
            )}
          </div>
        </div>

        {/* Editor Form */}
        <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[color:var(--admin-border)] pb-8">
            <div>
               <h3 className="text-2xl font-black text-[color:var(--admin-text-heading)] tracking-tight uppercase mb-1">{selectedId ? "Edit Testimonial" : "Add New Testimonial"}</h3>
               <p className="text-[10px] text-[color:var(--admin-text-muted)] font-bold uppercase tracking-widest">Manage what your clients are saying about your work</p>
            </div>
            
            <div className="flex items-center gap-6 px-6 py-3 bg-[color:var(--admin-bg)] border border-[color:var(--admin-border)] rounded-2xl shadow-sm">
               <div className="flex items-center gap-3">
                  <Crown size={14} className={form.isFeatured ? 'text-yellow-500' : 'text-slate-500'} />
                  <span className={`text-[9px] font-black uppercase tracking-widest ${form.isFeatured ? 'text-yellow-500' : 'text-slate-500'}`}>Featured</span>
               </div>
               <label className="flex items-center cursor-pointer scale-90">
                  <div className={`h-6 w-12 rounded-full transition-all duration-300 relative ${form.isFeatured ? 'bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]' : 'bg-slate-700'}`}>
                    <div className={`h-4 w-4 bg-white rounded-full absolute top-1 transition-all duration-300 ${form.isFeatured ? 'left-7' : 'left-1'}`} />
                  </div>
                  <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({...form, isFeatured: e.target.checked})} className="hidden" />
               </label>
            </div>
          </div>

          {/* Client Identity */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <div className="flex items-center justify-between px-4">
                 <label className={labelClasses}><User size={12} className="text-sky-500" /> Client Name (EN)</label>
                 <AutoTranslate text={form.nameEn} onTranslate={val => setForm({...form, nameBn: val})} />
              </div>
              <input value={form.nameEn} onChange={e => setForm({...form, nameEn: e.target.value})} className={inputClasses} placeholder="e.g. John Doe" />
            </div>
            <div className="space-y-2 pt-10">
               <input value={form.nameBn} onChange={e => setForm({...form, nameBn: e.target.value})} className={inputClasses} placeholder="নাম (বাংলায়)" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
               <div className="flex items-center justify-between px-4">
                  <label className={labelClasses}>Job Title / Role (EN)</label>
                  <AutoTranslate text={form.roleEn} onTranslate={val => setForm({...form, roleBn: val})} />
               </div>
               <input value={form.roleEn} onChange={e => setForm({...form, roleEn: e.target.value})} className={inputClasses} placeholder="e.g. Project Manager" />
            </div>
            <div className="space-y-2 pt-10">
               <input value={form.roleBn} onChange={e => setForm({...form, roleBn: e.target.value})} className={inputClasses} placeholder="পদবী (বাংলায়)" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
               <label className={labelClasses}>Company / Organization</label>
               <input value={form.company} onChange={e => setForm({...form, company: e.target.value})} className={inputClasses} placeholder="e.g. Engineering Firm" />
            </div>
            <div className="space-y-2">
              <label className={labelClasses}><Star size={12} className="text-yellow-500" /> Rating (1-5)</label>
              <input type="number" min="1" max="5" value={form.rating} onChange={e => setForm({...form, rating: e.target.value})} className={inputClasses} />
            </div>
          </div>

          {/* Endorsement Content */}
          <div className="space-y-8">
            <div className="space-y-2">
               <div className="flex justify-between items-center px-4">
                  <label className={labelClasses}><Quote size={12} className="text-sky-500" /> What the client said (EN)</label>
                  <AutoTranslate text={form.text} onTranslate={val => setForm({...form, textBn: val})} />
               </div>
               <textarea rows={5} value={form.text} onChange={e => setForm({...form, text: e.target.value})} className={`${inputClasses} resize-none leading-relaxed`} placeholder="Write the testimonial text here..." />
            </div>
            <div className="space-y-2">
               <textarea rows={5} value={form.textBn} onChange={e => setForm({...form, textBn: e.target.value})} className={`${inputClasses} resize-none leading-relaxed`} placeholder="মন্তব্য (বাংলায়)..." />
            </div>
          </div>

          {/* Media Module */}
          <div className="pt-4">
             <div className="bg-[color:var(--admin-bg)] border border-[color:var(--admin-border)] rounded-[32px] p-8 relative overflow-hidden group/media shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                   <ImageIcon size={18} className="text-sky-500" />
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-[color:var(--admin-text-secondary)]">Client Photo</h3>
                </div>
                <ImageUpload value={form.featuredImageUrl} onChange={val => setForm({...form, featuredImageUrl: val})} label="Upload profile photo" />
             </div>
          </div>
        </div>
      </div>
    </AdminModuleWrapper>
    </>
  );
}
