import { useEffect, useMemo, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import gsap from "gsap";
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Plus, 
  LogOut, 
  LayoutDashboard, 
  Globe, 
  ShieldAlert,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Search,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  Mail,
  RefreshCcw,
  Star,
  History,
  ChevronRight
} from "lucide-react";
import GlassCard from "../../components/GlassCard";
import ImageUpload from "../../components/admin/ImageUpload";
import { adminCreate, adminDelete, adminList, adminUpdate } from "../../lib/api";

const moduleConfig = {
  home: { label: "Landing Architecture", allowCreate: true, desc: "Global hero framework and initial landing professional standards.", icon: LayoutDashboard },
  about: { label: "Professional Profile", allowCreate: true, desc: "Technical background, core mission, and mission assets.", icon: FileText },
  services: { label: "Service Catalog", allowCreate: true, desc: "Engineering packages and architectural consultancy definitions.", icon: Settings },
  projects: { label: "Project Registry", allowCreate: true, desc: "High-performance case studies and structural delivery logs.", icon: Globe },
  testimonials: { label: "Client Heritage", allowCreate: true, desc: "Industry-standard feedback and professional client reviews.", icon: MessageSquare },
  gallery: { label: "Visual Archive", allowCreate: true, desc: "Structural renders and project photography laboratory.", icon: ImageIcon },
  contactDetails: { label: "Contact Infrastructure", allowCreate: true, desc: "Communication hubs and geographic coordination data.", icon: Mail },
  seoMeta: { label: "Search Visibility", allowCreate: true, desc: "Global search presence and metadata optimization standards.", icon: Search },
  contactSubmissions: { label: "Client Inquiries", allowCreate: false, desc: "Professional project inquiries and communication logs.", icon: AlertTriangle },
};

const baseForm = {
  slug: "",
  pagePath: "",
  titleEn: "",
  titleBn: "",
  summaryEn: "",
  summaryBn: "",
  bodyEn: "",
  bodyBn: "",
  category: "civil_engineering",
  tags: "",
  order: 0,
  rating: 5,
  isPublished: true,
  featuredImageUrl: "",
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
  seoTitleEn: "",
  seoTitleBn: "",
  seoDescriptionEn: "",
  seoDescriptionBn: "",
  canonicalUrl: "",
  ogImage: "",
  twitterImage: "",
  jsonLd: "{}",
  status: "new",
};

function mapItemToForm(item) {
  return {
    ...baseForm,
    slug: item.slug || "",
    pagePath: item.pagePath || "",
    titleEn: item.title?.en || "",
    titleBn: item.title?.bn || "",
    summaryEn: item.summary?.en || "",
    summaryBn: item.summary?.bn || "",
    bodyEn: item.body?.en || "",
    bodyBn: item.body?.bn || "",
    category: item.category || "civil_engineering",
    tags: Array.isArray(item.tags) ? item.tags.join(", ") : "",
    order: item.order || 0,
    rating: item.rating || 5,
    isPublished: item.isPublished ?? true,
    featuredImageUrl: item.featuredImage?.url || "",
    phone: item.phone || "",
    email: item.email || "",
    whatsapp: item.whatsapp || "",
    whatsappEnabled: item.whatsappEnabled ?? true,
    whatsappLabel: item.whatsappLabel || "WhatsApp Chat",
    addressEn: item.address?.en || "",
    addressBn: item.address?.bn || "",
    googleMapEmbedUrl: item.googleMapEmbedUrl || "",
    facebook: item.socialLinks?.facebook || "",
    linkedin: item.socialLinks?.linkedin || "" ,
    youtube: item.socialLinks?.youtube || "",
    seoTitleEn: item.seo?.title?.en || "",
    seoTitleBn: item.seo?.title?.bn || "",
    seoDescriptionEn: item.seo?.description?.en || "",
    seoDescriptionBn: item.seo?.description?.bn || "",
    canonicalUrl: item.seo?.canonicalUrl || "",
    ogImage: item.seo?.ogImage || "",
    twitterImage: item.seo?.twitterImage || "",
    jsonLd: item.seo?.jsonLd ? JSON.stringify(item.seo.jsonLd, null, 2) : "{}",
    status: item.status || "new",
  };
}

