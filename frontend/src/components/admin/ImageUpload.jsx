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
        <label className="text-[10px] font-black text-[color:var(--admin-text-label)] uppercase tracking-[0.2em] italic">{label}</label>
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
        className={`relative group cursor-pointer overflow-hidden rounded-2xl border transition-all duration-500 min-h-[120px] sm:min-h-[160px] flex flex-col items-center justify-center ${
          value 
            ? "border-[color:var(--admin-border)] bg-[var(--admin-card)] opacity-90" 
            : "border-[color:var(--admin-border)] border-dashed bg-[var(--admin-card)] opacity-90 hover:border-sky-400 hover:bg-[#19D2FF]/[0.02]"
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={24} className="text-sky-600 animate-spin" />
            <p className="text-[9px] font-black text-sky-600 uppercase tracking-widest animate-pulse">Syncing to Archive...</p>
          </div>
        ) : value ? (
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <div className="relative group/preview max-w-sm w-full">
              <img 
                src={value} 
                alt="Asset preview" 
                className="w-full h-32 object-cover rounded-xl border border-[color:var(--admin-border)] shadow-lg group-hover:scale-[1.02] transition-transform duration-500" 
              />
              <div className="absolute inset-x-0 -bottom-3 flex justify-center">
                 <div className="flex items-center gap-2 text-sky-600 font-black text-[8px] uppercase tracking-widest bg-[#0D1220] px-3 py-1.5 rounded-lg border border-[color:var(--admin-border)] shadow-xl">
                    <CheckCircle2 size={10} /> Structural Asset Confirmed
                 </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center p-4 sm:p-8">
            <div className="p-3 sm:p-4 rounded-full bg-[var(--admin-card)] border border-[color:var(--admin-border)] text-[color:var(--admin-text-label)] group-hover:text-sky-600 group-hover:border-sky-300 group-hover:scale-110 transition-all duration-500">
              <Upload size={18} />
            </div>
            <div className="space-y-1">
              <p className="text-[9px] sm:text-[10px] font-black text-[color:var(--admin-text-heading)] uppercase tracking-[0.1em] italic">Deploy Media Unit</p>
              <p className="text-[7px] sm:text-[8px] text-[color:var(--admin-text-secondary)] uppercase tracking-widest font-black">Archive Requirements: IMG LIMIT 5MB</p>
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
