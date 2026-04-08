export function toWhatsAppHref(input) {
  if (!input) {
    return "https://wa.me/8801829618805";
  }

  if (String(input).startsWith("http://") || String(input).startsWith("https://")) {
    return input;
  }

  const digits = String(input).replace(/\D/g, "");
  if (!digits) {
    return "https://wa.me/8801829618805";
  }
  return `https://wa.me/${digits}`;
}
