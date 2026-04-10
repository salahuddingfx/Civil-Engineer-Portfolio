import { useRef, useEffect } from "react";
import { Outlet } from "react-router-dom";
import gsap from "gsap";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import ScrollToTopButton from "./ScrollToTopButton";
import PageTransitionBar from "./PageTransitionBar";

export default function Layout({ isIntroComplete }) {
  const glowRef = useRef(null);
  const { language } = useLanguage();
  const { isDark } = useTheme();

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      gsap.to(glowRef.current, {
        x: clientX,
        y: clientY,
        duration: 2,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col overflow-x-hidden"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      <PageTransitionBar />

      {/* HUD: Corner Brackets — only visible in dark mode */}
      {isDark && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
          <div className="absolute top-8 left-8 h-8 w-8 border-t-2 border-l-2" style={{ borderTopColor: "var(--highlight-border)", borderLeftColor: "var(--highlight-border)" }} />
          <div className="absolute top-8 right-8 h-8 w-8 border-t-2 border-r-2" style={{ borderTopColor: "var(--highlight-border)", borderRightColor: "var(--highlight-border)" }} />
          <div className="absolute bottom-8 left-8 h-8 w-8 border-b-2 border-l-2" style={{ borderBottomColor: "var(--highlight-border)", borderLeftColor: "var(--highlight-border)" }} />
          <div className="absolute bottom-8 right-8 h-8 w-8 border-b-2 border-r-2" style={{ borderBottomColor: "var(--highlight-border)", borderRightColor: "var(--highlight-border)" }} />
          {/* HUD: Vertical Scale */}
          <div className="absolute top-1/2 left-4 h-32 w-px -translate-y-1/2 bg-gradient-to-b from-transparent to-transparent" style={{ background: `linear-gradient(to bottom, transparent, var(--highlight-border), transparent)` }} />
          <div className="absolute top-1/2 right-4 h-32 w-px -translate-y-1/2" style={{ background: `linear-gradient(to bottom, transparent, var(--highlight-border), transparent)` }} />
        </div>
      )}

      {/* Interactive Global Cursor Glow */}
      <div
        ref={glowRef}
        className="pointer-events-none fixed -left-[200px] -top-[200px] z-[-1] h-[500px] w-[500px] rounded-full blur-[140px] will-change-transform"
        style={{ background: "var(--highlight-soft)" }}
        aria-hidden="true"
      />

      {/* Background base */}
      <div className="fixed inset-0 z-[-2]" style={{ background: "var(--bg)" }} />

      {/* Skip to content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-sm focus:px-4 focus:py-2 focus:font-bold"
        style={{ background: "var(--highlight)", color: "#0A0F1C" }}
      >
        Skip to content
      </a>

      <Navbar isIntroComplete={isIntroComplete} />

      <main id="main-content" className="w-full flex-1">
        <Outlet />
      </main>

      <Footer />
      <WhatsAppButton />
      <ScrollToTopButton />
    </div>
  );
}
