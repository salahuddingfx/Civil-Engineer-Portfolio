import { useEffect, useMemo, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { getPrimaryContactDetails } from "../lib/api";
import { toWhatsAppHref } from "../lib/whatsapp";

export default function BottomActionBar() {
  const { theme, toggleTheme } = useTheme();
  const [contact, setContact] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function loadContact() {
      try {
        const data = await getPrimaryContactDetails();
        if (!ignore) {
          setContact(data);
        }
      } catch {
        if (!ignore) {
          setContact(null);
        }
      }
    }
    loadContact();
    return () => {
      ignore = true;
    };
  }, []);

  const whatsappEnabled = contact ? contact.whatsappEnabled !== false : true;
  const whatsappHref = useMemo(() => toWhatsAppHref(contact?.whatsapp), [contact]);
  const whatsappLabel = contact?.whatsappLabel || "WhatsApp";

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-cyan-300/20 bg-slate-950/85 px-3 py-3 backdrop-blur-xl md:hidden">
      <div className={`mx-auto grid max-w-md gap-2 ${whatsappEnabled ? "grid-cols-3" : "grid-cols-2"}`}>
        {whatsappEnabled ? (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-2xl border border-[#25D366]/50 bg-[#25D366]/18 px-3 py-3 text-sm font-semibold text-[#c8ffe1] shadow-[0_0_20px_rgba(37,211,102,0.2)] transition active:scale-[0.98]"
            aria-label={whatsappLabel}
          >
            <span className="text-base">◉</span>
            <span>{whatsappLabel}</span>
          </a>
        ) : null}

        <a
          href="/contact"
          className="flex items-center justify-center gap-2 rounded-2xl border border-cyan-300/25 bg-cyan-300/10 px-3 py-3 text-sm font-semibold text-cyan-100 shadow-[0_0_20px_rgba(25,210,255,0.12)] transition active:scale-[0.98]"
        >
          <span className="text-base">✦</span>
          <span>Contact</span>
        </a>

        <button
          type="button"
          onClick={toggleTheme}
          className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-3 py-3 text-sm font-semibold text-slate-100 shadow-[0_0_20px_rgba(255,255,255,0.05)] transition active:scale-[0.98]"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          <span className="text-base">◐</span>
          <span>{theme === "dark" ? "Light" : "Dark"}</span>
        </button>
      </div>
    </div>
  );
}
