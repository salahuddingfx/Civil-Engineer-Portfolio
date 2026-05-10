import { useState, useEffect } from "react";
import { Briefcase, Settings, Edit3, Trash2, Plus, Type, Sparkles, Cpu, Layers, Search } from "lucide-react";
import { toast } from "sonner";
import { adminList, adminUpdate, adminCreate, adminDelete } from "../../../lib/api";
import AdminModuleWrapper from "./AdminModuleWrapper";
import AdminConfirm from "../../../components/admin/AdminConfirm";
import AutoTranslate from "../../../components/admin/AutoTranslate";

export default function AdminServices() {
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
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
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const loadData = async () => {
    try {
      const response = await adminList("services", { limit: 100 });
      const fetchedItems = response.items || [];
      setItems(fetchedItems);
      if (fetchedItems.length > 0 && !selectedId) {
        setSelectedId(fetchedItems[0]._id);
      }
    } catch (err) {
      toast.error("Failed to load services.");
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
    const payload = {
      slug: selectedId ? form.slug : `${(form.slug || form.titleEn.toLowerCase().replace(/\s+/g, '-'))}-${Date.now()}`,
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
      
      toast.success("Service saved successfully!");
    } catch (err) {
      console.error("[ADMIN_SERVICE_ERROR] Save Failure:", err);
      toast.error("Failed to save service. Please try again.");
    } finally { 
      setSaving(false); 
      await loadData();
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await adminDelete("services", selectedId);
      toast.success("Service deleted successfully.");
      setSelectedId(null);
      await loadData();
    } catch (err) {
      console.error("[ADMIN_SERVICE_ERROR] Delete Failure:", err);
      toast.error("Failed to delete service.");
    } finally { 
      setSaving(false); 
    }
  };

  const filteredItems = items.filter(item => 
    item.title?.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tags?.[0]?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inputClasses = "w-full bg-[var(--admin-card)] border border-[color:var(--admin-border)] rounded-2xl px-7 py-5 text-[color:var(--admin-text-heading)] outline-none focus:border-sky-500 focus:bg-[var(--admin-card)] transition-all font-medium placeholder:text-[color:var(--admin-text-secondary)] shadow-sm text-sm";
  const labelClasses = "flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-[color:var(--admin-text-muted)] ml-4 mb-4";

  return (
    <>
      <AdminConfirm 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Service"
        message="Are you sure you want to delete this service permanently? This will remove it from the public services page."
      />
      <AdminModuleWrapper
        title="Our Services"
        subtitle="Manage your professional engineering services and architectural packages."
        icon={Briefcase}
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
               placeholder="Search services..." 
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
               className="w-full bg-[var(--admin-card)] border border-[color:var(--admin-border)] rounded-2xl pl-14 pr-6 py-4 text-[11px] font-bold uppercase tracking-widest text-[color:var(--admin-text-heading)] outline-none focus:border-sky-500 transition-all shadow-inner"
             />
          </div>

          <div className="flex flex-col gap-3 max-h-[700px] overflow-y-auto pr-4 admin-scrollbar">
            {filteredItems.map(item => (
              <div 
                key={item._id}
                onClick={() => setSelectedId(item._id)}
                className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer group flex gap-5 relative overflow-hidden ${selectedId === item._id ? 'border-sky-500 bg-sky-500/5 shadow-md' : 'border-[color:var(--admin-border)] bg-[var(--admin-card)] hover:border-sky-500/40'}`}
              >
                {selectedId === item._id && <div className="absolute left-0 top-0 w-1 h-full bg-sky-500" />}
                
                <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-[var(--admin-bg)] border border-[color:var(--admin-border)] text-sky-500 group-hover:bg-sky-500/10 transition-all duration-300">
                  <Cpu size={24} strokeWidth={1.5} />
                </div>
                
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[8px] font-black uppercase tracking-widest text-sky-500">{item.tags?.[0] || "General"}</span>
                    <div className={`h-2 w-2 rounded-full ${item.isPublished ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-slate-700'}`} />
                  </div>
                  <p className="text-[11px] font-black text-[color:var(--admin-text-heading)] truncate uppercase tracking-wider">{item.title?.en || "Untitled Service"}</p>
                </div>
              </div>
            ))}
            {!loading && filteredItems.length === 0 && (
               <div className="py-20 text-center space-y-4 opacity-30">
                  <Briefcase size={32} className="mx-auto text-[color:var(--admin-text-muted)]" />
                  <p className="text-[9px] font-black uppercase tracking-widest">No services found</p>
               </div>
            )}
          </div>
        </div>

        <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[color:var(--admin-border)] pb-8">
            <div>
               <h3 className="text-2xl font-black text-[color:var(--admin-text-heading)] tracking-tight uppercase mb-1">{selectedId ? "Edit Service Details" : "Add New Service"}</h3>
               <p className="text-[10px] text-[color:var(--admin-text-muted)] font-bold uppercase tracking-widest">Fill in the details below to update your service offerings</p>
            </div>
            
            <div className="flex items-center gap-6 px-6 py-3 bg-[color:var(--admin-bg)] border border-[color:var(--admin-border)] rounded-2xl shadow-sm">
               <span className="text-[9px] font-black text-[color:var(--admin-text-muted)] uppercase tracking-widest">Visible on Site</span>
               <label className="flex items-center cursor-pointer scale-90">
                  <div className={`h-6 w-12 rounded-full transition-all duration-300 relative ${form.isPublished ? 'bg-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.3)]' : 'bg-slate-700'}`}>
                    <div className={`h-4 w-4 bg-white rounded-full absolute top-1 transition-all duration-300 ${form.isPublished ? 'left-7' : 'left-1'}`} />
                  </div>
                  <input type="checkbox" checked={form.isPublished} onChange={e => setForm({...form, isPublished: e.target.checked})} className="hidden" />
               </label>
            </div>
          </div>

          {/* Form Nodes */}
          <div className="grid gap-10">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <div className="flex justify-between items-center px-4">
                  <label className={labelClasses}><Type size={14} className="text-sky-500" /> Service Name (EN)</label>
                  <AutoTranslate text={form.titleEn} onTranslate={val => setForm({...form, titleBn: val})} />
                </div>
                <input value={form.titleEn} onChange={e => setForm({...form, titleEn: e.target.value})} className={inputClasses} placeholder="e.g. Structural Engineering" />
              </div>
              <div className="space-y-2 pt-10">
                <input value={form.titleBn} onChange={e => setForm({...form, titleBn: e.target.value})} className={inputClasses} placeholder="সার্ভিসের নাম (বাংলায়)" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <div className="flex justify-between items-center px-4">
                  <label className={labelClasses}><Layers size={14} className="text-sky-500" /> Service Description (EN)</label>
                  <AutoTranslate text={form.summaryEn} onTranslate={val => setForm({...form, summaryBn: val})} />
                </div>
                <textarea rows={6} value={form.summaryEn} onChange={e => setForm({...form, summaryEn: e.target.value})} className={`${inputClasses} resize-none mb-0 leading-relaxed`} placeholder="A brief overview of this service..." />
              </div>
              <div className="space-y-2 pt-10">
                <textarea rows={6} value={form.summaryBn} onChange={e => setForm({...form, summaryBn: e.target.value})} className={`${inputClasses} resize-none mb-0 leading-relaxed`} placeholder="সার্ভিসের বিবরণ (বাংলায়)..." />
              </div>
            </div>

            {/* Technical Node */}
            <div className="pt-4">
               <div className="bg-[var(--admin-bg)] border border-[color:var(--admin-border)] rounded-[32px] p-8 relative overflow-hidden group/tech shadow-sm">
                  <div className="flex items-center gap-6 mb-8">
                     <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-500">
                        <Settings size={20} strokeWidth={1.5} />
                     </div>
                     <div>
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-[color:var(--admin-text-heading)] mb-1">Service Icon & Link</h3>
                        <p className="text-[9px] text-[color:var(--admin-text-secondary)] font-bold uppercase tracking-widest">Configuration for UI and URL</p>
                     </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <label className={labelClasses}><Cpu size={14} className="text-sky-500" /> Icon Name</label>
                        <p className="text-[9px] text-[color:var(--admin-text-muted)] ml-4 mb-2 uppercase font-bold tracking-widest">Use Lucide names (e.g. Briefcase, Home)</p>
                        <input value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} className={inputClasses} placeholder="Briefcase" />
                     </div>
                     <div className="space-y-2">
                        <label className={labelClasses}><Sparkles size={14} className="text-sky-500" /> Service Link (Slug)</label>
                         <p className="text-[9px] text-[color:var(--admin-text-muted)] ml-4 mb-2 uppercase font-bold tracking-widest">Auto-generated or custom (e.g. building-design)</p>
                        <input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className={inputClasses} placeholder="structural-engineering" />
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </AdminModuleWrapper>
    </>
  );
}