function buildPayload(form, type) {
  let jsonLd = {};
  try {
    jsonLd = form.jsonLd ? JSON.parse(form.jsonLd) : {};
  } catch {
    jsonLd = {};
  }

  const seo = {
    title: { en: form.seoTitleEn, bn: form.seoTitleBn },
    description: { en: form.seoDescriptionEn, bn: form.seoDescriptionBn },
    canonicalUrl: form.canonicalUrl,
    ogImage: form.ogImage || form.featuredImageUrl,
    twitterImage: form.twitterImage || form.featuredImageUrl,
    jsonLd,
  };

  const featuredImage = form.featuredImageUrl ? { 
    url: form.featuredImageUrl, 
    alt: { en: form.titleEn, bn: form.titleBn } 
  } : null;

  if (type === "contactDetails") {
    return {
      slug: form.slug || "primary",
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
      seo,
      isPublished: form.isPublished,
    };
  }

  if (type === "seoMeta") {
    return {
      slug: form.slug,
      pagePath: form.pagePath || "/",
      seo,
      isPublished: form.isPublished,
    };
  }

  if (type === "contactSubmissions") {
    return { status: form.status };
  }

  return {
    slug: form.slug,
    title: { en: form.titleEn, bn: form.titleBn },
    summary: { en: form.summaryEn, bn: form.summaryBn },
    body: { en: form.bodyEn, bn: form.bodyBn },
    category: form.category,
    featuredImage,
    tags: form.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    order: Number(form.order || 0),
    rating: Number(form.rating || 5),
    isPublished: form.isPublished,
    seo,
  };
}

