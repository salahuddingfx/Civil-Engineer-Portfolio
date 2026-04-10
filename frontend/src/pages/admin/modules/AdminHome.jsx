import { useState, useEffect } from "react";
import { Home, Type, AlignLeft, Image as ImageIcon, Sparkles, BarChart3, Plus, Trash2, Save } from "lucide-react";
import { adminList, adminUpdate, adminCreate, adminDelete } from "../../../lib/api";
import AdminModuleWrapper from "./AdminModuleWrapper";
import ImageUpload from "../../../components/admin/ImageUpload";

export default function AdminHome() {
  const [activeTab, setActiveTab] = useState("hero");
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

  // Stats state
  const [stats, setStats] = useState([]);
  const [editingStat, setEditingStat] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [homeRes, blocksRes] = await Promise.all([
          adminList("home", { limit: 1 }),
          adminList("sectionBlocks", { pageFilter: "home", limit: 50 })
        ]);
        const item = homeRes.items?.[0];
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
        setStats((blocksRes.items || []).filter(b => b.section === 'stats').sort((a,b) => a.order - b.order));
      } catch (err) {
        setStatus({ type: "error", message: "LOAD_FAILED: Check Infrastructure" });
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
      slug: "home",
      title: { en: form.titleEn, bn: form.titleBn },
      summary: { en: form.summaryEn, bn: form.summaryBn },
      body: { en: form.bodyEn, bn: form.bodyBn },
      featuredImage: form.featuredImageUrl ? { url: form.featuredImageUrl } : null,
      isPublished: true,
    };

    try {
      if (recordId) {
        await adminUpdate("home", recordId, payload);
      } else {
        const res = await adminCreate("home", payload);
        setRecordId(res._id);
      }
      setStatus({ type: "success", message: "HOME VISION SYNCHRONIZED SUCCESSFULLY" });
    } catch (err) {
      setStatus({ type: "error", message: "COMMIT FAILED: Protocol Error" });
    } finally {
      setSaving(false);
    }
  };

  const handleStatSave = async (stat) => {
    setSaving(true);
    try {
      const payload = {
        page: "home",
        section: "stats",
        slug: stat._id ? stat.slug : `home-stat-${Date.now()}`,
        title: { en: stat.titleEn, bn: stat.titleBn || "" },
        value: stat.value,
        suffix: stat.suffix || "",
        icon: stat.icon || "",
        order: stat.order || 0,
        isPublished: true,
      };
      if (stat._id) {
        await adminUpdate("sectionBlocks", stat._id, payload);
      } else {
        await adminCreate("sectionBlocks", payload);
      }
      const refreshed = await adminList("sectionBlocks", { pageFilter: "home", limit: 50 });
      setStats((refreshed.items || []).filter(b => b.section === 'stats').sort((a,b) => a.order - b.order));
      setEditingStat(null);
      setStatus({ type: "success", message: "Stat block saved." });
    } catch (err) {
      setStatus({ type: "error", message: "Failed to save stat." });
    } finally { setSaving(false); }
  };

  const handleStatDelete = async (id) => {
    if (!window.confirm("Delete this stat block?")) return;
    setSaving(true);
    try {
      await adminDelete("sectionBlocks", id);
      setStats(stats.filter(s => s._id !== id));
      setStatus({ type: "success", message: "Stat deleted." });
    } catch (err) {
      setStatus({ type: "error", message: "Delete failed." });
    } finally { setSaving(false); }
  };

  const inputClasses = "w-full bg-[var(--admin-card)] border border-[color:var(--admin-border)] rounded-2xl px-8 py-6 text-[color:var(--admin-text-heading)] outline-none focus:border-cyan-400/50 focus:bg-[var(--admin-card)] opacity-90 transition-all font-medium italic placeholder:text-[color:var(--admin-text-secondary)] shadow-inner";
  const labelClasses = "flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-[color:var(--admin-text-muted)] italic ml-4 mb-4";
  const smInput = "w-full bg-[var(--admin-card)] border border-[color:var(--admin-border)] rounded-xl px-4 py-3 text-[color:var(--admin-text-heading)] outline-none focus:border-cyan-400/50 transition-all text-[13px] font-medium";

  const tabs = [
    { id: "hero", label: "Hero Text", icon: Sparkles },
    { id: "stats", label: "Stats", icon: BarChart3 },
  ];

  return (
    <AdminModuleWrapper
      title="Landing Vision"
      subtitle="Configure global hero typography and architectural brand standards."
      icon={Home}
      loading={loading}
      saving={saving}
      status={status}
      onSave={activeTab === "hero" ? handleSave : null}
    >
      {/* Tabs */}
      <div className="flex gap-2 mb-10 p-2 rounded-2xl" style={{ background: "var(--admin-bg)", border: "1px solid var(--admin-border)" }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all"
            style={activeTab === tab.id
              ? { background: "var(--highlight)", color: "#000" }
              : { color: "var(--admin-text-secondary)", background: "transparent" }}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "hero" && (
        <div className="space-y-16">
          {/* Title Infrastructure */}
          <section>
            <div className="flex items-center gap-4 mb-10">
              <Sparkles size={16} className="text-sky-600" />
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-sky-500">Hero Typography System</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-2">
                <label className={labelClasses}><Type size={12} className="text-blue-400" /> Identity Header (EN)</label>
                <input value={form.titleEn} onChange={e => setForm({...form, titleEn: e.target.value})} className={inputClasses} placeholder="I Build Structural Foundations" />
              </div>
              <div className="space-y-2">
                <label className={labelClasses}>Identity Header (BN)</label>
                <input value={form.titleBn} onChange={e => setForm({...form, titleBn: e.target.value})} className={inputClasses} placeholder="আমি কাঠামোগত ভিত্তি তৈরি করি" />
              </div>
            </div>
          </section>

          {/* Subtitle Nodes */}
          <section>
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-2">
                <label className={labelClasses}><AlignLeft size={12} className="text-indigo-400" /> Strategic Subtitle (EN)</label>
                <textarea rows={4} value={form.summaryEn} onChange={e => setForm({...form, summaryEn: e.target.value})} className={`${inputClasses} resize-none`} placeholder="Professional Civil Engineer & Architectural Designer..." />
              </div>
              <div className="space-y-2">
                <label className={labelClasses}>Strategic Subtitle (BN)</label>
                <textarea rows={4} value={form.summaryBn} onChange={e => setForm({...form, summaryBn: e.target.value})} className={`${inputClasses} resize-none`} placeholder="পেশাদার সিভিল ইঞ্জিনিয়ার..." />
              </div>
            </div>
          </section>

          {/* Visual Assets */}
          <section className="pt-8">
            <div className="bg-[color:var(--admin-bg)] border border-[color:var(--admin-border)] rounded-[48px] p-12 relative overflow-hidden">
              <div className="absolute top-0 right-10 h-1 w-20 bg-cyan-400/40" />
              <div className="flex items-center gap-4 mb-10">
                <ImageIcon size={16} className="text-sky-600" />
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-[color:var(--admin-text-muted)] italic">High Fidelity Renders</h3>
              </div>
              <ImageUpload value={form.featuredImageUrl} onChange={val => setForm({...form, featuredImageUrl: val})} label="Primary Hero Visualization" />
            </div>
          </section>
        </div>
      )}

      {activeTab === "stats" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[color:var(--admin-text-muted)]">Homepage Stats Bar</p>
              <p className="text-xs mt-1" style={{ color: "var(--admin-text-secondary)" }}>These numbers appear in the stats row below the hero section.</p>
            </div>
            <button onClick={() => setEditingStat({ titleEn: "", titleBn: "", value: "", suffix: "", icon: "", order: stats.length + 1 })}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all"
              style={{ background: "var(--highlight)", color: "#000" }}
            >
              <Plus size={14} /> Add Stat
            </button>
          </div>

          {/* Stat Cards */}
          <div className="space-y-4">
            {stats.map((stat) => (
              <div key={stat._id} className="flex items-center gap-6 p-6 rounded-2xl" style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}>
                <div className="text-3xl font-black" style={{ color: "var(--highlight)" }}>{stat.value}{stat.suffix}</div>
                <div className="flex-1">
                  <p className="font-bold text-[13px]" style={{ color: "var(--admin-text-heading)" }}>{stat.title?.en}</p>
                  <p className="text-xs" style={{ color: "var(--admin-text-secondary)" }}>{stat.title?.bn || "—"}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditingStat({ ...stat, titleEn: stat.title?.en || "", titleBn: stat.title?.bn || "" })}
                    className="px-4 py-2 rounded-lg text-[11px] font-black uppercase transition-all hover:opacity-80"
                    style={{ border: "1px solid var(--highlight-border)", color: "var(--highlight)" }}
                  >Edit</button>
                  <button onClick={() => handleStatDelete(stat._id)}
                    className="px-4 py-2 rounded-lg text-[11px] font-black uppercase transition-all hover:opacity-80"
                    style={{ border: "1px solid #ef444440", color: "#ef4444" }}
                  ><Trash2 size={13} /></button>
                </div>
              </div>
            ))}
          </div>

          {/* Editing Form */}
          {editingStat && (
            <div className="p-8 rounded-2xl mt-6 space-y-6" style={{ background: "var(--admin-bg)", border: "2px solid var(--highlight-border)" }}>
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em]" style={{ color: "var(--highlight)" }}>
                {editingStat._id ? "Edit Stat Block" : "New Stat Block"}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-[color:var(--admin-text-muted)] ml-1 mb-2 block">Value</label>
                  <input value={editingStat.value} onChange={e => setEditingStat({...editingStat, value: e.target.value})} className={smInput} placeholder="150" />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-[color:var(--admin-text-muted)] ml-1 mb-2 block">Suffix</label>
                  <input value={editingStat.suffix} onChange={e => setEditingStat({...editingStat, suffix: e.target.value})} className={smInput} placeholder="+" />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-[color:var(--admin-text-muted)] ml-1 mb-2 block">Label (EN)</label>
                  <input value={editingStat.titleEn} onChange={e => setEditingStat({...editingStat, titleEn: e.target.value})} className={smInput} placeholder="Projects Done" />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-[color:var(--admin-text-muted)] ml-1 mb-2 block">Label (BN)</label>
                  <input value={editingStat.titleBn} onChange={e => setEditingStat({...editingStat, titleBn: e.target.value})} className={smInput} placeholder="প্রকল্প" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-[color:var(--admin-text-muted)] ml-1 mb-2 block">Sort Order</label>
                  <input type="number" value={editingStat.order} onChange={e => setEditingStat({...editingStat, order: Number(e.target.value)})} className={smInput} />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-[color:var(--admin-text-muted)] ml-1 mb-2 block">SVG Icon Path (d="...")</label>
                  <input value={editingStat.icon} onChange={e => setEditingStat({...editingStat, icon: e.target.value})} className={smInput} placeholder="M19 21V5..." />
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setEditingStat(null)} className="px-6 py-3 rounded-xl text-[11px] font-black uppercase" style={{ border: "1px solid var(--admin-border)", color: "var(--admin-text-secondary)" }}>Cancel</button>
                <button onClick={() => handleStatSave(editingStat)} className="flex items-center gap-2 px-6 py-3 rounded-xl text-[11px] font-black uppercase" style={{ background: "var(--highlight)", color: "#000" }}>
                  <Save size={13} /> Save Stat
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </AdminModuleWrapper>
  );
}
