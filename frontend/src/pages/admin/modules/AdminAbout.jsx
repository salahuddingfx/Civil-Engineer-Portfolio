import { useState, useEffect } from "react";
import { UserCircle, PenTool, Award, Users, Zap, Clock, Plus, Trash2, Edit3, Save, CheckCircle2, ShieldAlert, ChevronRight } from "lucide-react";
import { adminList, adminUpdate, adminCreate, adminDelete } from "../../../lib/api";
import AdminModuleWrapper from "./AdminModuleWrapper";
import ImageUpload from "../../../components/admin/ImageUpload";

export default function AdminAbout() {
  const [activeTab, setActiveTab] = useState("bio");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [recordId, setRecordId] = useState(null);

  // Data States
  const [bioForm, setBioForm] = useState({
    titleEn: "", titleBn: "",
    summaryEn: "", summaryBn: "",
    bodyEn: "", bodyBn: "",
    featuredImageUrl: "",
  });
  const [skills, setSkills] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [team, setTeam] = useState([]);

  // Editor States
  const [editingItem, setEditingItem] = useState(null); // { type: 'skill'|'timeline'|'team', data: {} }

  useEffect(() => {
    async function loadAllData() {
      try {
        const [bioRes, skillsRes, timelineRes, teamRes] = await Promise.all([
          adminList("about", { limit: 1 }),
          adminList("skills", { sort: "order" }),
          adminList("timelineEntries", { sort: "order" }),
          adminList("teamMembers", { sort: "order" })
        ]);

        const bioItem = bioRes.items?.[0];
        if (bioItem) {
          setRecordId(bioItem._id);
          setBioForm({
            titleEn: bioItem.title?.en || "",
            titleBn: bioItem.title?.bn || "",
            summaryEn: bioItem.summary?.en || "",
            summaryBn: bioItem.summary?.bn || "",
            bodyEn: bioItem.body?.en || "",
            bodyBn: bioItem.body?.bn || "",
            featuredImageUrl: bioItem.featuredImage?.url || "",
          });
        }
        setSkills(skillsRes.items || []);
        setTimeline(timelineRes.items || []);
        setTeam(teamRes.items || []);
      } catch (err) {
        setStatus({ type: "error", message: "LOAD_FAILED: Check Neural Link" });
      } finally {
        setLoading(false);
      }
    }
    loadAllData();
  }, []);

  const handleSaveBio = async () => {
    setSaving(true);
    const payload = {
      slug: "about",
      title: { en: bioForm.titleEn, bn: bioForm.titleBn },
      summary: { en: bioForm.summaryEn, bn: bioForm.summaryBn },
      body: { en: bioForm.bodyEn, bn: bioForm.bodyBn },
      featuredImage: bioForm.featuredImageUrl ? { url: bioForm.featuredImageUrl } : null,
      isPublished: true,
    };
    try {
      if (recordId) await adminUpdate("about", recordId, payload);
      else {
        const res = await adminCreate("about", payload);
        setRecordId(res._id);
      }
      setStatus({ type: "success", message: "LEGACY_BIOGRAPHY_SYNCHRONIZED" });
    } catch (err) {
      setStatus({ type: "error", message: "BIOSYNC_PROTOCOL_FAILED" });
    } finally { setSaving(false); }
  };

  const handleItemAction = async (type, collection, data) => {
     setSaving(true);
     try {
        if (data._id) {
           await adminUpdate(collection, data._id, data);
           setStatus({ type: "success", message: `${type.toUpperCase()}_UNIT_UPDATED` });
        } else {
           const res = await adminCreate(collection, { ...data, slug: `${type}-${Date.now()}` });
           setStatus({ type: "success", message: `NEW_${type.toUpperCase()}_INITIALIZED` });
        }
        // Refresh local state
        const refresh = await adminList(collection, { sort: "order" });
        if (type === 'skill') setSkills(refresh.items);
        if (type === 'timeline') setTimeline(refresh.items);
        if (type === 'team') setTeam(refresh.items);
        setEditingItem(null);
     } catch (err) {
        setStatus({ type: "error", message: "OPERATION_FAILED" });
     } finally { setSaving(false); }
  };

  const handleItemDelete = async (type, collection, id) => {
     if (!window.confirm("CONFIRM_PERMANENT_DELETION?")) return;
     setSaving(true);
     try {
        await adminDelete(collection, id);
        const refresh = await adminList(collection, { sort: "order" });
        if (type === 'skill') setSkills(refresh.items);
        if (type === 'timeline') setTimeline(refresh.items);
        if (type === 'team') setTeam(refresh.items);
        setStatus({ type: "success", message: "UNIT_PURGED_SUCCESSFULLY" });
     } catch (err) {
        setStatus({ type: "error", message: "PURGE_FAILURE" });
     } finally { setSaving(false); }
  };

  const tabs = [
    { id: "bio", label: "Identity Bio", icon: UserCircle },
    { id: "skills", label: "Skills Node", icon: Zap },
    { id: "timeline", label: "Career Timeline", icon: Clock },
    { id: "team", label: "Studio Team", icon: Users },
  ];

  const inputClasses = "w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-6 py-4 text-white outline-none focus:border-cyan-400/50 focus:bg-white/[0.05] transition-all font-medium italic text-[13px]";
  const labelClasses = "block text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 mb-3 ml-2 italic";

  return (
    <AdminModuleWrapper
      title="Professional Registry"
      subtitle="Manage consultancy legacy, technical proficiencies, and studio personnel."
      icon={UserCircle}
      loading={loading}
      saving={saving}
      status={status}
      onSave={activeTab === 'bio' ? handleSaveBio : null}
    >
      <div className="space-y-12">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-4 p-2 bg-white/[0.02] border border-white/[0.05] rounded-[28px] max-w-fit">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setEditingItem(null); }}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl transition-all duration-300 text-[10px] font-black uppercase tracking-widest ${
                activeTab === tab.id ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/20' : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Bio */}
        {activeTab === 'bio' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className={labelClasses}>Identity Title (EN)</label>
                <input value={bioForm.titleEn} onChange={e => setBioForm({...bioForm, titleEn: e.target.value})} className={inputClasses} placeholder="Engr. Alam Ashik" />
              </div>
              <div className="space-y-2">
                <label className={labelClasses}>Identity Title (BN)</label>
                <input value={bioForm.titleBn} onChange={e => setBioForm({...bioForm, titleBn: e.target.value})} className={inputClasses} placeholder="ইঞ্জিনিয়ার আলম আশিক" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className={labelClasses}>Role Designation (EN)</label>
                <input value={bioForm.summaryEn} onChange={e => setBioForm({...bioForm, summaryEn: e.target.value})} className={inputClasses} placeholder="Principal Structural Consultant" />
              </div>
              <div className="space-y-2">
                <label className={labelClasses}>Role Designation (BN)</label>
                <input value={bioForm.summaryBn} onChange={e => setBioForm({...bioForm, summaryBn: e.target.value})} className={inputClasses} placeholder="প্রধান কাঠামোগত পরামর্শদাতা" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className={labelClasses}>Technical Biography (EN)</label>
                <textarea rows={6} value={bioForm.bodyEn} onChange={e => setBioForm({...bioForm, bodyEn: e.target.value})} className={`${inputClasses} resize-none`} />
              </div>
              <div className="space-y-2">
                <label className={labelClasses}>Technical Biography (BN)</label>
                <textarea rows={6} value={bioForm.bodyBn} onChange={e => setBioForm({...bioForm, bodyBn: e.target.value})} className={`${inputClasses} resize-none`} />
              </div>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-[40px] p-10">
               <ImageUpload value={bioForm.featuredImageUrl} onChange={val => setBioForm({...bioForm, featuredImageUrl: val})} label="Principal Profile Asset" />
            </div>
          </div>
        )}

        {/* Tab 2: Skills */}
        {activeTab === 'skills' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
            {editingItem?.type === 'skill' ? (
               <div className="bg-white/[0.03] border border-white/[0.08] rounded-[40px] p-12 space-y-8 relative">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-xl font-black text-white italic tracking-tighter uppercase font-display">Configure_Skill_Node</h3>
                     <button onClick={() => setEditingItem(null)} className="text-[10px] font-bold text-slate-500 hover:text-white uppercase transition-colors">Discard</button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <label className={labelClasses}>Skill Name (EN)</label>
                        <input value={editingItem.data.titleEn} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, titleEn: e.target.value}})} className={inputClasses} />
                     </div>
                     <div className="space-y-2">
                        <label className={labelClasses}>Skill Name (BN)</label>
                        <input value={editingItem.data.titleBn} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, titleBn: e.target.value}})} className={inputClasses} />
                     </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-8">
                     <div className="space-y-2 text-left">
                        <label className={labelClasses}>Proficiency (%)</label>
                        <input type="number" value={editingItem.data.proficiency} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, proficiency: e.target.value}})} className={inputClasses} />
                     </div>
                     <div className="space-y-2 text-left">
                        <label className={labelClasses}>Lucide Icon</label>
                        <input value={editingItem.data.icon} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, icon: e.target.value}})} className={inputClasses} placeholder="Zap, Layers, Code..." />
                     </div>
                     <div className="space-y-2 text-left">
                        <label className={labelClasses}>Display Order</label>
                        <input type="number" value={editingItem.data.order} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, order: e.target.value}})} className={inputClasses} />
                     </div>
                  </div>
                  <button onClick={() => handleItemAction('skill', 'skills', { 
                    ...editingItem.data, 
                    title: { en: editingItem.data.titleEn, bn: editingItem.data.titleBn } 
                  })} className="w-full py-5 rounded-2xl bg-cyan-400 text-black font-black uppercase text-[11px] tracking-widest hover:bg-cyan-300 transition-all flex items-center justify-center gap-3">
                     <Save size={16} /> Execute Command
                  </button>
               </div>
            ) : (
               <div className="grid md:grid-cols-2 gap-6">
                  {skills.map(skill => (
                    <div key={skill._id} className="group p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:border-cyan-400/30 transition-all flex items-center justify-between">
                       <div className="flex items-center gap-6">
                          <div className="h-12 w-12 rounded-xl bg-cyan-400/10 flex items-center justify-center text-cyan-400 font-bold transition-transform">{skill.proficiency}%</div>
                          <div>
                             <h4 className="text-white font-black italic tracking-tight uppercase text-lg leading-none">{skill.title?.en}</h4>
                             <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-2">ICON: {skill.icon}</p>
                          </div>
                       </div>
                       <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setEditingItem({ type: 'skill', data: { ...skill, titleEn: skill.title?.en, titleBn: skill.title?.bn } })} className="p-2 hover:text-cyan-400 transition-colors"><Edit3 size={16} /></button>
                          <button onClick={() => handleItemDelete('skill', 'skills', skill._id)} className="p-2 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
                       </div>
                    </div>
                  ))}
                  <button onClick={() => setEditingItem({ type: 'skill', data: { titleEn: '', titleBn: '', proficiency: 80, icon: 'Zap', order: skills.length + 1 } })} className="p-8 rounded-3xl border-2 border-dashed border-white/5 flex items-center justify-center gap-4 text-slate-700 hover:text-cyan-400 hover:border-cyan-400/20 transition-all group">
                     <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                     <span className="text-[11px] font-black uppercase tracking-widest">Add_Skill_Node</span>
                  </button>
               </div>
            )}
          </div>
        )}

        {/* Tab 3: Timeline */}
        {activeTab === 'timeline' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
             {editingItem?.type === 'timeline' ? (
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-[40px] p-12 space-y-8">
                   <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-black text-white italic tracking-tighter uppercase font-display">Log_Timeline_Step</h3>
                      <button onClick={() => setEditingItem(null)} className="text-[10px] font-bold text-slate-500 hover:text-white uppercase transition-colors">Discard</button>
                   </div>
                   <div className="grid md:grid-cols-3 gap-8 text-left">
                      <div className="space-y-2">
                         <label className={labelClasses}>Year/Date</label>
                         <input value={editingItem.data.year} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, year: e.target.value}})} className={inputClasses} placeholder="2024" />
                      </div>
                      <div className="space-y-2">
                         <label className={labelClasses}>Category</label>
                         <input value={editingItem.data.category} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, category: e.target.value}})} className={inputClasses} placeholder="Experience, Award..." />
                      </div>
                      <div className="space-y-2">
                         <label className={labelClasses}>Order</label>
                         <input type="number" value={editingItem.data.order} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, order: e.target.value}})} className={inputClasses} />
                      </div>
                   </div>
                   <div className="grid md:grid-cols-2 gap-8 text-left">
                      <div className="space-y-2">
                         <label className={labelClasses}>Step Title (EN)</label>
                         <input value={editingItem.data.titleEn} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, titleEn: e.target.value}})} className={inputClasses} />
                      </div>
                      <div className="space-y-2">
                         <label className={labelClasses}>Step Title (BN)</label>
                         <input value={editingItem.data.titleBn} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, titleBn: e.target.value}})} className={inputClasses} />
                      </div>
                   </div>
                   <div className="grid md:grid-cols-2 gap-8 text-left">
                      <div className="space-y-2 text-left">
                         <label className={labelClasses}>Step Description (EN)</label>
                         <textarea rows={3} value={editingItem.data.descEn} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, descEn: e.target.value}})} className={`${inputClasses} resize-none`} />
                      </div>
                      <div className="space-y-2 text-left">
                         <label className={labelClasses}>Step Description (BN)</label>
                         <textarea rows={3} value={editingItem.data.descBn} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, descBn: e.target.value}})} className={`${inputClasses} resize-none`} />
                      </div>
                   </div>
                   <button onClick={() => handleItemAction('timeline', 'timelineEntries', { 
                     ...editingItem.data, 
                     title: { en: editingItem.data.titleEn, bn: editingItem.data.titleBn },
                     description: { en: editingItem.data.descEn, bn: editingItem.data.descBn }
                   })} className="w-full py-5 rounded-2xl bg-cyan-400 text-black font-black uppercase text-[11px] tracking-widest hover:bg-cyan-300 transition-all flex items-center justify-center gap-3">
                      <Save size={16} /> Update Timeline
                   </button>
                </div>
             ) : (
                <div className="space-y-4">
                   {timeline.map(item => (
                     <div key={item._id} className="group p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:border-cyan-400/30 transition-all flex items-center justify-between">
                        <div className="flex items-start gap-10">
                           <div className="text-3xl font-black text-cyan-400/40 italic">{item.year}</div>
                           <div className="text-left">
                              <span className="text-[9px] font-black uppercase tracking-widest text-slate-700 bg-white/5 px-2 py-0.5 rounded-md mb-2 block w-fit">{item.category}</span>
                              <h4 className="text-xl font-black text-white italic tracking-tighter uppercase">{item.title?.en}</h4>
                              <p className="text-[11px] text-slate-500 mt-2 font-medium italic">{item.description?.en}</p>
                           </div>
                        </div>
                        <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => setEditingItem({ type: 'timeline', data: { ...item, titleEn: item.title?.en, titleBn: item.title?.bn, descEn: item.description?.en, descBn: item.description?.bn } })} className="p-2 hover:text-cyan-400 transition-colors"><Edit3 size={18} /></button>
                           <button onClick={() => handleItemDelete('timeline', 'timelineEntries', item._id)} className="p-2 hover:text-rose-500 transition-colors"><Trash2 size={18} /></button>
                        </div>
                     </div>
                   ))}
                   <button onClick={() => setEditingItem({ type: 'timeline', data: { year: '2024', category: 'Experience', titleEn: '', titleBn: '', descEn: '', descBn: '', order: timeline.length + 1 } })} className="w-full p-10 rounded-[40px] border-2 border-dashed border-white/5 flex items-center justify-center gap-6 text-slate-700 hover:text-cyan-400 transition-all group">
                      <Plus size={24} className="group-hover:rotate-90 transition-transform duration-500" />
                      <span className="text-[12px] font-black uppercase tracking-[0.4em]">Register_New_History_Node</span>
                   </button>
                </div>
             )}
          </div>
        )}

        {/* Tab 4: Team */}
        {activeTab === 'team' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
             {editingItem?.type === 'team' ? (
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-[40px] p-12 space-y-10 text-left">
                   <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-black text-white italic tracking-tighter uppercase font-display">Personnel_Configuration</h3>
                      <button onClick={() => setEditingItem(null)} className="text-[10px] font-bold text-slate-500 hover:text-white uppercase transition-colors">Discard</button>
                   </div>
                   <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className={labelClasses}>Full Name</label>
                         <input value={editingItem.data.name} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, name: e.target.value}})} className={inputClasses} />
                      </div>
                      <div className="space-y-2">
                         <label className={labelClasses}>Designation (EN)</label>
                         <input value={editingItem.data.descEn} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, descEn: e.target.value}})} className={inputClasses} />
                      </div>
                   </div>
                   <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className={labelClasses}>Bio (EN)</label>
                         <textarea rows={3} value={editingItem.data.bioEn} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, bioEn: e.target.value}})} className={`${inputClasses} resize-none`} />
                      </div>
                      <div className="space-y-2">
                         <label className={labelClasses}>LinkedIn Profile URL</label>
                         <input value={editingItem.data.linkedin} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, linkedin: e.target.value}})} className={inputClasses} />
                      </div>
                   </div>
                   <ImageUpload value={editingItem.data.imageUrl} onChange={val => setEditingItem({...editingItem, data: {...editingItem.data, imageUrl: val}})} label="Personnel Portrait" />
                   
                   <button onClick={() => handleItemAction('team', 'teamMembers', { 
                     ...editingItem.data, 
                     designation: { en: editingItem.data.descEn },
                     bio: { en: editingItem.data.bioEn },
                     image: editingItem.data.imageUrl ? { url: editingItem.data.imageUrl } : null,
                     socialLinks: { linkedin: editingItem.data.linkedin }
                   })} className="w-full py-5 rounded-2xl bg-cyan-400 text-black font-black uppercase text-[11px] tracking-widest hover:bg-cyan-300 transition-all flex items-center justify-center gap-3">
                      <Save size={16} /> Deploy Personnel Node
                   </button>
                </div>
             ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                   {team.map(member => (
                     <div key={member._id} className="group bg-[#0d0f1a]/40 border border-white/5 rounded-[40px] p-8 hover:border-cyan-400/30 transition-all overflow-hidden relative">
                        <div className="flex flex-col items-center text-center">
                           <div className="h-32 w-32 rounded-3xl overflow-hidden mb-6 transition-all duration-700 shadow-2xl border border-white/10">
                              <img src={member.image?.url || "https://avatar.iran.liara.run/public"} alt={member.name} className="h-full w-full object-cover" />
                           </div>
                           <h4 className="text-xl font-black text-white italic tracking-tighter uppercase mb-1">{member.name}</h4>
                           <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">{member.designation?.en}</p>
                           
                           <div className="mt-8 flex gap-4">
                              <button onClick={() => setEditingItem({ type: 'team', data: { ...member, descEn: member.designation?.en, bioEn: member.bio?.en, imageUrl: member.image?.url, linkedin: member.socialLinks?.linkedin } })} className="p-3 bg-white/5 hover:bg-cyan-400 hover:text-black rounded-xl transition-all"><Edit3 size={16} /></button>
                              <button onClick={() => handleItemDelete('team', 'teamMembers', member._id)} className="p-3 bg-white/5 hover:bg-rose-500 rounded-xl transition-all"><Trash2 size={16} /></button>
                           </div>
                        </div>
                     </div>
                   ))}
                   <button onClick={() => setEditingItem({ type: 'team', data: { name: '', descEn: '', bioEn: '', imageUrl: '', linkedin: '', order: team.length + 1 } })} className="h-full min-h-[300px] rounded-[48px] border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-6 text-slate-700 hover:text-cyan-400 transition-all group">
                      <Plus size={32} className="group-hover:rotate-180 transition-transform duration-1000" />
                      <span className="text-[10px] font-black uppercase tracking-[0.4em]">Register_New_Staff</span>
                   </button>
                </div>
             )}
          </div>
        )}
      </div>
    </AdminModuleWrapper>
  );
}
