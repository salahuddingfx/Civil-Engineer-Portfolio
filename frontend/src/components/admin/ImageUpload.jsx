import { useState, useRef } from "react";
import { Upload, X, ImageIcon, CheckCircle2, AlertCircle, Loader2, ImagePlus, RefreshCcw } from "lucide-react";
import { api } from "../../lib/api";

export default function ImageUpload({ value, onChange, label = "Structural Media" }) {
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processUpload(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processUpload(file);
  };

  const processUpload = async (file) => {
    if (!file.type.startsWith("image/")) {
      setError("INVALID_FORMAT: MUST_BE_IMAGE");
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // Increased to 10MB
      setError("FILE_LIMIT_EXCEEDED: MAX_10MB");
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
    onChange("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <label className="flex items-center gap-2 text-[10px] font-black text-[color:var(--admin-text-label)] uppercase tracking-[0.2em] italic">
          <ImageIcon size={12} className="text-sky-500" />
          {label}
        </label>
        {value && !uploading && (
          <button 
            type="button" 
            onClick={removeImage}
            className="text-[9px] font-black text-red-500/60 uppercase tracking-widest hover:text-red-500 transition-colors flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-red-500/5"
          >
            <X size={10} /> Discard Asset
          </button>
        )}
      </div>

      {/* Main Upload Area */}
      <div 
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`relative group cursor-pointer overflow-hidden rounded-[24px] border-2 transition-all duration-500 min-h-[180px] flex flex-col items-center justify-center
          ${isDragging ? "border-sky-500 bg-sky-500/5 scale-[1.01] shadow-[0_0_30px_rgba(14,165,233,0.1)]" : "border-[color:var(--admin-border)] bg-[var(--admin-card)]"}
          ${!value && !isDragging ? "border-dashed" : "border-solid"}
          hover:border-sky-400/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)]
        `}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-5 p-8">
            <div className="relative">
              <Loader2 size={32} className="text-sky-500 animate-spin" />
              <div className="absolute inset-0 blur-lg bg-sky-500/20 animate-pulse" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-[10px] font-black text-sky-500 uppercase tracking-[0.2em]">Archiving Asset...</p>
              <p className="text-[8px] font-medium text-[color:var(--admin-text-secondary)] uppercase tracking-widest">Neural Link Active</p>
            </div>
          </div>
        ) : value ? (
          <div className="w-full h-full relative group/preview">
            <img 
              src={value} 
              alt="Asset preview" 
              className="w-full h-[180px] object-cover transition-all duration-700 group-hover/preview:scale-105 group-hover/preview:blur-[2px]" 
            />
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-[#0A0F1C]/60 opacity-0 group-hover/preview:opacity-100 transition-all duration-500 flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
               <div className="p-3 rounded-full bg-white/10 border border-white/20 text-white transform translate-y-4 group-hover/preview:translate-y-0 transition-transform duration-500">
                  <RefreshCcw size={20} />
               </div>
               <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] transform translate-y-4 group-hover/preview:translate-y-0 transition-transform duration-500 delay-75">Replace Media Unit</p>
            </div>

            {/* Status Badge */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-center pointer-events-none">
               <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0D1220]/80 backdrop-blur-md border border-white/10 shadow-2xl">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-[8px] font-black text-white uppercase tracking-[0.15em]">Media Unit Synchronized</span>
               </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5 text-center p-8">
            <div className="relative group/icon">
              <div className="absolute inset-0 blur-2xl bg-sky-500/10 group-hover/icon:bg-sky-500/20 transition-all duration-500" />
              <div className="relative p-5 rounded-[20px] bg-[var(--admin-bg)] border border-[color:var(--admin-border)] text-[color:var(--admin-text-label)] group-hover:text-sky-500 group-hover:border-sky-500/50 group-hover:scale-110 transition-all duration-500">
                <ImagePlus size={24} strokeWidth={1.5} />
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-[11px] font-black text-[color:var(--admin-text-heading)] uppercase tracking-[0.2em] italic">
                {isDragging ? "Release to Deploy" : "Deploy Media Unit"}
              </h4>
              <p className="text-[8px] text-[color:var(--admin-text-secondary)] uppercase tracking-[0.15em] font-medium leading-loose max-w-[200px]">
                Drag and drop or click to browse<br/>
                <span className="text-sky-500/80">Supports: JPG, PNG, WEBP (MAX 10MB)</span>
              </p>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="absolute top-4 inset-x-4 flex items-center justify-center z-20">
            <div className="flex items-center gap-3 bg-red-500/10 backdrop-blur-md border border-red-500/30 text-red-500 px-4 py-2.5 rounded-xl animate-in fade-in slide-in-from-top-4">
              <AlertCircle size={14} />
              <span className="text-[9px] font-black uppercase tracking-widest">{error}</span>
              <button onClick={(e) => { e.stopPropagation(); setError(""); }} className="ml-2 hover:opacity-70">
                <X size={12} />
              </button>
            </div>
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

      {/* Decorative Blueprint Line */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[color:var(--admin-border)] to-transparent opacity-30" />
    </div>
  );
}
