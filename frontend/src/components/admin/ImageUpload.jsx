import { useState, useRef } from "react";
import { Upload, X, ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { api } from "../../lib/api";

export default function ImageUpload({ value, onChange, label = "Upload Image" }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("INVALID_FILE_TYPE: MUST_BE_IMAGE");
      return;
    }

    // Validate file size (4MB limit)
    if (file.size > 4 * 1024 * 1024) {
      setError("FILE_TOO_LARGE: MAX_4MB");
      return;
    }

    setUploading(true);
    setError("");

    try {
      // Convert file to Base64 (Data URI) as expected by the backend controller
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
      // More descriptive error based on response
      const errMsg = err.response?.data?.message || "UPLOAD_FAILED: CONNECTION_ERROR";
      setError(errMsg.toUpperCase());
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    onChange("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] ml-1 italic">{label}</label>
        {value && (
          <button 
            type="button" 
            onClick={removeImage}
            className="text-[9px] font-bold text-rose-500 uppercase tracking-widest hover:text-rose-400 transition-colors flex items-center gap-2"
          >
            <X size={12} /> Clear Asset
          </button>
        )}
      </div>

      <div 
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`relative group cursor-pointer overflow-hidden rounded-[24px] md:rounded-[32px] border-2 border-dashed transition-all duration-500 min-h-[220px] flex flex-col items-center justify-center p-8 ${
          value 
            ? "border-cyan-500/20 bg-cyan-500/5 hover:border-cyan-500/40" 
            : "border-white/5 bg-white/1 hover:border-cyan-400/20 hover:bg-white/2"
        }`}
      >
        {value ? (
          <div className="relative w-full h-full flex flex-col items-center gap-6">
            <img src={value} alt="Uploaded preview" className="max-h-[160px] rounded-[16px] shadow-2xl object-cover border border-white/10" />
            <div className="flex items-center gap-3 text-cyan-400 font-mono text-[9px] uppercase tracking-widest bg-black/60 px-4 py-2 rounded-full border border-white/5">
              <CheckCircle2 size={12} /> Asset_Linked_Successfully
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 text-center">
            <div className={`h-16 w-16 rounded-[20px] border border-white/5 bg-white/2 flex items-center justify-center text-slate-500 transition-all duration-700 group-hover:bg-cyan-400 group-hover:text-black group-hover:scale-110 shadow-lg ${uploading ? 'animate-pulse' : ''}`}>
              {uploading ? <Upload className="animate-bounce" size={24} /> : <ImageIcon size={24} />}
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] italic">
                {uploading ? "Uploading_To_Cloud..." : "Click_To_Deploy_Media"}
              </p>
              <p className="text-[9px] text-[#444] uppercase tracking-widest font-bold">PNG, JPG, WEBP (MAX 4MB)</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-center gap-2 text-rose-500 font-mono text-[9px] uppercase tracking-widest">
            <AlertCircle size={12} /> {error}
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
