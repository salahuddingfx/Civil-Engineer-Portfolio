import { useRef, useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import gsap from "gsap";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { t } from "../lib/translations";

const links = [
  { to: "/",             key: "home" },
  { to: "/about",        key: "about" },
  { to: "/services",     key: "services" },
  { to: "/projects",     key: "projects" },
  { to: "/testimonials", key: "testimonials" },
  { to: "/gallery",      key: "gallery" },
  { to: "/contact",      key: "contact" },
];

function DesktopNavLink({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative px-4 py-2 text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 ${
          isActive ? "text-[var(--highlight)]" : "text-[var(--text-muted)] hover:text-[var(--text)]"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {label}
          {isActive && (
            <span className="absolute -bottom-[2px] left-1/2 h-[1px] w-6 -translate-x-1/2"
              style={{ background: "var(--highlight)", boxShadow: "0 0 8px var(--highlight)" }} />
          )}
        </>
      )}
    </NavLink>
  );
}

export default function Navbar() {
  const { language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const isDark = theme === "dark";

  useEffect(() => {
    let ctx = gsap.context(() => {
      if (menuOpen && menuRef.current) {
        gsap.fromTo(menuRef.current,
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: "expo.out" }
        );
      }
    });
    return () => ctx.revert();
  }, [menuOpen]);

  return (
    <header
      className="fixed top-0 z-[100] w-full backdrop-blur-xl"
      style={{
        background: "var(--navbar-bg)",
        borderBottom: "1px solid var(--navbar-border)",
      }}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-10">
        {/* Logo */}
        <NavLink
          to="/"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-1.5 font-display text-[14px] font-extrabold tracking-[0.12em]"
          style={{ color: "var(--text)" }}
        >
          Engr. Alam<span style={{ color: "var(--highlight)" }}> Ashik</span>
        </NavLink>

        {/* Desktop Nav */}
        <nav aria-label="Primary" className="hidden items-center md:flex">
          {links.map((link) => (
            <DesktopNavLink key={link.to} to={link.to} label={t(`nav.${link.key}`, language)} />
          ))}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] transition-colors"
            style={{ color: "var(--text-muted)" }}
            aria-label="Toggle Language"
          >
            <span style={{ color: language === "en" ? "var(--highlight)" : "var(--text-muted)" }}>EN</span>
            <span className="h-2 w-[1px]" style={{ background: "var(--highlight-border)" }} />
            <span style={{ color: language === "bn" ? "var(--highlight)" : "var(--text-muted)" }}>বাং</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-all"
            style={{
              background: "var(--highlight-soft)",
              color: "var(--highlight)",
              border: "1px solid var(--highlight-border)",
            }}
            aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? (
              /* Sun icon */
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.36-6.36l-.7.7M6.34 17.66l-.7.7m12.02 0l-.7-.7M6.34 6.34l-.7-.7M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              /* Moon icon */
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            )}
          </button>

          {/* Hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
            aria-label="Toggle Menu"
          >
            <span className={`h-[1px] w-5 transition-transform duration-300 ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`}
              style={{ background: "var(--text)" }} />
            <span className={`h-[1px] w-4 transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`}
              style={{ background: "var(--text)" }} />
            <span className={`h-[1px] w-5 transition-transform duration-300 ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
              style={{ background: "var(--text)" }} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        ref={menuRef}
        className={`md:hidden overflow-hidden transition-all duration-500 ${menuOpen ? "max-h-[90vh] opacity-100" : "max-h-0 opacity-0"}`}
        style={{ background: "var(--bg)", borderBottom: "1px solid var(--highlight-border)" }}
      >
        <div className="flex flex-col p-4 px-6 gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block py-2 text-[14px] font-bold capitalize transition-all`
              }
              style={({ isActive }) => ({
                color: isActive ? "var(--highlight)" : "var(--text-muted)",
              })}
            >
              {t(`nav.${link.key}`, language)}
            </NavLink>
          ))}

          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className="mt-4 w-full rounded-xl py-3 text-center text-[14px] font-bold transition-colors"
            style={{ background: "var(--highlight)", color: "#0A0F1C" }}
          >
            {t("nav.hire_me", language)}
          </Link>
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 top-[68px] -z-10 md:hidden"
          style={{ background: "rgba(0,0,0,0.4)" }}
          onClick={() => setMenuOpen(false)}
        />
      )}
    </header>
  );
}
