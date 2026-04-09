import { useState, useRef } from "react";
import { Upload, X, ImageIcon, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { api } from "../../lib/api";

export default function ImageUpload({ value, onChange, label = "Structural Media" }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("INVALID_FORMAT: MUST_BE_IMAGE");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("FILE_LIMIT_EXCEEDED: MAX_5MB");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const reader = new FileReader();
      const dataUri = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });

      const { data } = await api.post("/upload/image", { 
        dataUri,
        folder: "portfolio_assets" 
      });

      if (data?.url) {
        onChange(data.url);
      }
    } catch (err) {
      console.error("Upload failed", err);
      const errMsg = err.response?.data?.message || "TRANSMISSION_FAILED";
      setError(errMsg.toUpperCase());
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (e) => {
    e.stopPropagation();
    onChange(" "); // Triggering re-validation or just clearing
    setTimeout(() => onChange(""), 10);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] italic">{label}</label>
        {value && !uploading && (
          <button 
            type="button" 
            onClick={removeImage}
            className="text-[9px] font-black text-red-500/60 uppercase tracking-widest hover:text-red-500 transition-colors flex items-center gap-1.5"
          >
            <X size={12} /> Discard Asset
          </button>
        )}
      </div>

      <div 
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`relative group cursor-pointer overflow-hidden rounded-2xl border transition-all duration-500 min-h-[160px] flex flex-col items-center justify-center ${
          value 
            ? "border-white/[0.08] bg-white/[0.01]" 
            : "border-white/[0.05] border-dashed bg-white/[0.01] hover:border-[#19D2FF]/30 hover:bg-[#19D2FF]/[0.02]"
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={24} className="text-[#19D2FF] animate-spin" />
            <p className="text-[9px] font-black text-[#19D2FF] uppercase tracking-widest animate-pulse">Syncing_to_Archive...</p>
          </div>
        ) : value ? (
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <div className="relative group/preview max-w-sm w-full">
              <img 
                src={value} 
                alt="Asset preview" 
                className="w-full h-32 object-cover rounded-xl border border-white/[0.08] shadow-lg group-hover:scale-[1.02] transition-transform duration-500" 
              />
              <div className="absolute inset-x-0 -bottom-3 flex justify-center">
                 <div className="flex items-center gap-2 text-[#19D2FF] font-black text-[8px] uppercase tracking-widest bg-[#0D1220] px-3 py-1.5 rounded-lg border border-white/[0.05] shadow-xl">
                    <CheckCircle2 size={10} /> Structural_Asset_Confirmed
                 </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center p-8">
            <div className="p-4 rounded-full bg-white/[0.03] border border-white/[0.05] text-slate-600 group-hover:text-[#19D2FF] group-hover:border-[#19D2FF]/20 group-hover:scale-110 transition-all duration-500">
              <Upload size={20} />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-white uppercase tracking-[0.1em] italic">Deploy_Media_Unit</p>
              <p className="text-[8px] text-slate-700 uppercase tracking-widest font-black">Archive Requirements: IMG_LIMIT_5MB</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute bottom-4 flex items-center gap-2 text-red-500 bg-[#0D1220] px-4 py-2 rounded-lg border border-red-500/20 text-[8px] font-black uppercase tracking-widest animate-in slide-in-from-bottom-2">
            <AlertCircle size={10} /> {error}
          </div>
        )}

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/*"
        />
      </div>
    </div>
  );
}
