import { useState, useEffect } from "react";
import { Image as ImageIcon, Camera, Tag, Trash2, Plus, Type, Sparkles, Layers, Grid3X3, Search } from "lucide-react";
import { toast } from "sonner";
import { adminList, adminUpdate, adminCreate, adminDelete } from "../../../lib/api";
import AdminModuleWrapper from "./AdminModuleWrapper";
import AdminConfirm from "../../../components/admin/AdminConfirm";
import ImageUpload from "../../../components/admin/ImageUpload";
import AutoTranslate from "../../../components/admin/AutoTranslate";

export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({
    slug: "",
    titleEn: "",
    category: "Site Photo",
    featuredImageUrl: "",
    order: 0,
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const loadData = async () => {
    try {
      const response = await adminList("gallery", { limit: 100 });
      const fetchedItems = response.items || [];
      setItems(fetchedItems);
      if (fetchedItems.length > 0 && !selectedId) {
        setSelectedId(fetchedItems[0]._id);
      }
    } catch (err) {
      toast.error("Failed to load gallery items.");
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
          category: item.category || "Site Photo",
          featuredImageUrl: item.featuredImage?.url || "",
          order: item.order || 0,
        });
      }
    } else {
      setForm({ slug: "", titleEn: "", category: "Site Photo", featuredImageUrl: "", order: 0 });
    }
  }, [selectedId, items]);

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      slug: form.slug || `img-${Date.now()}`,
      title: { en: form.titleEn, bn: form.titleEn },
      category: form.category,
      featuredImage: form.featuredImageUrl ? { url: form.featuredImageUrl } : null,
      order: Number(form.order),
      isPublished: true,
    };

    try {
      if (selectedId) {
        await adminUpdate("gallery", selectedId, payload);
      } else {
        await adminCreate("gallery", payload);
      }
      
      toast.success("Photo saved successfully!");
    } catch (err) {
      console.error("[ADMIN_GALLERY_ERROR] Save Failure:", err);
      toast.error("Could not save photo. Please try again.");
    } finally { 
      setSaving(false); 
      await loadData();
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await adminDelete("gallery", selectedId);
      toast.success("Photo deleted successfully.");
      setSelectedId(null);
      await loadData();
    } catch (err) {
      console.error("[ADMIN_GALLERY_ERROR] Delete Failure:", err);
      toast.error("Failed to delete photo.");
    } finally { 
      setSaving(false); 
    }
  };

  const filteredItems = items.filter(item => 
    item.title?.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inputClasses = "w-full bg-[var(--admin-card)] border border-[color:var(--admin-border)] rounded-2xl px-7 py-5 text-[color:var(--admin-text-heading)] outline-none focus:border-sky-500 focus:bg-[var(--admin-card)] transition-all font-medium placeholder:text-[color:var(--admin-text-secondary)] shadow-sm text-sm";
  const labelClasses = "flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-[color:var(--admin-text-muted)] ml-4 mb-4";

  return (
    <>
      <AdminConfirm 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Photo"
        message="Are you sure you want to delete this photo permanently? This action cannot be undone."
      />
      <AdminModuleWrapper
        title="Photo Gallery"
        subtitle="Manage your project photos, site visits, and architectural renders."
        icon={ImageIcon}
        loading={loading}
        saving={saving}
        onSave={handleSave}
        onDelete={selectedId ? () => setIsConfirmOpen(true) : null}
        allowCreate={!!selectedId}
        onNew={() => setSelectedId(null)}
      >
      <div className="grid lg:grid-cols-[400px_1fr] gap-12">
        {/* Gallery Grid Sidebar */}
        <div className="space-y-6 flex flex-col">
          <div className="relative group">
             <Search size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-[color:var(--admin-text-muted)] group-focus-within:text-sky-500 transition-colors" />
             <input 
               placeholder="Search photos..." 
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
               className="w-full bg-[var(--admin-card)] border border-[color:var(--admin-border)] rounded-2xl pl-14 pr-6 py-4 text-[11px] font-bold uppercase tracking-widest text-[color:var(--admin-text-heading)] outline-none focus:border-sky-500 transition-all shadow-inner"
             />
          </div>

          <div className="flex flex-col gap-3 max-h-[700px] overflow-y-auto pr-2 admin-scrollbar">
            {filteredItems.map(item => (
              <div 
                key={item._id}
                onClick={() => setSelectedId(item._id)}
                className={`group flex items-center gap-4 p-3 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${selectedId === item._id ? 'border-sky-500 bg-sky-500/5 shadow-md' : 'border-[color:var(--admin-border)] hover:border-sky-500/40 hover:bg-white/5'}`}
              >
                <div className="h-16 w-16 rounded-xl overflow-hidden flex-shrink-0 border border-[color:var(--admin-border)]">
                  <img src={item.featuredImage?.url} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-[11px] text-[color:var(--admin-text-heading)] font-bold truncate uppercase tracking-wider mb-1">{item.title?.en || "Untitled Photo"}</p>
                   <div className="flex items-center gap-2">
                     <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-sky-500/10 text-sky-500 border border-sky-500/20">
                       {item.category}
                     </span>
                     <span className="text-[8px] font-bold text-[color:var(--admin-text-muted)] uppercase tracking-tighter opacity-50">Order: {item.order}</span>
                   </div>
                </div>
                <div className={`opacity-0 group-hover:opacity-100 transition-opacity ${selectedId === item._id ? 'opacity-100' : ''}`}>
                   <div className="h-6 w-6 rounded-full bg-sky-500 flex items-center justify-center text-white">
                      <Plus size={12} className={selectedId === item._id ? 'rotate-45' : ''} />
                   </div>
                </div>
              </div>
            ))}
            {!loading && filteredItems.length === 0 && (
               <div className="py-20 text-center space-y-4 opacity-30">
                  <Grid3X3 size={32} className="mx-auto text-[color:var(--admin-text-muted)]" />
                  <p className="text-[9px] font-black uppercase tracking-widest">No photos found</p>
               </div>
            )}
          </div>
        </div>

        {/* Editor Form */}
        <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[color:var(--admin-border)] pb-8">
            <div>
               <h3 className="text-2xl font-black text-[color:var(--admin-text-heading)] tracking-tight uppercase mb-1">{selectedId ? "Edit Photo Details" : "Add New Photo"}</h3>
               <p className="text-[10px] text-[color:var(--admin-text-muted)] font-bold uppercase tracking-widest">Fill in the information below to update your gallery</p>
            </div>
            
            {selectedId && (
              <div className="flex items-center gap-4 px-4 py-2 bg-sky-500/5 border border-sky-500/10 rounded-xl">
                 <span className="text-[9px] font-black text-sky-500 uppercase tracking-widest">ID: {selectedId.slice(-6)}</span>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className={labelClasses}><Type size={12} className="text-sky-500" /> Photo Title</label>
              <input value={form.titleEn} onChange={e => setForm({...form, titleEn: e.target.value})} className={inputClasses} placeholder="e.g. Site Foundation Work" />
            </div>
            <div className="space-y-2">
              <label className={labelClasses}><Tag size={12} className="text-sky-500" /> Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className={`${inputClasses} appearance-none cursor-pointer`}>
                 <option value="Site Photo">Site Photo</option>
                 <option value="Architectural Render">Architectural Render</option>
                 <option value="Structural Detail">Structural Detail</option>
                 <option value="Certification">Certification</option>
              </select>
            </div>
          </div>

          {/* Media Module */}
          <div className="pt-4">
             <div className="bg-[var(--admin-bg)] border border-[color:var(--admin-border)] rounded-[32px] p-8 relative overflow-hidden group/media shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                   <ImageIcon size={18} className="text-sky-500" />
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-[color:var(--admin-text-muted)]">Photo Preview & Upload</h3>
                </div>
                <ImageUpload value={form.featuredImageUrl} onChange={val => setForm({...form, featuredImageUrl: val})} label="Click to upload or drag photo here" />
             </div>
          </div>

          {/* Sort Order */}
          <div className="space-y-2 max-w-xs">
             <label className={labelClasses}><Plus size={12} className="text-sky-500" /> Display Order</label>
             <p className="text-[9px] text-[color:var(--admin-text-muted)] ml-4 mb-2 font-bold uppercase tracking-widest">Higher numbers appear first</p>
             <input type="number" value={form.order} onChange={e => setForm({...form, order: e.target.value})} className={inputClasses} />
          </div>
        </div>
      </div>
    </AdminModuleWrapper>
    </>
  );
}