export default function AdminContentPage() {
  const { type } = useParams();
  const navigate = useNavigate();
  const config = moduleConfig[type];
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [selectedId, setSelectedId] = useState("");
  const [form, setForm] = useState(baseForm);

  useEffect(() => {
    if (!config) {
      navigate("/admin/dashboard", { replace: true });
      return;
    }

    let ignore = false;
    async function loadData() {
      setLoading(true);
      setStatus({ type: "", message: "" });
      try {
        const response = await adminList(type, { limit: 100 });
        if (!ignore) setItems(response.items || []);
      } catch {
        if (!ignore) setStatus({ type: "error", message: "LOAD_ERROR: RE-LOGIN REQUIRED" });
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadData();
    return () => { ignore = true; };
  }, [type, config, navigate]);

  const selectedItem = useMemo(() => items.find((item) => item._id === selectedId), [items, selectedId]);

  useEffect(() => {
    setForm(selectedItem ? mapItemToForm(selectedItem) : baseForm);
  }, [selectedItem, type]);

  const onChange = (field) => (val) => {
    const value = val?.target ? (val.target.type === "checkbox" ? val.target.checked : val.target.value) : val;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const reload = async () => {
    const response = await adminList(type, { limit: 100 });
    setItems(response.items || []);
  };

  const onSubmit = async (event) => {
    if (event) event.preventDefault();
    setSaving(true);
    setStatus({ type: "", message: "" });

    try {
      const payload = buildPayload(form, type);
      if (selectedId) {
        await adminUpdate(type, selectedId, payload);
        setStatus({ type: "success", message: "UPDATE_APPLIED" });
      } else {
        await adminCreate(type, payload);
        setStatus({ type: "success", message: "NEW_RECORD_INITIALIZED" });
      }
      await reload();
      setSelectedId("");
    } catch {
      setStatus({ type: "error", message: "COMMIT_FAILED" });
    } finally {
      setSaving(false);
    }
  };

  const onDeleteItem = async (itemId) => {
    if (!window.confirm("PERMANENTLY ERASE THIS NODE?")) return;
    setSaving(true);
    try {
      await adminDelete(type, itemId);
      setStatus({ type: "success", message: "RECORD_DESTROYED" });
      await reload();
      if (selectedId === itemId) setSelectedId("");
    } catch {
      setStatus({ type: "error", message: "DELETE_FAILED" });
    } finally {
      setSaving(false);
    }
  };

  const onStatusUpdate = async (itemId, nextStatus) => {
    try {
      await adminUpdate(type, itemId, { status: nextStatus });
      await reload();
    } catch {
      setStatus({ type: "error", message: "STATUS_UPDATE_FAILED" });
    }
  };

  if (!config) return null;

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      {/* 1. Module Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
        <div className="flex items-center gap-6">
          <div className="h-12 w-12 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
            <config.icon size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-1 italic">
              <History size={10} />
              <span>Registry Hub</span>
              <ChevronRight size={10} />
              <span className="text-[#19D2FF]/60">{type}</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">{config.label}</h2>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => { setSelectedId(""); setForm(baseForm); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-sky-500 text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
          >
            <Plus size={14} strokeWidth={3} />
            Initialize Record
          </button>
        </div>
      </div>

      {/* 2. Status Notifications */}
      {status.message && (
        <div className={`mx-4 rounded-xl border p-4 backdrop-blur-3xl animate-in slide-in-from-top-2 ${
          status.type === 'error' ? 'border-red-500/20 bg-red-500/5 text-red-500' : 'border-sky-200 bg-sky-50 text-sky-600'
        }`}>
          <div className="flex items-center justify-center gap-4 font-black text-[10px] uppercase tracking-widest italic font-bold">
            {status.type === 'error' ? <ShieldAlert size={16} /> : <CheckCircle2 size={16} />}
            {status.message}
          </div>
        </div>
      )}

      {/* 3. CRUD Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-10 items-start">
        {/* Left Side: Asset List */}
        <div className="space-y-6">
          <div className="admin-card p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Structural Inventory</p>
              <button onClick={reload} className="text-slate-600 hover:text-sky-600 transition-colors"><RefreshCcw size={14} className={loading ? 'animate-spin' : ''} /></button>
            </div>
            
            <div className="space-y-3 max-h-[70vh] overflow-y-auto admin-scrollbar pr-2">
              {loading ? (
                <div className="py-20 text-center"><Loader2 className="animate-spin text-sky-600 mx-auto mb-4" /><p className="text-[10px] text-slate-600 uppercase tracking-widest">Scanning...</p></div>
              ) : items.map((item) => (
                <div 
                  key={item._id}
                  onClick={() => setSelectedId(item._id)}
                  className={`p-5 rounded-xl border cursor-pointer transition-all duration-300 ${
                    selectedId === item._id 
                    ? 'bg-sky-50 border-[#19D2FF]/40 shadow-lg' 
                    : 'bg-white/[0.01] border-slate-200 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className={`text-sm font-bold italic truncate ${selectedId === item._id ? 'text-slate-900' : 'text-slate-600'}`}>
                        {item.title?.en || item.slug || item.name || "Untitled Asset"}
                      </p>
                      <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest mt-1">
                        {item.category || item.status || 'Standard Block'}
                      </p>
                    </div>
                    {item.isPublished && <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />}
                  </div>
                </div>
              ))}
              {!loading && items.length === 0 && (
                <div className="py-20 text-center text-slate-800 text-[10px] uppercase font-bold tracking-widest">Empty Registry</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Form / Editor */}
        <div className="min-w-0">
          <div className="admin-card p-8 md:p-12 relative overflow-hidden">
             <div className="absolute top-0 right-0 h-1.5 w-40 bg-gradient-to-l from-[#19D2FF]/20 to-transparent" />
             
             {type === "contactSubmissions" ? (
               <div className="space-y-10">
                 <h3 className="text-xl font-black text-slate-900 italic uppercase tracking-tighter">Communication Records</h3>
                 <div className="grid gap-6">
                    {items.map((sub) => (
                      <div key={sub._id} className="p-8 bg-slate-50 border border-slate-200 rounded-2xl space-y-6">
                        <div className="flex flex-col md:flex-row justify-between gap-6">
                          <div>
                            <h4 className="text-lg font-black text-slate-900 italic">{sub.name}</h4>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{sub.email} // {sub.phone}</p>
                          </div>
                          <div className="flex gap-2">
                             {['new', 'seen', 'resolved'].map(s => (
                               <button 
                                key={s}
                                onClick={() => onStatusUpdate(sub._id, s)}
                                className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${sub.status === s ? 'bg-sky-500 text-black' : 'text-slate-600 hover:text-slate-800 bg-slate-50'}`}
                               >
                                 {s}
                               </button>
                             ))}
                          </div>
                        </div>
                        <div className="p-6 bg-black/40 rounded-xl border border-white/5 text-slate-600 italic text-sm leading-relaxed">
                          "{sub.message}"
                        </div>
                        <div className="flex justify-end">
                           <button onClick={() => onDeleteItem(sub._id)} className="text-red-500/40 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    ))}
                 </div>
               </div>
             ) : (
               <form onSubmit={onSubmit} className="space-y-12">
                 {/* Header Info */}
                 <div className="flex justify-between items-center pb-6 border-b border-slate-200">
                    <p className="text-[10px] font-black text-sky-600 uppercase tracking-[0.4em] italic leading-none">
                      {selectedId ? 'Modify Existing Asset' : 'Initialize New Record'}
                    </p>
                    {selectedId && <span className="text-[8px] font-bold text-slate-800 uppercase tracking-widest">ID: {selectedId.slice(-8)}</span>}
                 </div>

                 {/* 2-Column Grid for basic fields */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Asset ID (Slug)</label>
                     <input value={form.slug} onChange={onChange("slug")} required={type !== "contactDetails"} className="admin-input w-full" placeholder="url-friendly-id" />
                   </div>
                   {type === "seoMeta" ? (
                     <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Routepath</label>
                       <input value={form.pagePath} onChange={onChange("pagePath")} className="admin-input w-full" placeholder="/example" />
                     </div>
                   ) : (
                     <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Category</label>
                       <input value={form.category} onChange={onChange("category")} className="admin-input w-full" placeholder="Engineering Sector" />
                     </div>
                   )}
                 </div>

                 {type !== "contactDetails" && type !== "seoMeta" && (
                   <div className="space-y-12">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-3">
                         <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Title (EN)</label>
                         <input value={form.titleEn} onChange={onChange("titleEn")} className="admin-input w-full" />
                       </div>
                       <div className="space-y-3">
                         <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Title (BN)</label>
                         <input value={form.titleBn} onChange={onChange("titleBn")} className="admin-input w-full" />
                       </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-3">
                         <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Summary (EN)</label>
                         <textarea rows={3} value={form.summaryEn} onChange={onChange("summaryEn")} className="admin-input w-full resize-none" />
                       </div>
                       <div className="space-y-3">
                         <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Summary (BN)</label>
                         <textarea rows={3} value={form.summaryBn} onChange={onChange("summaryBn")} className="admin-input w-full resize-none" />
                       </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-3">
                         <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Full Description (EN)</label>
                         <textarea rows={8} value={form.bodyEn} onChange={onChange("bodyEn")} className="admin-input w-full admin-scrollbar" />
                       </div>
                       <div className="space-y-3">
                         <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Full Description (BN)</label>
                         <textarea rows={8} value={form.bodyBn} onChange={onChange("bodyBn")} className="admin-input w-full admin-scrollbar" />
                       </div>
                     </div>

                     <div className="space-y-3">
                         <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Featured Asset Media</label>
                         <div className="p-8 border-2 border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                            <ImageUpload value={form.featuredImageUrl} onChange={onChange("featuredImageUrl")} label="Thumbnail" />
                         </div>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                       <div className="space-y-3">
                         <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Tags</label>
                         <input value={form.tags} onChange={onChange("tags")} className="admin-input w-full text-[10px]" placeholder="tag1, tag2" />
                       </div>
                       <div className="space-y-3">
                         <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Priority Order</label>
                         <input type="number" value={form.order} onChange={onChange("order")} className="admin-input w-full" />
                       </div>
                       <div className="space-y-3">
                         <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Quality Rating</label>
                         <input type="number" min="1" max="5" value={form.rating} onChange={onChange("rating")} className="admin-input w-full" />
                       </div>
                     </div>
                   </div>
                 )}

                 {type === "contactDetails" && (
                   <div className="space-y-12">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-3">
                         <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Phone</label>
                         <input value={form.phone} onChange={onChange("phone")} className="admin-input w-full" />
                       </div>
                       <div className="space-y-3">
                         <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Email</label>
                         <input value={form.email} onChange={onChange("email")} className="admin-input w-full" />
                       </div>
                     </div>
                     {/* ... Add other contact fields in 2c or 1c as appropriate ... */}
                   </div>
                 )}

                 {/* SEO Section */}
                 <div className="pt-10 border-t border-slate-200 space-y-10">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <Globe size={14} className="text-sky-600" />
                          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Search Visibility Control</h4>
                       </div>
                       <label className="flex items-center gap-3 cursor-pointer group">
                         <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest group-hover:text-slate-400 trasition-colors">Live Production</span>
                         <div className={`w-12 h-6 rounded-full relative transition-all duration-300 ${form.isPublished ? 'bg-sky-500' : 'bg-slate-800'}`}>
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${form.isPublished ? 'left-7' : 'left-1'}`} />
                         </div>
                         <input type="checkbox" checked={form.isPublished} onChange={onChange("isPublished")} className="hidden" />
                       </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-3">
                         <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">SEO Title (EN)</label>
                         <input value={form.seoTitleEn} onChange={onChange("seoTitleEn")} className="admin-input w-full" />
                       </div>
                       <div className="space-y-3">
                         <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">SEO Title (BN)</label>
                         <input value={form.seoTitleBn} onChange={onChange("seoTitleBn")} className="admin-input w-full" />
                       </div>
                    </div>
                 </div>

                 <div className="flex justify-between md:items-center border-t border-slate-200 pt-10 gap-6">
                    <div className="flex gap-4 w-full md:w-auto">
                       <button 
                        type="submit" 
                        disabled={saving}
                        className="flex-1 md:flex-none flex items-center justify-center gap-3 px-12 py-4 bg-sky-500 text-black rounded-xl font-black text-[12px] uppercase tracking-[0.1em] hover:scale-105 active:scale-95 transition-all shadow-[0_0_24px_rgba(25,210,255,0.2)] disabled:opacity-50"
                       >
                         {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} strokeWidth={2.5} />}
                         {saving ? 'SYNCHRONIZING...' : selectedId ? 'EXECUTE UPDATE' : 'COMMIT NEW RECORD'}
                       </button>
                    </div>
                    {selectedId && (
                      <button type="button" onClick={() => onDeleteItem(selectedId)} className="text-[10px] font-black text-red-500/40 hover:text-red-500 uppercase tracking-widest border-b border-transparent hover:border-red-500/20 transition-all pb-1 italic">
                        Permanent_Destruction
                      </button>
                    )}
                 </div>
               </form>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
