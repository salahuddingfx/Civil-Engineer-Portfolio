import { useState } from "react";
import { Languages, Loader2 } from "lucide-react";
import { adminTranslate } from "../../lib/api";

export default function AutoTranslate({ text, onTranslate, targetLang = "bn" }) {
  const [translating, setTranslating] = useState(false);

  const handleTranslate = async () => {
    if (!text) return;
    setTranslating(true);
    try {
      const translated = await adminTranslate(text, targetLang);
      onTranslate(translated);
    } catch (err) {
      console.error("Translation error:", err);
    } finally {
      setTranslating(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleTranslate}
      disabled={translating || !text}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border border-cyan-400/20 bg-cyan-400/5 text-sky-600 text-[9px] font-black uppercase tracking-widest hover:bg-cyan-400/10 transition-all active:scale-95 disabled:opacity-50 ${translating ? "animate-pulse" : ""}`}
      title="Auto-translate to Bengali"
    >
      {translating ? <Loader2 size={12} className="animate-spin" /> : <Languages size={12} />}
      {translating ? "SYNCING..." : "AUTO-BN"}
    </button>
  );
}
