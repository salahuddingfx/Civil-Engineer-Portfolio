import { useState, useEffect } from "react";
import { MessageSquare, Star, Type, User, Quote, Trash2, Sparkles, CheckCircle2, Crown, Search } from "lucide-react";
import { adminList, adminUpdate, adminCreate, adminDelete } from "../../../lib/api";
import AdminModuleWrapper from "./AdminModuleWrapper";
import ImageUpload from "../../../components/admin/ImageUpload";
import AutoTranslate from "../../../components/admin/AutoTranslate";

export default function AdminTestimonials() {
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({
    name: "",
    role: "",
    company: "",
    text: "",
    textBn: "",
    rating: 5,
    featuredImageUrl: "",
    isFeatured: false,
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const loadData = async () => {
    try {
      const response = await adminList("testimonials", { limit: 100 });
      const fetchedItems = response.items || [];
      setItems(fetchedItems);
      if (fetchedItems.length > 0 && !selectedId) {
        setSelectedId(fetchedItems[0]._id);
      }
    } catch (err) {
      setStatus({ type: "error", message: "Failed to load testimonials." });
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
          isFeatured: item.isFeatured || false,
        });
      }
    } else {
      setForm({ name: "", role: "", company: "", text: "", textBn: "", rating: 5, featuredImageUrl: "", isFeatured: false });
    }
  }, [selectedId, items]);

  const handleSave = async () => {
    setSaving(true);
    setStatus({ type: "", message: "" });
    const payload = {
      slug: selectedId ? form.slug : `${(form.name || "client").toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      title: { en: form.name, bn: form.name },
      summary: { en: form.role, bn: form.role },
      category: form.company,
      body: { en: form.text, bn: form.textBn },
      rating: Number(form.rating),
      featuredImage: form.featuredImageUrl ? { url: form.featuredImageUrl } : null,
      isFeatured: form.isFeatured,
      isPublished: true,
    };

    try {
      if (selectedId) {
        console.log(`[ADMIN_TESTIMONIALS] Committing update to feedback node: ${selectedId}`);
        await adminUpdate("testimonials", selectedId, payload);
      } else {
        console.log("[ADMIN_TESTIMONIALS] Initializing new client endorsement record...");
        await adminCreate("testimonials", payload);
      }
      
      setStatus({ type: "success", message: "TESTIMONIAL SYNCHRONIZED SUCCESSFULLY" });
    } catch (err) {
      console.error("[ADMIN_TESTIMONIAL_ERROR] Save Protocol Failure:", err);
      setStatus({ type: "error", message: "COMMIT FAILED: Protocol Error" });
    } finally { 
      setSaving(false); 
      // Force clean reload to bypass cache and state lag
      setTimeout(() => window.location.reload(), 2000);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    setSaving(true);
    setStatus({ type: "", message: "" });
    try {
      console.log(`[ADMIN_TESTIMONIALS] Purging feedback from registry: ${selectedId}`);
      await adminDelete("testimonials", selectedId);
      setStatus({ type: "success", message: "FEEDBACK PURGED SUCCESSFULLY" });
    } catch (err) {
      console.error("[ADMIN_TESTIMONIAL_ERROR] Delete Protocol Failure:", err);
      setStatus({ type: "error", message: "PURGE_FAILURE" });
    } finally { 
      setSaving(false); 
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  const filteredItems = items.filter(item => 
    item.title?.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inputClasses = "w-full bg-[var(--admin-card)] border border-[color:var(--admin-border)] rounded-2xl px-7 py-5 text-[color:var(--admin-text-heading)] outline-none focus:border-cyan-400/50 focus:bg-[var(--admin-card)] opacity-90 transition-all font-medium italic placeholder:text-[color:var(--admin-text-muted)] opacity-80 shadow-inner text-sm";
  const labelClasses = "flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-[color:var(--admin-text-secondary)] italic ml-4 mb-4";

  return (
    <AdminModuleWrapper
      title="Testimonials"
      subtitle="Manage client reviews and professional endorsements."
      icon={MessageSquare}
      loading={loading}
      saving={saving}
      status={status}
      onSave={handleSave}
      onDelete={selectedId ? handleDelete : null}
      allowCreate={!!selectedId}
      onNew={() => setSelectedId(null)}
    >
      <div className="grid lg:grid-cols-[380px_1fr] gap-16">
        {/* List Sidebar */}
        <div className="space-y-8 flex flex-col">
          <div className="relative group">
             <Search size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-[color:var(--admin-text-muted)] group-focus-within:text-cyan-400 transition-colors" />
             <input 
               placeholder="Search Feedback..." 
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
               className="w-full bg-[var(--admin-card)] border border-[color:var(--admin-border)] rounded-2xl pl-14 pr-6 py-5 text-[11px] font-bold uppercase tracking-widest text-[color:var(--admin-text-heading)] outline-none focus:border-cyan-400/40 transition-all"
             />
          </div>

          <div className="space-y-4 max-h-[800px] overflow-y-auto pr-4 custom-scrollbar">
            {filteredItems.map(item => (
              <div 
                key={item._id}
                onClick={() => setSelectedId(item._id)}
                className={`p-6 rounded-[32px] border transition-all duration-500 cursor-pointer group flex gap-5 relative overflow-hidden ${selectedId === item._id ? 'border-cyan-400/40 bg-cyan-400/[0.03]' : 'border-[color:var(--admin-border)] bg-[var(--admin-card)] opacity-90 hover:border-white/10 hover:bg-[var(--admin-card)] opacity-90'}`}
              >
                {selectedId === item._id && <div className="absolute left-0 top-0 w-1 h-full bg-sky-500" />}
                
                <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border border-[color:var(--admin-border)] shadow-xl transition-transform duration-500">
                  <img 
                    src={item.featuredImage?.url || "https://avatar.iran.liara.run/public"} 
                    className={`w-full h-full object-cover transition-all duration-700 ${selectedId === item._id ? 'grayscale-0' : 'grayscale group-hover:grayscale-0 opacity-40 group-hover:opacity-100'}`}
                    alt=""
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[8px] font-black uppercase tracking-[0.2em] italic ${selectedId === item._id ? 'text-sky-600' : 'text-[color:var(--admin-text-primary)]'}`}>{item.category}</span>
                    <div className="flex gap-1.5">
                       {item.isFeatured && <Crown size={10} className="text-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]" />}
                       <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                    </div>
                  </div>
                  <p className="text-sm font-black text-[color:var(--admin-text-heading)] italic truncate tracking-tight mb-1 uppercase">{item.title?.en || "Client Name"}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[7px] font-black uppercase text-[color:var(--admin-text-heading)] tracking-widest bg-[color:var(--admin-bg)] px-2 py-0.5 rounded truncate">ROLE: {item.summary?.en || "N/A"}</span>
                    <span className="text-[7px] font-black uppercase text-[color:var(--admin-text-heading)] tracking-widest bg-[color:var(--admin-bg)] px-2 py-0.5 rounded">ID: {item._id?.slice(-4) || '....'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Editor Form */}
        <div className="space-y-16 animate-in fade-in slide-in-from-right-4 duration-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-[color:var(--admin-border)] pb-12">
            <div>
               <h3 className="text-3xl font-black text-[color:var(--admin-text-heading)] tracking-tighter uppercase mb-2">{selectedId ? "Edit Testimonial" : "New Testimonial"}</h3>
               <p className="text-[10px] text-[color:var(--admin-text-secondary)] font-bold uppercase tracking-widest italic">{selectedId ? `ID: ${selectedId}` : "Create a new professional endorsement"}</p>
            </div>
            
            <div className="flex items-center gap-6 px-10 py-5 bg-[color:var(--admin-bg)] border border-[color:var(--admin-border)] rounded-3xl group/featured">
               <div className="flex items-center gap-3">
                  <Crown size={14} className={form.isFeatured ? 'text-yellow-500 animate-pulse' : 'text-[color:var(--admin-text-secondary)]'} />
                  <span className={`text-[9px] font-black uppercase tracking-[0.3em] italic ${form.isFeatured ? 'text-yellow-500' : 'text-[color:var(--admin-text-primary)]'}`}>Featured Status</span>
               </div>
               <label className="flex items-center cursor-pointer group scale-90">
                  <div className={`h-7 w-14 rounded-full transition-all duration-500 relative ${form.isFeatured ? 'bg-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)]' : 'bg-slate-800'}`}>
                    <div className={`h-5 w-5 bg-[var(--admin-card)] rounded-full absolute top-1 transition-all duration-500 ${form.isFeatured ? 'left-8' : 'left-1'}`} />
                  </div>
                  <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({...form, isFeatured: e.target.checked})} className="hidden" />
               </label>
            </div>
          </div>

          {/* Client Identity */}
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-2">
              <label className={labelClasses}><User size={12} className="text-sky-600" /> Client Name (EN)</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={inputClasses} placeholder="John Doe" />
            </div>
            <div className="space-y-2">
               <label className={labelClasses}>Company / Organization</label>
               <input value={form.company} onChange={e => setForm({...form, company: e.target.value})} className={inputClasses} placeholder="Engineering Firm" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-2">
              <label className={labelClasses}>Professional Role / Designation</label>
              <input value={form.role} onChange={e => setForm({...form, role: e.target.value})} className={inputClasses} placeholder="Project Manager" />
            </div>
            <div className="space-y-2 text-left">
              <label className={labelClasses}><Star size={12} className="text-yellow-500" /> Rating (1-5)</label>
              <input type="number" min="1" max="5" value={form.rating} onChange={e => setForm({...form, rating: e.target.value})} className={inputClasses} />
            </div>
          </div>

          {/* Endorsement Content */}
          <div className="space-y-10">
            <div className="space-y-2">
               <label className={labelClasses}><Quote size={12} className="text-sky-600" /> Testimonial Content (EN)</label>
               <textarea rows={5} value={form.text} onChange={e => setForm({...form, text: e.target.value})} className={`${inputClasses} resize-none leading-relaxed`} placeholder="Client feedback text..." />
            </div>
            <div className="space-y-2">
               <div className="flex justify-between items-center px-4">
                  <label className={labelClasses}>Testimonial Content (BN)</label>
                  <AutoTranslate text={form.text} onTranslate={val => setForm({...form, textBn: val})} />
               </div>
               <textarea rows={5} value={form.textBn} onChange={e => setForm({...form, textBn: e.target.value})} className={`${inputClasses} resize-none leading-relaxed`} placeholder="ক্লায়েন্ট ফিডব্যাক..." />
            </div>
          </div>

          {/* Media Module */}
          <div className="pt-8">
             <div className="bg-[color:var(--admin-bg)] border border-[color:var(--admin-border)] rounded-[48px] p-12 relative overflow-hidden group/media">
                <div className="absolute top-0 right-0 h-1.5 w-60 bg-gradient-to-l from-cyan-400/20 to-transparent rounded-bl-full" />
                <div className="flex items-center gap-4 mb-10">
                   <Sparkles size={18} className="text-sky-600" />
                   <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-[color:var(--admin-text-secondary)]">Client Portrait</h3>
                </div>
                <ImageUpload value={form.featuredImageUrl} onChange={val => setForm({...form, featuredImageUrl: val})} label="Profile Picture" />
             </div>
          </div>
        </div>
      </div>
    </AdminModuleWrapper>
  );
}
