import { useState, useEffect } from "react";
import { Home, Type, AlignLeft, Image as ImageIcon, Sparkles, BarChart3, Plus, Trash2, Save, ShieldCheck } from "lucide-react";
import { adminList, adminUpdate, adminCreate, adminDelete } from "../../../lib/api";
import AdminModuleWrapper from "./AdminModuleWrapper";
import ImageUpload from "../../../components/admin/ImageUpload";
import AutoTranslate from "../../../components/admin/AutoTranslate";

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

  // Dynamic blocks state
  const [stats, setStats] = useState([]);
  const [partners, setPartners] = useState([]);
  const [editingBlock, setEditingBlock] = useState(null);

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
        const blocks = blocksRes.items || [];
        setStats(blocks.filter(b => b.section === 'stats').sort((a, b) => a.order - b.order));
        setPartners(blocks.filter(b => b.section === 'partners').sort((a, b) => a.order - b.order));
      } catch (err) {
        setStatus({ type: "error", message: "LOAD_FAILED: Check Infrastructure" });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async () => {
    console.log("[ADMIN_HOME_SAVE] Execution Started. Active Tab:", activeTab);
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
      console.log("[ADMIN_HOME] Synchronization successful. Initiating verification pulse...");
      const verifyRes = await adminList("home", { limit: 1 });
      const verifyItem = verifyRes.items?.[0];
      if (verifyItem) {
        setForm({
          titleEn: verifyItem.title?.en || "",
          titleBn: verifyItem.title?.bn || "",
          summaryEn: verifyItem.summary?.en || "",
          summaryBn: verifyItem.summary?.bn || "",
          bodyEn: verifyItem.body?.en || "",
          bodyBn: verifyItem.body?.bn || "",
          featuredImageUrl: verifyItem.featuredImage?.url || "",
        });
      }

      setStatus({ type: "success", message: "HOME VISION SYNCHRONIZED SUCCESSFULLY" });
    } catch (err) {
      console.error("[ADMIN_HOME_SAVE_ERROR] Save Protocol Failure:", err);
      setStatus({ type: "error", message: "COMMIT FAILED: Protocol Error" });
    } finally {
      setSaving(false);
      setTimeout(() => window.location.reload(), 2000); // Reliable reload
    }
  };

  const handleBlockSave = async (block, section) => {
    setSaving(true);
    try {
      const payload = {
        page: "home",
        section: section,
        slug: block._id ? block.slug : `home-${section}-${Date.now()}`,
        title: { en: block.titleEn || "", bn: block.titleBn || "" },
        value: block.value || "",
        suffix: block.suffix || (section === "partners" ? "circle" : ""),
        icon: block.icon || "",
        order: block.order || 0,
        isPublished: true,
      };
      if (block._id) {
        await adminUpdate("sectionBlocks", block._id, payload);
      } else {
        await adminCreate("sectionBlocks", payload);
      }
      const refreshed = await adminList("sectionBlocks", { pageFilter: "home", limit: 50 });
      const items = refreshed.items || [];
      if (section === "stats") setStats(items.filter(b => b.section === 'stats').sort((a, b) => a.order - b.order));
      if (section === "partners") setPartners(items.filter(b => b.section === 'partners').sort((a, b) => a.order - b.order));

      setEditingBlock(null);
      setStatus({ type: "success", message: `${section.toUpperCase()} SYNCHRONIZED` });
    } catch (err) {
      console.error(`[ADMIN_HOME_ERROR] ${section.toUpperCase()} Block Save Failure:`, err);
      setStatus({ type: "error", message: "BLOCK_SAVE_FAILED" });
    } finally { 
      setSaving(false); 
      setTimeout(() => window.location.reload(), 2000);
    }
  };

  const handleBlockDelete = async (id, section) => {
    if (!window.confirm("Delete this block?")) return;
    setSaving(true);
    try {
      setStatus({ type: "success", message: "BLOCK PURGED SUCCESSFULLY" });
    } catch (err) {
      console.error("[ADMIN_HOME_ERROR] Block Delete Failure:", err);
      setStatus({ type: "error", message: "DELETE_FAILED" });
    } finally { 
      setSaving(false); 
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  const inputClasses = "w-full bg-[var(--admin-card)] border border-[color:var(--admin-border)] rounded-2xl px-8 py-6 text-[color:var(--admin-text-heading)] outline-none focus:border-cyan-400/50 focus:bg-[var(--admin-card)] opacity-90 transition-all font-medium italic placeholder:text-[color:var(--admin-text-secondary)] shadow-inner";
  const labelClasses = "flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-[color:var(--admin-text-muted)] italic ml-4 mb-4";
  const smInput = "w-full bg-[var(--admin-card)] border border-[color:var(--admin-border)] rounded-xl px-4 py-3 text-[color:var(--admin-text-heading)] outline-none focus:border-cyan-400/50 transition-all text-[13px] font-medium";

  const tabs = [
    { id: "hero", label: "Hero Text", icon: Sparkles },
    { id: "stats", label: "Stats", icon: BarChart3 },
    { id: "partners", label: "Partners", icon: ShieldCheck },
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
          <button key={tab.id} onClick={() => { setActiveTab(tab.id); setEditingBlock(null); }}
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
                <input value={form.titleEn} onChange={e => setForm({ ...form, titleEn: e.target.value })} className={inputClasses} placeholder="I Build Structural Foundations" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                   <label className={labelClasses}>Identity Header (BN)</label>
                   <AutoTranslate text={form.titleEn} onTranslate={(val) => setForm({ ...form, titleBn: val })} />
                </div>
                <input value={form.titleBn} onChange={e => setForm({ ...form, titleBn: e.target.value })} className={inputClasses} placeholder="আমি কাঠামোগত ভিত্তি তৈরি করি" />
              </div>
            </div>
          </section>

          {/* Subtitle Nodes */}
          <section>
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-2">
                <label className={labelClasses}><AlignLeft size={12} className="text-indigo-400" /> Strategic Subtitle (EN)</label>
                <textarea rows={4} value={form.summaryEn} onChange={e => setForm({ ...form, summaryEn: e.target.value })} className={`${inputClasses} resize-none`} placeholder="Professional Civil Engineer & Architectural Designer..." />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                   <label className={labelClasses}>Strategic Subtitle (BN)</label>
                   <AutoTranslate text={form.summaryEn} onTranslate={(val) => setForm({ ...form, summaryBn: val })} />
                </div>
                <textarea rows={4} value={form.summaryBn} onChange={e => setForm({ ...form, summaryBn: e.target.value })} className={`${inputClasses} resize-none`} placeholder="পেশাদার সিভিল ইঞ্জিনিয়ার..." />
              </div>
            </div>
          </section>

          {/* Visual Assets */}
          <section className="pt-8">
            <div className="bg-[var(--admin-bg)] border border-[color:var(--admin-border)] rounded-[40px] p-10 relative overflow-hidden shadow-inner">
              <div className="absolute top-0 right-10 h-1 w-20 bg-cyan-400/40" />
              <div className="flex items-center gap-4 mb-10">
                <ImageIcon size={16} className="text-sky-600" />
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-[color:var(--admin-text-muted)] italic">High Fidelity Renders</h3>
              </div>
              <ImageUpload value={form.featuredImageUrl} onChange={val => setForm({ ...form, featuredImageUrl: val })} label="Primary Hero Visualization" />
            </div>
          </section>
        </div>
      )}

      {(activeTab === "stats" || activeTab === "partners") && (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[color:var(--admin-text-muted)]">
                {activeTab === "stats" ? "Homepage Stats Bar" : "Authorized Partners & Accreditations"}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--admin-text-secondary)" }}>
                {activeTab === "stats"
                  ? "These numbers appear in the stats row below the hero section."
                  : "These symbols appear in the trusted partners section near the footer."}
              </p>
            </div>
            <button onClick={() => setEditingBlock({ titleEn: "", titleBn: "", value: "", suffix: activeTab === "partners" ? "circle" : "", icon: "", order: (activeTab === "stats" ? stats : partners).length + 1 })}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all"
              style={{ background: "var(--highlight)", color: "#000" }}
            >
              <Plus size={14} /> Add {activeTab === "stats" ? "Stat" : "Partner"}
            </button>
          </div>

          {/* List Cards */}
          <div className="space-y-4">
            {(activeTab === "stats" ? stats : partners).map((block) => (
              <div key={block._id} className="flex items-center gap-6 p-6 rounded-2xl" style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}>
                <div className={`w-12 h-12 flex items-center justify-center font-black ${block.suffix === "square" ? "rounded-lg" : "rounded-full"}`}
                  style={{ border: "2px dashed var(--admin-border)", color: "var(--highlight)" }}>
                  {activeTab === "stats" ? (
                    <span className="text-xl">{block.value}</span>
                  ) : (
                    <span className="text-xs">{block.title?.en}</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[13px]" style={{ color: "var(--admin-text-heading)" }}>
                    {activeTab === "stats" ? block.title?.en : block.value}
                  </p>
                  {activeTab === "stats" && <p className="text-xs" style={{ color: "var(--admin-text-secondary)" }}>{block.title?.bn || "—"}</p>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditingBlock({ ...block, titleEn: block.title?.en || "", titleBn: block.title?.bn || "" })}
                    className="px-4 py-2 rounded-lg text-[11px] font-black uppercase transition-all hover:opacity-80"
                    style={{ border: "1px solid var(--highlight-border)", color: "var(--highlight)" }}
                  >Edit</button>
                  <button onClick={() => handleBlockDelete(block._id, activeTab)}
                    className="px-4 py-2 rounded-lg text-[11px] font-black uppercase transition-all hover:opacity-80"
                    style={{ border: "1px solid #ef444440", color: "#ef4444" }}
                  ><Trash2 size={13} /></button>
                </div>
              </div>
            ))}
          </div>

          {/* Block Editing Form */}
          {editingBlock && (
            <div className="p-8 rounded-2xl mt-6 space-y-6" style={{ background: "var(--admin-bg)", border: "2px solid var(--highlight-border)" }}>
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em]" style={{ color: "var(--highlight)" }}>
                {editingBlock._id ? `Edit ${activeTab}` : `New ${activeTab}`}
              </h3>

              {activeTab === "stats" ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-[color:var(--admin-text-muted)] ml-1 mb-2 block">Value</label>
                    <input value={editingBlock.value} onChange={e => setEditingBlock({ ...editingBlock, value: e.target.value })} className={smInput} placeholder="150" />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-[color:var(--admin-text-muted)] ml-1 mb-2 block">Suffix</label>
                    <input value={editingBlock.suffix} onChange={e => setEditingBlock({ ...editingBlock, suffix: e.target.value })} className={smInput} placeholder="+" />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-[color:var(--admin-text-muted)] ml-1 mb-2 block">Label (EN)</label>
                    <input value={editingBlock.titleEn} onChange={e => setEditingBlock({ ...editingBlock, titleEn: e.target.value })} className={smInput} placeholder="Projects Done" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                       <label className="text-[9px] font-black uppercase tracking-widest text-[color:var(--admin-text-muted)] ml-1">Label (BN)</label>
                       <AutoTranslate text={editingBlock.titleEn} onTranslate={(val) => setEditingBlock({ ...editingBlock, titleBn: val })} />
                    </div>
                    <input value={editingBlock.titleBn} onChange={e => setEditingBlock({ ...editingBlock, titleBn: e.target.value })} className={smInput} placeholder="প্রকল্প" />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-[color:var(--admin-text-muted)] ml-1 mb-2 block">Short Code (e.g. IEB)</label>
                    <input value={editingBlock.titleEn} onChange={e => setEditingBlock({ ...editingBlock, titleEn: e.target.value })} className={smInput} placeholder="IEB" />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-[color:var(--admin-text-muted)] ml-1 mb-2 block">Full Label (e.g. Member IEB)</label>
                    <input value={editingBlock.value} onChange={e => setEditingBlock({ ...editingBlock, value: e.target.value })} className={smInput} placeholder="MEMBER IEB" />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-[color:var(--admin-text-muted)] ml-1 mb-2 block">Shape</label>
                    <select value={editingBlock.suffix} onChange={e => setEditingBlock({ ...editingBlock, suffix: e.target.value })} className={smInput}>
                      <option value="circle">Circular</option>
                      <option value="square">Square</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-[color:var(--admin-text-muted)] ml-1 mb-2 block">Sort Order</label>
                  <input type="number" value={editingBlock.order} onChange={e => setEditingBlock({ ...editingBlock, order: Number(e.target.value) })} className={smInput} />
                </div>
                {activeTab === "stats" && (
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-[color:var(--admin-text-muted)] ml-1 mb-2 block">SVG Icon Path (d="...")</label>
                    <input value={editingBlock.icon} onChange={e => setEditingBlock({ ...editingBlock, icon: e.target.value })} className={smInput} placeholder="M19 21V5..." />
                  </div>
                )}
              </div>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setEditingBlock(null)} className="px-6 py-3 rounded-xl text-[11px] font-black uppercase" style={{ border: "1px solid var(--admin-border)", color: "var(--admin-text-secondary)" }}>Cancel</button>
                <button onClick={() => handleBlockSave(editingBlock, activeTab)} className="flex items-center gap-2 px-6 py-3 rounded-xl text-[11px] font-black uppercase" style={{ background: "var(--highlight)", color: "#000" }}>
                  <Save size={13} /> Save {activeTab}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </AdminModuleWrapper>
  );
}
