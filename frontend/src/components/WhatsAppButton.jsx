import { useEffect, useState } from "react";
import { getPrimaryContactDetails } from "../lib/api";
import { toWhatsAppHref } from "../lib/whatsapp";

export default function WhatsAppButton() {
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

  const showButton = contact ? contact.whatsappEnabled !== false : true;
  if (!showButton) {
    return null;
  }

  const href = toWhatsAppHref(contact?.whatsapp);
  const label = contact?.whatsappLabel || "WhatsApp Chat";

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="fixed right-4 bottom-4 md:right-6 md:bottom-6 z-[200] flex items-center gap-2 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] p-3 md:px-5 md:py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_35px_rgba(37,211,102,0.6)] group"
    >
      <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-5 md:h-5" fill="currentColor" aria-hidden="true">
        <path d="M20.52 3.49A11.75 11.75 0 0 0 12.12 0C5.5 0 .12 5.38.12 12c0 2.1.55 4.16 1.59 5.98L0 24l6.19-1.62A11.9 11.9 0 0 0 12.12 24h.01c6.62 0 12-5.38 12-12 0-3.2-1.25-6.2-3.61-8.51zm-8.4 18.5h-.01a9.85 9.85 0 0 1-5.01-1.36l-.36-.21-3.67.96.98-3.58-.23-.37a9.8 9.8 0 0 1-1.5-5.23c0-5.4 4.4-9.8 9.81-9.8 2.62 0 5.08 1.02 6.93 2.87a9.75 9.75 0 0 1 2.87 6.93c0 5.4-4.4 9.79-9.81 9.79zm5.38-7.35c-.3-.15-1.77-.88-2.04-.98-.27-.1-.47-.15-.66.15-.2.3-.77.98-.95 1.18-.17.2-.35.23-.65.08-.3-.15-1.26-.46-2.4-1.47a8.98 8.98 0 0 1-1.66-2.07c-.17-.3-.02-.47.13-.62.14-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.66-1.6-.9-2.2-.24-.58-.48-.5-.66-.5h-.56c-.2 0-.53.08-.8.38-.27.3-1.05 1.03-1.05 2.5 0 1.47 1.08 2.9 1.23 3.1.15.2 2.1 3.2 5.08 4.49.7.3 1.25.49 1.67.63.7.22 1.35.19 1.85.11.56-.08 1.77-.73 2.02-1.43.25-.7.25-1.3.17-1.43-.07-.12-.27-.2-.56-.35z" />
      </svg>
      <span className="hidden sm:inline">{label}</span>
      <span className="inline sm:hidden pr-2">Chat</span>
    </a>
  );
}
