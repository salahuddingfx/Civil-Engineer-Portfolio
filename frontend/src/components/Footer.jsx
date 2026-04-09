import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { t } from "../lib/translations";
import { fetchContent } from "../lib/api";
import { ArrowRight } from "lucide-react";
import { Facebook, Linkedin, Instagram, Twitter, Youtube } from "./BrandIcons";

export default function Footer() {
  const { language } = useLanguage();
  const [socials, setSocials] = useState(null);

  useEffect(() => {
    async function loadSocials() {
      try {
        const response = await fetchContent("contactDetails", { limit: 1 });
        if (response.items?.[0]?.socialLinks) {
          setSocials(response.items[0].socialLinks);
        }
      } catch (err) {
        console.warn("Failed to load dynamic social links.");
      }
    }
    loadSocials();
  }, []);

  const socialIcons = [
    { id: 'facebook', icon: Facebook, url: socials?.facebook },
    { id: 'linkedin', icon: Linkedin, url: socials?.linkedin },
    { id: 'instagram', icon: Instagram, url: socials?.instagram },
    { id: 'twitter', icon: Twitter, url: socials?.twitter },
    { id: 'youtube', icon: Youtube, url: socials?.youtube },
  ].filter(s => s.url);

  return (
    <footer
      id="main-footer"
      className="relative pt-32 pb-16 overflow-hidden"
      style={{ background: "var(--bg)", borderTop: "1px solid var(--highlight-border)" }}
    >
      <div className="mx-auto max-w-[1500px] px-6 md:px-10">
        <div className="grid gap-20 lg:grid-cols-[1.5fr_0.8fr_0.8fr_1fr]">

          {/* Brand & CTA Column */}
          <div className="space-y-10">
            <div className="space-y-4">
              <Link to="/" className="flex items-center gap-1.5 font-display text-[24px] font-black tracking-[0.06em]" style={{ color: "var(--text)" }}>
                Engr. Alam<span style={{ color: "var(--highlight)" }}> Ashik</span>
              </Link>
              <p className="text-[14px] leading-relaxed max-w-sm" style={{ color: "var(--text-muted)" }}>
                {t("footer.tagline", language)}
              </p>
            </div>

            {/* Hire Me CTA */}
            <Link
              to="/contact"
              className="inline-flex items-center gap-4 px-8 py-4 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 group"
              style={{ 
                background: "var(--highlight)", 
                color: "#0A0F1C",
                boxShadow: "0 8px 30px var(--highlight-soft)" 
              }}
            >
              {t("nav.hire_me", language)}
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <div className="flex flex-wrap gap-4">
              {socialIcons.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-2xl transition-all group"
                  style={{ border: "1px solid var(--highlight-border)", background: "var(--highlight-soft)", color: "var(--text-muted)" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--highlight)"; e.currentTarget.style.color = "var(--highlight)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--highlight-border)"; e.currentTarget.style.color = "var(--text-muted)"; }}
                  aria-label={social.id}
                >
                  <social.icon size={20} className="group-hover:scale-110 transition-transform" />
                </a>
              ))}
              {socialIcons.length === 0 && (
                 <p className="text-[10px] uppercase font-bold tracking-widest opacity-20">No social links configured</p>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-8">
            <h4 className="text-[11px] font-black uppercase tracking-[0.4em]" style={{ color: "var(--highlight)" }}>
              {language === "en" ? "EXPLORE" : "অন্বেষণ"}
            </h4>
            <ul className="space-y-5">
              {[
                { to: "/", key: "nav.home" },
                { to: "/projects", key: "nav.projects" },
                { to: "/services", key: "nav.services" },
                { to: "/gallery", key: "nav.gallery" },
                { to: "/contact", key: "nav.contact" },
              ].map(({ to, key }) => (
                <li key={to}>
                  <Link to={to} className="text-[13px] font-medium transition-colors"
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={e => e.currentTarget.style.color = "var(--text)"}
                    onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
                  >
                    {t(key, language)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-8">
            <h4 className="text-[11px] font-black uppercase tracking-[0.4em]" style={{ color: "var(--highlight)" }}>
              {language === "en" ? "RESOURCES" : "রিসোর্স"}
            </h4>
            <ul className="space-y-5">
              {[
                { to: "/about", label: language === "en" ? "About Studio" : "স্টুডিও সম্পর্কে" },
                { to: "/testimonials", label: language === "en" ? "Peer Reviews" : "পিয়ার রিভিউ" },
                { to: "/privacy-policy", label: language === "en" ? "Privacy Protocol" : "প্রাইভেসি প্রোটোকল" },
                { to: "/terms", label: language === "en" ? "Legal Terms" : "লিগ্যাল শর্তাবলী" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-[13px] font-medium transition-colors"
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={e => e.currentTarget.style.color = "var(--text)"}
                    onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-10">
            <div className="space-y-4">
              <h4 className="text-[11px] font-black uppercase tracking-[0.4em]" style={{ color: "var(--highlight)" }}>
                {language === "en" ? "System Updates" : "সিস্টেম আপডেট"}
              </h4>
              <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {language === "en" ? "Subscribe to receive professional structural engineering insights." : "ইঞ্জিনিয়ারিং ইনসাইট পেতে সাবস্ক্রাইব করুন।"}
              </p>
            </div>
            
            <div className="relative group">
              <input
                type="email"
                placeholder={language === "en" ? "identity@protocol.com" : "ইমেইল @ প্রোটোকল"}
                className="w-full rounded-2xl p-5 outline-none transition-all pr-16"
                style={{ background: "var(--bg-accent)", border: "1px solid var(--highlight-border)", color: "var(--text)" }}
                onFocus={e => e.currentTarget.style.borderColor = "var(--highlight)"}
                onBlur={e => e.currentTarget.style.borderColor = "var(--highlight-border)"}
              />
              <button
                className="absolute right-2 top-2 h-12 w-12 rounded-xl flex items-center justify-center transition-all bg-white text-black"
                onMouseEnter={e => { e.currentTarget.style.background = "var(--highlight)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "white"; }}
                aria-label="Subscribe"
              >
                <ArrowRight size={18} strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-24 pt-10 flex flex-col md:flex-row justify-between items-center gap-8"
          style={{ borderTop: "1px solid var(--highlight-border)" }}>
          <p className="text-[10px] font-black tracking-[0.4em] uppercase" style={{ color: "var(--text-faint)" }}>
            © {new Date().getFullYear()} Engr. Alam Ashik // Structural Integrity Protocol
          </p>
          
          <p className="text-[10px] flex items-center gap-3 font-black tracking-[0.3em] uppercase" style={{ color: "var(--text-faint)" }}>
            <span>{t("footer.developed_by", language)}</span>
            <a href="https://salahuddin.codes" target="_blank" rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg transition-all"
              style={{ 
                background: "var(--highlight-soft)", 
                color: "var(--highlight)",
                border: "1px solid var(--highlight-border)"
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--highlight)"; e.currentTarget.style.color = "#0A0F1C"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--highlight-soft)"; e.currentTarget.style.color = "var(--highlight)"; }}
            >
              SALAH UDDIN KADER
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
