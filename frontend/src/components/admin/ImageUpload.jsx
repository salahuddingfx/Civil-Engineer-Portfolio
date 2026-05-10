import { useState, useRef } from "react";
import { Upload, X, ImageIcon, CheckCircle2, AlertCircle, Loader2, ImagePlus, RefreshCcw } from "lucide-react";
import { api } from "../../lib/api";

export default function ImageUpload({ value, onChange, label = "Upload Image" }) {
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
      setError("Please upload an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10MB");
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
      setError("Failed to upload image. Please try again.");
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
        <label className="flex items-center gap-2 text-[10px] font-bold text-[color:var(--admin-text-label)] uppercase tracking-[0.1em]">
          <ImageIcon size={12} className="text-sky-500" />
          {label}
        </label>
        {value && !uploading && (
          <button 
            type="button" 
            onClick={removeImage}
            className="text-[9px] font-bold text-red-500 uppercase tracking-widest hover:text-red-600 transition-colors flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-red-500/5"
          >
            <X size={10} /> Remove
          </button>
        )}
      </div>

      {/* Main Upload Area */}
      <div 
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`relative group cursor-pointer overflow-hidden rounded-[20px] border-2 transition-all duration-500 min-h-[180px] flex flex-col items-center justify-center
          ${isDragging ? "border-sky-500 bg-sky-500/5 scale-[1.01]" : "border-[color:var(--admin-border)] bg-[var(--admin-card)]"}
          ${!value && !isDragging ? "border-dashed" : "border-solid"}
          hover:border-sky-400/50
        `}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-4 p-8">
            <Loader2 size={28} className="text-sky-500 animate-spin" />
            <p className="text-[10px] font-bold text-sky-500 uppercase tracking-widest">Uploading...</p>
          </div>
        ) : value ? (
          <div className="w-full h-full relative group/preview">
            <img 
              src={value} 
              alt="Preview" 
              className="w-full h-[180px] object-cover transition-all duration-500 group-hover/preview:scale-105 group-hover/preview:blur-[1px]" 
            />
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-all duration-500 flex flex-col items-center justify-center gap-2 backdrop-blur-[2px]">
               <div className="p-2.5 rounded-full bg-white/20 border border-white/30 text-white">
                  <RefreshCcw size={18} />
               </div>
               <p className="text-[10px] font-bold text-white uppercase tracking-wider">Change Image</p>
            </div>

            {/* Status Badge */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none">
               <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 shadow-lg">
                  <CheckCircle2 size={12} className="text-emerald-500" />
                  <span className="text-[9px] font-bold text-white uppercase tracking-wide">Uploaded Successfully</span>
               </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center p-8">
            <div className="p-4 rounded-2xl bg-[var(--admin-bg)] border border-[color:var(--admin-border)] text-[color:var(--admin-text-label)] group-hover:text-sky-500 group-hover:border-sky-500 transition-all duration-500">
              <ImagePlus size={24} strokeWidth={1.5} />
            </div>
            
            <div className="space-y-1.5">
              <h4 className="text-[11px] font-bold text-[color:var(--admin-text-heading)] uppercase tracking-wider">
                {isDragging ? "Drop to Upload" : "Click or Drag to Upload"}
              </h4>
              <p className="text-[9px] text-[color:var(--admin-text-secondary)] font-medium">
                Supports: JPG, PNG, WEBP (Max 10MB)
              </p>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="absolute top-3 inset-x-3 flex items-center justify-center z-20">
            <div className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wide">{error}</span>
              <button onClick={(e) => { e.stopPropagation(); setError(""); }} className="ml-1 hover:opacity-70">
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
    </div>
  );
}
