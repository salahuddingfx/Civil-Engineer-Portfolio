import { useState, useEffect } from "react";
import { Briefcase, Settings, Edit3, Trash2, Plus, Type, Sparkles, Cpu, Layers, Search } from "lucide-react";
import { adminList, adminUpdate, adminCreate, adminDelete } from "../../../lib/api";
import AdminModuleWrapper from "./AdminModuleWrapper";
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
  const [status, setStatus] = useState({ type: "", message: "" });

  const loadData = async () => {
    try {
      const response = await adminList("services", { limit: 100 });
      const fetchedItems = response.items || [];
      setItems(fetchedItems);
      if (fetchedItems.length > 0 && !selectedId) {
        setSelectedId(fetchedItems[0]._id);
      }
    } catch (err) {
      setStatus({ type: "error", message: "LOAD_FAILED: Check Infrastructure" });
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
    setStatus({ type: "", message: "" });
    const payload = {
      slug: form.slug || form.titleEn.toLowerCase().replace(/\s+/g, '-'),
      title: { en: form.titleEn, bn: form.titleBn },
      summary: { en: form.summaryEn, bn: form.summaryBn },
      tags: [form.icon],
      isPublished: form.isPublished,
    };

    try {
      if (selectedId) await adminUpdate("services", selectedId, payload);
      else await adminCreate("services", payload);
      setStatus({ type: "success", message: "SERVICE CATALOG SYNCHRONIZED SUCCESSFULLY" });
      if (!selectedId) setSelectedId(null);
      await loadData();
    } catch (err) {
      setStatus({ type: "error", message: "COMMIT FAILED: Protocol Error" });
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm("DESTROY_SERVICE_RECORD: CONFIRM_PERMANENT?")) return;
    setSaving(true);
    try {
      await adminDelete("services", selectedId);
      setStatus({ type: "success", message: "SERVICE PURGED FROM CATALOG" });
      setSelectedId(null);
      await loadData();
    } catch (err) {
      setStatus({ type: "error", message: "PURGE_FAILURE" });
    } finally { setSaving(false); }
  };

  const filteredItems = items.filter(item => 
    item.title?.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tags?.[0]?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inputClasses = "w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl px-7 py-5 text-white outline-none focus:border-cyan-400/50 focus:bg-white/[0.05] transition-all font-medium italic placeholder:text-slate-700 shadow-inner text-sm";
  const labelClasses = "flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic ml-4 mb-4";

  return (
    <AdminModuleWrapper
      title="Service Catalog"
      subtitle="Configure engineering packages and architectural consultancy definitions."
      icon={Briefcase}
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
             <Search size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
             <input 
               placeholder="Search Catalog..." 
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
               className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl pl-14 pr-6 py-5 text-[11px] font-bold uppercase tracking-widest text-white outline-none focus:border-cyan-400/40 transition-all"
             />
          </div>

          <div className="space-y-4 max-h-[800px] overflow-y-auto pr-4 custom-scrollbar">
            {filteredItems.map(item => (
              <div 
                key={item._id}
                onClick={() => setSelectedId(item._id)}
                className={`p-6 rounded-[32px] border transition-all duration-500 cursor-pointer group flex gap-5 relative overflow-hidden ${selectedId === item._id ? 'border-cyan-400/40 bg-cyan-400/[0.03]' : 'border-white/[0.05] bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.02]'}`}
              >
                {selectedId === item._id && <div className="absolute left-0 top-0 w-1 h-full bg-cyan-400" />}
                
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white/[0.03] border border-white/10 text-cyan-400 group-hover:bg-cyan-400/20 transition-all duration-500 shadow-xl">
                  <Cpu size={28} strokeWidth={1.5} />
                </div>
                
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[8px] font-black uppercase tracking-[0.2em] italic ${selectedId === item._id ? 'text-cyan-400' : 'text-slate-600'}`}>{item.tags?.[0] || "General"}</span>
                    <div className={`h-2 w-2 rounded-full ${item.isPublished ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-slate-800'}`} />
                  </div>
                  <p className="text-sm font-black text-white italic truncate tracking-tight mb-1 uppercase">{item.title?.en || "Untitled_Service"}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[8px] font-black uppercase text-slate-700 tracking-widest bg-white/5 px-2 py-0.5 rounded">SLUG: {item.slug || "N/A"}</span>
                    <span className="text-[8px] font-black uppercase text-slate-700 tracking-widest bg-white/5 px-2 py-0.5 rounded">CHARS: {item.summary?.en?.length || 0}</span>
                  </div>
                </div>
              </div>
            ))}
            {!loading && filteredItems.length === 0 && (
               <div className="py-20 text-center space-y-4 opacity-20">
                  <Briefcase size={40} className="mx-auto text-slate-500" />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">No Services Found</p>
               </div>
            )}
          </div>
        </div>

        <div className="space-y-16 animate-in fade-in slide-in-from-right-8 duration-1000">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 border-b border-white/[0.05] pb-12">
            <div>
               <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-3">{selectedId ? "Configure_Unit" : "Initialize_Record"}</h3>
               <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.4em] italic leading-none flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-cyan-400/40" />
                  {selectedId ? `System_ID: ${selectedId}` : "Protocol: New_Entry_Initialization"}
               </p>
            </div>
            
            <div className="flex items-center gap-8 px-10 py-5 bg-white/[0.02] border border-white/[0.05] rounded-[32px] shadow-xl">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic">Visible_In_Network</span>
               <label className="flex items-center cursor-pointer group scale-110">
                  <div className={`h-8 w-16 rounded-full transition-all duration-700 relative border border-white/5 ${form.isPublished ? 'bg-cyan-500 shadow-[0_0_25px_rgba(34,211,238,0.4)]' : 'bg-slate-900'}`}>
                    <div className={`h-6 w-6 bg-white rounded-full absolute top-1 transition-all duration-700 shadow-xl ${form.isPublished ? 'left-9' : 'left-1'}`} />
                  </div>
                  <input type="checkbox" checked={form.isPublished} onChange={e => setForm({...form, isPublished: e.target.checked})} className="hidden" />
               </label>
            </div>
          </div>

          {/* Form Nodes */}
          <div className="grid gap-12">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-5">
                <div className="flex justify-between items-center px-4">
                  <label className={labelClasses}><Type size={14} className="text-blue-400" /> Identity_Header (EN)</label>
                  <AutoTranslate text={form.titleEn} onTranslate={val => setForm({...form, titleBn: val})} />
                </div>
                <input value={form.titleEn} onChange={e => setForm({...form, titleEn: e.target.value})} className={inputClasses} placeholder="Structural Consulting Unit" />
              </div>
              <div className="space-y-5">
                <label className={labelClasses}>Identity_Header (BN)</label>
                <input value={form.titleBn} onChange={e => setForm({...form, titleBn: e.target.value})} className={inputClasses} placeholder="কাঠামোগত পরামর্শ" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-5">
                <div className="flex justify-between items-center px-4">
                  <label className={labelClasses}><Layers size={14} className="text-indigo-400" /> Capability_Abstract (EN)</label>
                  <AutoTranslate text={form.summaryEn} onTranslate={val => setForm({...form, summaryBn: val})} />
                </div>
                <textarea rows={6} value={form.summaryEn} onChange={e => setForm({...form, summaryEn: e.target.value})} className={`${inputClasses} resize-none mb-0 leading-relaxed`} placeholder="Professional engineering analysis and structural solution deployment..." />
              </div>
              <div className="space-y-5">
                <label className={labelClasses}>Capability_Abstract (BN)</label>
                <textarea rows={6} value={form.summaryBn} onChange={e => setForm({...form, summaryBn: e.target.value})} className={`${inputClasses} resize-none mb-0 leading-relaxed`} placeholder="পেশাদার ইঞ্জিনিয়ারিং বিশ্লেষণ..." />
              </div>
            </div>

            {/* Technical Node */}
            <div className="pt-10">
               <div className="bg-[#0d0f1a]/40 border border-white/[0.05] rounded-[48px] p-12 md:p-16 relative overflow-hidden group/tech shadow-2xl backdrop-blur-3xl">
                  <div className="absolute top-0 right-0 h-1.5 w-80 bg-gradient-to-l from-violet-500/30 to-transparent rounded-bl-full" />
                  <div className="flex items-center gap-6 mb-12">
                     <div className="p-4 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
                        <Settings size={22} strokeWidth={1.5} />
                     </div>
                     <div>
                        <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-white italic mb-1">Technical_Protocol</h3>
                        <p className="text-[9px] text-slate-700 font-bold uppercase tracking-[0.2em] italic">Routing_And_Visual_Identifiers</p>
                     </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-12">
                     <div className="space-y-4">
                        <label className={labelClasses}><Cpu size={14} className="text-cyan-400" /> Lucide_Icon_Node</label>
                        <input value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} className={inputClasses} placeholder="Briefcase, Settings, Cpu..." />
                     </div>
                     <div className="space-y-4">
                        <label className={labelClasses}><Sparkles size={14} className="text-violet-400" /> Logical_Slug</label>
                        <input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className={inputClasses} placeholder="structural-consultancy" />
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

    </AdminModuleWrapper>
  );
}
