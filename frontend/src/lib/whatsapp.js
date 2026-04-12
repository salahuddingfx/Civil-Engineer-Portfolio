export function toWhatsAppHref(input) {
  if (!input) {
    return "";
  }

  if (String(input).startsWith("http://") || String(input).startsWith("https://")) {
    return input;
  }

  const digits = String(input).replace(/\D/g, "");
  if (!digits) {
    return ""; // Favor empty over wrong hardcoded fallbacks
  }
  return `https://wa.me/${digits}`;
}
