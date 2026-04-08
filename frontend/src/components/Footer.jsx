import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { t } from "../lib/translations";

export default function Footer() {
  const { language } = useLanguage();

  return (
    <footer
      id="main-footer"
      className="relative pt-24 pb-12 overflow-hidden"
      style={{ background: "var(--bg)", borderTop: "1px solid var(--highlight-border)" }}
    >
      <div className="mx-auto max-w-[1500px] px-6 md:px-10">
        <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1.2fr]">

          {/* Brand Column */}
          <div className="space-y-8">
            <Link to="/" className="flex items-center gap-1.5 font-display text-[20px] font-black tracking-[0.06em]" style={{ color: "var(--text)" }}>
              Engr. Alam<span style={{ color: "var(--highlight)" }}> Ashik</span>
            </Link>
            <p className="text-[14px] leading-relaxed max-w-xs" style={{ color: "var(--text-muted)" }}>
              {t("footer.tagline", language)}
            </p>
            <div className="flex gap-4">
              {[
                { name: "Facebook",  path: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
                { name: "LinkedIn",  path: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" },
                { name: "Instagram", path: "M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5z M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z M17.5 6.5h.01" }
              ].map((social, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-12 w-12 items-center justify-center rounded-2xl transition-all group"
                  style={{ border: "1px solid var(--highlight-border)", background: "var(--highlight-soft)", color: "var(--text-muted)" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--highlight)"; e.currentTarget.style.color = "var(--highlight)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--highlight-border)"; e.currentTarget.style.color = "var(--text-muted)"; }}
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d={social.path} /></svg>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-8">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.4em]" style={{ color: "var(--highlight)" }}>
              {language === "en" ? "Navigation" : "নেভিগেশন"}
            </h4>
            <ul className="space-y-4">
              {[
                { to: "/",           key: "nav.home" },
                { to: "/projects",   key: "nav.projects" },
                { to: "/services",   key: "nav.services" },
                { to: "/gallery",    key: "nav.gallery" },
                { to: "/contact",    key: "nav.contact" },
              ].map(({ to, key }) => (
                <li key={to}>
                  <Link to={to} className="text-[13px] transition-colors"
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

          {/* Legal */}
          <div className="space-y-8">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.4em]" style={{ color: "var(--highlight)" }}>
              {language === "en" ? "Legal" : "আইনি"}
            </h4>
            <ul className="space-y-4">
              {[
                { to: "/privacy-policy", label: language === "en" ? "Privacy Policy" : "প্রাইভেসি নীতি" },
                { to: "/terms",          label: language === "en" ? "Terms of Service" : "সেবার শর্তাবলী" },
                { to: "/sitemap",        label: language === "en" ? "Site Map" : "সাইট ম্যাপ" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-[13px] transition-colors"
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
          <div className="space-y-8">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.4em]" style={{ color: "var(--highlight)" }}>
              {language === "en" ? "Newsletter" : "নিউজলেটার"}
            </h4>
            <div className="relative group">
              <input
                type="email"
                placeholder={language === "en" ? "Email Address" : "ইমেইল ঠিকানা"}
                className="w-full rounded-2xl p-5 outline-none transition-all"
                style={{ background: "var(--bg-accent)", border: "1px solid var(--highlight-border)", color: "var(--text)" }}
                onFocus={e => e.currentTarget.style.borderColor = "var(--highlight)"}
                onBlur={e => e.currentTarget.style.borderColor = "var(--highlight-border)"}
              />
              <button
                className="absolute right-2 top-2 h-10 w-10 rounded-xl flex items-center justify-center transition-colors"
                style={{ background: "var(--text)", color: "var(--bg)" }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--highlight)"; e.currentTarget.style.color = "#0A0F1C"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "var(--text)"; e.currentTarget.style.color = "var(--bg)"; }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 12h14m-7-7l7 7-7 7" /></svg>
              </button>
            </div>
            <p className="text-[11px] font-medium tracking-widest uppercase mt-4" style={{ color: "var(--text-faint)" }}>
              © {new Date().getFullYear()} Engr. Alam Ashik. {t("footer.rights", language)}.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-24 pt-8 flex flex-col md:flex-row justify-between items-center gap-6"
          style={{ borderTop: "1px solid var(--highlight-border)" }}>
          <div className="flex gap-10">
            {[
              { to: "/privacy-policy", label: language === "en" ? "Privacy" : "প্রাইভেসি" },
              { to: "/terms", label: language === "en" ? "Terms" : "শর্তাবলী" },
              { to: "/sitemap", label: language === "en" ? "Site Map" : "সাইট ম্যাপ" },
            ].map(({ to, label }) => (
              <Link key={to} to={to} className="text-[10px] uppercase tracking-widest transition-colors"
                style={{ color: "var(--text-faint)" }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--text)"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--text-faint)"}
              >
                {label}
              </Link>
            ))}
          </div>
          <p className="text-[10px] flex items-center gap-2 font-bold tracking-widest" style={{ color: "var(--text-faint)" }}>
            {t("footer.developed_by", language).toUpperCase()}{" "}
            <a href="https://salahuddin.codes" target="_blank" rel="noopener noreferrer"
              className="font-bold uppercase transition-colors"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--highlight)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
            >
              SALAH UDDIN KADER
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
