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
  Star
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
  const containerRef = useRef(null);

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
        if (!ignore) {
          setItems(response.items || []);
        }
      } catch {
        if (!ignore) {
          setStatus({ type: "error", message: "LOAD_ERROR: RE-LOGIN REQUIRED" });
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadData();
    return () => {
      ignore = true;
    };
  }, [type, config, navigate]);

  useEffect(() => {
    gsap.from(".admin-reveal", {
      opacity: 0,
      y: 10,
      duration: 0.6,
      stagger: 0.04,
      ease: "power2.out"
    });
  }, [loading, type]);

  const selectedItem = useMemo(() => items.find((item) => item._id === selectedId), [items, selectedId]);

  useEffect(() => {
    if (selectedItem) {
      setForm(mapItemToForm(selectedItem));
    } else {
      setForm(baseForm);
    }
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
    event.preventDefault();
    setSaving(true);
    setStatus({ type: "", message: "" });

    try {
      const payload = buildPayload(form, type);
      if (selectedId) {
        await adminUpdate(type, selectedId, payload);
        setStatus({ type: "success", message: "COMMIT_SUCCESS: UPDATE_APPLIED" });
      } else {
        await adminCreate(type, payload);
        setStatus({ type: "success", message: "COMMIT_SUCCESS: NEW_RECORD_INITIALIZED" });
      }
      await reload();
      setSelectedId("");
      setForm(baseForm);
    } catch {
      setStatus({ type: "error", message: "COMMIT_FAILED: VALIDATION_ERROR" });
    } finally {
      setSaving(false);
    }
  };

  const onDeleteItem = async (itemId) => {
    const ok = window.confirm("DESTROY RECORD: PERMANENT DELETION?");
    if (!ok) return;

    setSaving(true);
    setStatus({ type: "", message: "" });
    try {
      await adminDelete(type, itemId);
      setStatus({ type: "success", message: "COMMIT_SUCCESS: RECORD_DESTROYED" });
      await reload();
      if (selectedId === itemId) {
        setSelectedId("");
        setForm(baseForm);
      }
    } catch {
      setStatus({ type: "error", message: "COMMIT_FAILED: PERMISSION_DENIED" });
    } finally {
      setSaving(false);
    }
  };

  const onStatusUpdate = async (itemId, nextStatus) => {
    try {
      await adminUpdate(type, itemId, { status: nextStatus });
      await reload();
      setStatus({ type: "info", message: "STATUS_UPDATE: " + nextStatus.toUpperCase() });
    } catch {
      setStatus({ type: "error", message: "STATUS_UPDATE: FAILED" });
    }
  };

  if (!config) return null;

  const Icon = config.icon;

  return (
    <div ref={containerRef} className="mx-auto mt-8 md:mt-12 max-w-[1600px] px-4 md:px-8 pb-32">
      <header className="admin-reveal mb-8 md:mb-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-10 md:gap-12 rounded-[32px] md:rounded-[56px] border border-white/5 bg-[#080808]/80 p-8 md:p-20 shadow-[0_80px_160px_rgba(0,0,0,0.8)] backdrop-blur-3xl">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
          <div className="h-16 w-16 md:h-20 md:w-20 rounded-[24px] md:rounded-[28px] border border-white/5 bg-white/2 flex items-center justify-center text-cyan-400 group relative">
            <Icon size={32} />
            <div className="absolute -inset-4 bg-cyan-400/5 rounded-[32px] blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-4">
              <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#00d2ff]" />
              <p className="font-display text-[9px] md:text-[11px] tracking-[0.5em] text-cyan-400 uppercase font-bold italic">Registry Editor · {type}</p>
            </div>
            <h1 className="mt-3 md:mt-4 text-3xl md:text-5xl font-bold text-white tracking-tighter leading-tight italic uppercase">{config.label}</h1>
            <p className="mt-3 md:mt-4 text-[9px] md:text-[11px] text-[#444] uppercase tracking-[0.3em] md:tracking-[0.4em] font-bold italic">{config.desc}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 md:gap-8 w-full md:w-auto">
          <Link to="/admin/dashboard" className="flex items-center justify-center gap-4 flex-1 md:flex-none px-8 md:px-12 py-4 md:py-6 rounded-[20px] md:rounded-[28px] border border-white/5 bg-white/2 font-display text-[9px] md:text-[11px] font-bold text-cyan-400 uppercase tracking-widest hover:bg-white/10 transition-all italic group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Dashboard
          </Link>
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("adminAccessToken");
              localStorage.removeItem("adminRefreshToken");
              navigate("/admin", { replace: true });
            }}
            className="flex items-center justify-center gap-4 flex-1 md:flex-none px-8 md:px-12 py-4 md:py-6 rounded-[20px] md:rounded-[28px] border border-rose-500/20 bg-rose-500/5 font-display text-[9px] md:text-[11px] font-bold text-rose-400 uppercase tracking-widest hover:bg-rose-500/10 transition-all italic group"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </header>

      {status.message && (
        <div className={`admin-reveal mb-8 md:mb-12 overflow-hidden rounded-[24px] md:rounded-[32px] border p-6 md:p-8 text-center shadow-2xl transition-all ${
          status.type === 'error' ? 'border-rose-500/20 bg-rose-500/5 text-rose-500' : 'border-cyan-400/20 bg-cyan-400/5 text-cyan-400'
        }`}>
          <div className="flex items-center justify-center gap-4">
            {status.type === 'error' ? <ShieldAlert size={18} /> : <CheckCircle2 size={18} />}
            <p className="font-display text-[9px] md:text-[11px] font-bold uppercase tracking-[0.5em] md:tracking-[0.6em] italic">{status.message.replace(/_/g, " ")}</p>
          </div>
        </div>
      )}

      <div className="grid gap-8 md:gap-12 grid-cols-1 lg:grid-cols-[420px_minmax(0,1fr)]">
        <aside className="admin-reveal space-y-8 md:space-y-12">
          <GlassCard className="p-8 md:p-12 shadow-2xl rounded-[32px] md:rounded-[48px]">
            <div className="mb-8 md:mb-12 flex items-center justify-between border-b border-white/5 pb-8 md:pb-10 text-left">
              <div className="space-y-2 md:space-y-4">
                 <p className="font-display text-[9px] md:text-[11px] tracking-[0.4em] text-[#333] uppercase font-bold italic">Registry Index</p>
                 <p className="text-lg md:text-xl font-bold text-white italic">{items.length} Structural Assets</p>
              </div>
              <button onClick={reload} className="text-cyan-400/40 hover:text-cyan-400 transition-colors">
                <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
            
            {loading ? (
              <div className="flex flex-col items-center gap-6 py-16 md:py-24 text-[#333] font-display text-[10px] md:text-[11px] uppercase tracking-widest font-bold">
                <Loader2 className="animate-spin text-cyan-400" size={32} />
                Synchronizing Assets...
              </div>
            ) : (
              <div className="max-h-[50vh] lg:max-h-[75vh] space-y-4 md:space-y-6 overflow-y-auto pr-2 md:pr-4 custom-scrollbar text-left font-medium">
                {items.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => setSelectedId(item._id)}
                    className={`group relative cursor-pointer rounded-[24px] md:rounded-[32px] border p-6 md:p-8 transition-all duration-700 ${
                      selectedId === item._id
                        ? "border-cyan-500/40 bg-cyan-500/5 shadow-[0_30px_60px_rgba(6,182,212,0.1)]"
                        : "border-white/5 bg-white/1 hover:border-white/10 hover:bg-white/2"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 pr-4 md:pr-6">
                        <p className={`truncate text-base md:text-lg font-bold transition-colors ${selectedId === item._id ? "text-cyan-400" : "text-slate-300"} italic`}>
                          {item.title?.en || item.slug || item.name || item.email || "Untitled Asset"}
                        </p>
                        <div className="mt-3 md:mt-4 flex items-center gap-3 md:gap-4">
                           <span className="text-[8px] md:text-[10px] text-slate-800 uppercase tracking-[0.2em] font-bold italic">
                             {item.category || item.pagePath || item.status || "General Block"}
                           </span>
                           {item.isPublished && <div className="h-1 w-1 md:h-1.5 md:w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onDeleteItem(item._id); }}
                        className="opacity-100 md:opacity-0 group-hover:opacity-100 h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-xl md:rounded-2xl border border-rose-500/20 bg-rose-500/5 text-rose-500 hover:bg-rose-500/20 transition-all font-bold"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {!loading && items.length === 0 ? (
                  <div className="py-16 md:py-24 text-center space-y-6">
                     <p className="font-display text-[10px] md:text-[11px] text-slate-900 uppercase tracking-widest font-bold italic">No Assets Found</p>
                  </div>
                ) : null}
              </div>
            )}
            
            {config.allowCreate && (
              <button
                onClick={() => { setSelectedId(""); setForm(baseForm); }}
                className="mt-8 md:mt-12 w-full group relative overflow-hidden rounded-[24px] md:rounded-[32px] border border-cyan-400/20 bg-cyan-400/5 py-5 md:py-7 font-display text-[9px] md:text-[11px] font-bold text-cyan-400 uppercase tracking-[0.4em] transition-all hover:bg-cyan-400/10 hover:border-cyan-400/40 italic shadow-[0_0_20px_rgba(0,210,255,0.05)] flex items-center justify-center gap-3"
              >
                <Plus size={16} />
                <span className="relative z-10 uppercase font-black">Initialize New Asset</span>
              </button>
            )}
          </GlassCard>
        </aside>

        <section className="admin-reveal min-w-0">
          <GlassCard className="relative overflow-hidden p-8 md:p-24 shadow-[0_80px_200px_rgba(0,0,0,1)] text-left rounded-[32px] md:rounded-[80px]">
            <div className="absolute top-0 right-0 h-1.5 md:h-2 w-40 md:w-60 bg-cyan-500 opacity-60 flex items-center justify-center">
              <div className="h-1 w-1 rounded-full bg-white opacity-40 animate-ping" />
            </div>
            
            {type === "contactSubmissions" ? (
              <div className="space-y-12 md:space-y-16">
                <div className="mb-8 md:mb-14">
                   <p className="font-display text-[9px] md:text-[11px] tracking-[0.4em] md:tracking-[0.6em] text-cyan-400 uppercase font-bold italic mb-4 md:mb-6">Transmission Records</p>
                   <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tighter leading-tight italic">Client Communications</h2>
                </div>
                
                <div className="space-y-8 md:space-y-12">
                  {items.map((item) => (
                    <article key={item._id} className="group relative rounded-[32px] md:rounded-[48px] border border-white/5 bg-white/2 p-6 md:p-12 transition-all hover:border-cyan-400/20 duration-700 shadow-xl">
                      <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
                        <div className="space-y-3 md:space-y-4">
                          <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight italic uppercase">{item.name}</h3>
                          <p className="text-[9px] md:text-[11px] text-[#444] font-display tracking-widest uppercase font-bold italic">{item.email} • {item.phone}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 md:gap-4 bg-black/60 p-2 md:p-3 rounded-[18px] md:rounded-[24px] border border-white/5">
                          {["new", "seen", "resolved"].map((s) => (
                            <button
                              key={s}
                              onClick={() => onStatusUpdate(item._id, s)}
                              className={`rounded-[12px] md:rounded-[18px] px-4 md:px-8 py-2 md:py-3 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] transition-all italic ${
                                item.status === s 
                                  ? "bg-cyan-600 text-black shadow-[0_0_15px_rgba(0,210,255,0.3)]"
                                  : "text-[#666] hover:text-[#888]"
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="relative">
                         <div className="absolute -left-4 md:-left-8 top-0 bottom-0 w-1 md:w-1.5 bg-cyan-400/10 rounded-full" />
                         <div className="bg-black/40 p-6 md:p-10 rounded-[24px] md:rounded-[32px] border border-white/5 italic font-medium leading-relaxed text-[#888] text-base md:text-lg">
                            <span className="text-cyan-400 opacity-40 text-2xl md:text-4xl font-serif mr-2 md:mr-4">“</span>
                            {item.message}
                            <span className="text-cyan-400 opacity-40 text-2xl md:text-4xl font-serif ml-2 md:ml-4">”</span>
                         </div>
                      </div>
                      <div className="mt-8 md:mt-12 flex justify-end border-t border-white/5 pt-8 md:pt-10">
                        <button
                          onClick={() => onDeleteItem(item._id)}
                          className="px-6 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl border border-rose-500/20 text-[9px] md:text-[10px] font-bold text-rose-500 uppercase tracking-widest hover:bg-rose-500/10 transition-all font-display italic flex items-center gap-3"
                        >
                          <Trash2 size={14} />
                          Destroy Record
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-12 md:space-y-16">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-8 md:pb-12 gap-8">
                  <div className="text-left">
                    <p className="font-display text-[9px] md:text-[11px] tracking-[0.4em] md:tracking-[0.6em] text-cyan-400 uppercase font-bold italic mb-4 md:mb-6">Asset Intelligence Hub</p>
                    <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tighter leading-tight italic uppercase">
                      {selectedId ? "Configure Unit" : "Initialize New Record"}
                    </h2>
                  </div>
                  {selectedId && (
                    <div className="md:text-right">
                       <p className="font-display text-[8px] md:text-[10px] text-slate-900 uppercase tracking-widest font-bold mb-1 md:mb-2 italic">Record Hash</p>
                       <p className="font-display text-[9px] md:text-[11px] text-slate-800 uppercase italic">{selectedId.slice(-12)}</p>
                    </div>
                  )}
                </div>

                <div className="grid gap-x-12 gap-y-8 md:gap-x-16 md:gap-y-12 md:grid-cols-2 text-left">
                  <div className="space-y-4 md:space-y-5">
                    <label className="text-[9px] md:text-[11px] font-bold text-slate-700 uppercase tracking-[0.3em] md:tracking-[0.4em] ml-2 italic text-left">Unique Identifier (Slug)</label>
                    <input value={form.slug} onChange={onChange("slug")} required={type !== "contactDetails"} className="w-full rounded-[20px] md:rounded-[28px] border border-white/5 bg-zinc-950/40 px-6 md:px-8 py-5 md:py-6 text-white outline-none focus:border-cyan-500/40 font-bold italic shadow-inner" placeholder="URL-IDENTIFIER" />
                  </div>
                  {type === "seoMeta" ? (
                    <div className="space-y-4 md:space-y-5">
                      <label className="text-[9px] md:text-[11px] font-bold text-slate-700 uppercase tracking-[0.3em] md:tracking-[0.4em] ml-2 italic">Route Registration</label>
                      <input value={form.pagePath} onChange={onChange("pagePath")} className="w-full rounded-[20px] md:rounded-[28px] border border-white/5 bg-zinc-950/40 px-6 md:px-8 py-5 md:py-6 text-white outline-none focus:border-cyan-500/40 font-bold italic shadow-inner" placeholder="/path/to/resource" />
                    </div>
                  ) : (
                    <div className="space-y-4 md:space-y-5">
                      <label className="text-[9px] md:text-[11px] font-bold text-slate-700 uppercase tracking-[0.3em] md:tracking-[0.4em] ml-2 italic text-left">Record Category</label>
                      <input value={form.category} onChange={onChange("category")} className="w-full rounded-[20px] md:rounded-[28px] border border-white/5 bg-zinc-950/40 px-6 md:px-8 py-5 md:py-6 text-white outline-none focus:border-cyan-500/40 font-bold italic shadow-inner" placeholder="Engineering Sector" />
                    </div>
                  )}
                </div>

                {type !== "contactDetails" && type !== "seoMeta" && (
                  <div className="space-y-12 animate-in fade-in duration-700">
                    <div className="grid gap-10 md:grid-cols-2">
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] ml-1">Primary_Annotation (EN)</label>
                        <input value={form.titleEn} onChange={onChange("titleEn")} className="w-full rounded-[20px] border-2 border-white/5 bg-black/40 px-6 py-5 text-white outline-none focus:border-cyan-400/40 font-bold" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] ml-1">Primary_Annotation (BN)</label>
                        <input value={form.titleBn} onChange={onChange("titleBn")} className="w-full rounded-[20px] border-2 border-white/5 bg-black/40 px-6 py-5 text-white outline-none focus:border-cyan-400/40 font-bold" />
                      </div>
                    </div>

                    <div className="grid gap-10 md:grid-cols-2">
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] ml-1">Brief_Abstract (EN)</label>
                        <textarea rows={4} value={form.summaryEn} onChange={onChange("summaryEn")} className="w-full rounded-[24px] border-2 border-white/5 bg-black/40 px-6 py-5 text-white outline-none focus:border-cyan-400/40 resize-none font-medium" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] ml-1">Brief_Abstract (BN)</label>
                        <textarea rows={4} value={form.summaryBn} onChange={onChange("summaryBn")} className="w-full rounded-[24px] border-2 border-white/5 bg-black/40 px-6 py-5 text-white outline-none focus:border-cyan-400/40 resize-none font-medium" />
                      </div>
                    </div>

                    <div className="grid gap-10 md:grid-cols-2">
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] ml-1">Technical_Specification (EN)</label>
                        <textarea rows={10} value={form.bodyEn} onChange={onChange("bodyEn")} className="w-full rounded-[32px] border-2 border-white/5 bg-black/40 px-8 py-7 text-white outline-none focus:border-cyan-400/40 custom-scrollbar font-sans leading-relaxed" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] ml-1">Technical_Specification (BN)</label>
                        <textarea rows={10} value={form.bodyBn} onChange={onChange("bodyBn")} className="w-full rounded-[32px] border-2 border-white/5 bg-black/40 px-8 py-7 text-white outline-none focus:border-cyan-400/40 custom-scrollbar font-sans leading-relaxed" />
                      </div>
                    </div>

                    {(type === "projects" || type === "services" || type === "gallery" || type === "home" || type === "about") && (
                      <div className="bg-white/2 p-10 rounded-[40px] border border-white/5">
                        <ImageUpload 
                          value={form.featuredImageUrl} 
                          onChange={onChange("featuredImageUrl")} 
                          label="Featured_Structural_Media"
                        />
                      </div>
                    )}

                    <div className="grid gap-10 md:grid-cols-3 bg-white/2 p-10 rounded-[40px] border border-white/5">
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] ml-1">Indexing_Tags</label>
                        <input value={form.tags} onChange={onChange("tags")} placeholder="structural, architectural" className="w-full rounded-[18px] border-2 border-white/5 bg-black/40 px-6 py-4 text-white outline-none focus:border-cyan-400/40 font-mono text-[10px] uppercase" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] ml-1">Execution_Order</label>
                        <input type="number" value={form.order} onChange={onChange("order")} className="w-full rounded-[18px] border-2 border-white/5 bg-black/40 px-6 py-4 text-white outline-none focus:border-cyan-400/40 font-mono" />
                      </div>
                      <div className="space-y-3 text-left">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] ml-1 flex items-center gap-2">
                          <Star size={12} className="text-yellow-500" /> Quality_Factor (1-5)
                        </label>
                        <input type="number" min="1" max="5" value={form.rating} onChange={onChange("rating")} className="w-full rounded-[18px] border-2 border-white/5 bg-black/40 px-6 py-4 text-white outline-none focus:border-cyan-400/40 font-mono" />
                      </div>
                    </div>
                  </div>
                )}

                {type === "contactDetails" && (
                  <div className="space-y-12">
                    <div className="grid gap-10 md:grid-cols-2">
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] ml-1">Hardware_Line (Phone)</label>
                        <input value={form.phone} onChange={onChange("phone")} className="w-full rounded-[20px] border-2 border-white/5 bg-black/40 px-6 py-5 text-white outline-none focus:border-cyan-400/40" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] ml-1">Secure_Network_ID (Email)</label>
                        <input value={form.email} onChange={onChange("email")} className="w-full rounded-[20px] border-2 border-white/5 bg-black/40 px-6 py-5 text-white outline-none focus:border-cyan-400/40" />
                      </div>
                    </div>
                    <div className="grid gap-10 md:grid-cols-2">
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] ml-1">Uplink_Identity (WhatsApp)</label>
                        <input value={form.whatsapp} onChange={onChange("whatsapp")} className="w-full rounded-[20px] border-2 border-white/5 bg-black/40 px-6 py-5 text-white outline-none focus:border-cyan-400/40" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] ml-1">Uplink_Annotation (Label)</label>
                        <input value={form.whatsappLabel} onChange={onChange("whatsappLabel")} className="w-full rounded-[20px] border-2 border-white/5 bg-black/40 px-6 py-5 text-white outline-none focus:border-cyan-400/40" />
                      </div>
                    </div>
                    <div className="grid gap-10 md:grid-cols-2 text-left">
                      <div className="space-y-3 text-left">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] ml-1">Physical_Node_EN (Address)</label>
                        <textarea rows={3} value={form.addressEn} onChange={onChange("addressEn")} className="w-full rounded-[20px] border-2 border-white/5 bg-black/40 px-6 py-5 text-white outline-none focus:border-cyan-400/40" />
                      </div>
                      <div className="space-y-3 text-left">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] ml-1">Physical_Node_BN (Address)</label>
                        <textarea rows={3} value={form.addressBn} onChange={onChange("addressBn")} className="w-full rounded-[20px] border-2 border-white/5 bg-black/40 px-6 py-5 text-white outline-none focus:border-cyan-400/40" />
                      </div>
                    </div>
                    <div className="flex items-center gap-6 bg-white/2 p-8 rounded-[32px] border border-white/5">
                       <label className="flex items-center gap-4 cursor-pointer group">
                        <div className={`flex h-8 w-14 items-center rounded-full transition-all duration-500 ${form.whatsappEnabled ? "bg-cyan-600 shadow-[0_0_20px_rgba(8,145,178,0.5)]" : "bg-slate-800"}`}>
                          <div className={`h-6 w-6 rounded-full bg-white transition-all duration-500 ${form.whatsappEnabled ? "ml-7" : "ml-1"}`} />
                        </div>
                        <input type="checkbox" checked={form.whatsappEnabled} onChange={onChange("whatsappEnabled")} className="hidden" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] group-hover:text-slate-200 font-mono">Uplink_Node_Status</span>
                      </label>
                    </div>
                  </div>
                )}

                <div className="space-y-12 pt-12 border-t border-white/10 relative text-left">
                  <div className="absolute top-0 left-0 h-px w-20 bg-cyan-400/40" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Search size={18} className="text-cyan-400/40" />
                      <p className="font-mono text-[10px] tracking-[0.6em] text-cyan-400 uppercase font-bold opacity-60">Search_Matrix_Optimization</p>
                    </div>
                    <label className="flex items-center gap-4 cursor-pointer group">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] group-hover:text-slate-200 font-mono">Production_Uplink</span>
                      <div className={`flex h-8 w-14 items-center rounded-full transition-all duration-500 ${form.isPublished ? "bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]" : "bg-slate-800"}`}>
                        <div className={`h-6 w-6 rounded-full bg-white transition-all duration-500 ${form.isPublished ? "ml-7" : "ml-1"}`} />
                      </div>
                      <input type="checkbox" checked={form.isPublished} onChange={onChange("isPublished")} className="hidden" />
                    </label>
                  </div>
                  
                  <div className="grid gap-10 md:grid-cols-2 text-left">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] ml-1">Metadata_Title (EN)</label>
                      <input value={form.seoTitleEn} onChange={onChange("seoTitleEn")} className="w-full rounded-[20px] border-2 border-white/5 bg-black/40 px-6 py-5 text-white outline-none focus:border-cyan-400/40 font-medium" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] ml-1">Metadata_Title (BN)</label>
                      <input value={form.seoTitleBn} onChange={onChange("seoTitleBn")} className="w-full rounded-[20px] border-2 border-white/5 bg-black/40 px-6 py-5 text-white outline-none focus:border-cyan-400/40 font-medium" />
                    </div>
                  </div>
                  <div className="grid gap-10 md:grid-cols-2 text-left">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] ml-1">Metadata_Description (EN)</label>
                      <textarea rows={3} value={form.seoDescriptionEn} onChange={onChange("seoDescriptionEn")} className="w-full rounded-[20px] border-2 border-white/5 bg-black/40 px-6 py-5 text-white outline-none focus:border-cyan-400/40 font-medium" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] ml-1">Metadata_Description (BN)</label>
                      <textarea rows={3} value={form.seoDescriptionBn} onChange={onChange("seoDescriptionBn")} className="w-full rounded-[20px] border-2 border-white/5 bg-black/40 px-6 py-5 text-white outline-none focus:border-cyan-400/40 font-medium" />
                    </div>
                  </div>
                  <div className="space-y-3 text-left">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] ml-1">Structural_Schema (JSON-LD)</label>
                    <textarea rows={8} value={form.jsonLd} onChange={onChange("jsonLd")} className="w-full rounded-[32px] border-2 border-white/5 bg-black/40 px-8 py-7 font-mono text-[11px] text-cyan-400/80 outline-none focus:border-cyan-400/40 custom-scrollbar leading-relaxed" />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-10 border-t border-white/10 pt-16">
                   <div className="flex flex-col sm:flex-row gap-6 w-full md:w-auto">
                    <button type="submit" disabled={saving || (!config.allowCreate && !selectedId)} className="group relative overflow-hidden rounded-[20px] md:rounded-[24px] bg-cyan-600 px-8 md:px-12 py-5 md:py-6 font-bold shadow-[0_20px_40px_rgba(6,182,212,0.3)] transition-all hover:translate-y-[-2px] disabled:opacity-50 min-w-0 md:min-w-[280px] flex items-center justify-center gap-4">
                       {saving ? <Loader2 size={18} className="animate-spin text-black" /> : <Save size={18} className="text-black" />}
                       <span className="relative z-10 text-[9px] md:text-[10px] font-mono uppercase tracking-[0.3em] md:tracking-[0.4em] text-black italic font-black">
                         {saving ? "EXECUTING_COMMIT..." : selectedId ? "EXECUTE_UPDATE" : "INITIALIZE_COMMIT"}
                       </span>
                       <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                    {selectedId && (
                      <button type="button" onClick={() => onDeleteItem(selectedId)} disabled={saving} className="px-8 md:px-10 py-5 md:py-6 rounded-[20px] md:rounded-[24px] border-2 border-rose-500/20 bg-rose-500/5 font-mono text-[9px] md:text-[10px] font-bold text-rose-500 uppercase tracking-[0.3em] hover:bg-rose-500/10 transition-all italic flex items-center gap-3">
                        <Trash2 size={16} />
                        ERASE_Artifact
                      </button>
                    )}
                  </div>
                  <button type="button" onClick={() => { setSelectedId(""); setForm(baseForm); }} className="px-6 md:px-8 py-3 md:py-4 rounded-xl text-[8px] md:text-[9px] font-bold text-slate-600 uppercase tracking-[0.4em] md:tracking-[0.5em] hover:text-white transition-colors font-mono hover:bg-white/5 italic">
                    Flush_Buffer
                  </button>
                </div>
              </form>
            )}
          </GlassCard>
        </section>
      </div>

      <footer className="admin-reveal mt-16 md:mt-32 border-t border-white/5 pt-12 md:pt-16 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12 px-6 md:px-12 font-display text-[9px] md:text-[11px] text-[#222] uppercase tracking-[0.5em] md:tracking-[0.7em] font-bold italic text-center md:text-left">
         <div className="flex flex-col md:flex-row gap-6 md:gap-12 transition-all">
            <span className="flex items-center gap-3 text-cyan-400/60 transition-colors hover:text-cyan-400"><CheckCircle2 size={12} className="text-cyan-400" /> Security: Integrity Validated</span>
            <span className="flex items-center gap-3 text-cyan-400/60 transition-colors hover:text-cyan-400"><CheckCircle2 size={12} className="text-cyan-400" /> Layer: CMS Protocol v5.2</span>
         </div>
         <span className="opacity-40 whitespace-nowrap italic">© 2026 Admin Execution Hub • Engr. Alam Ashik</span>
      </footer>
    </div>
  );
}
