import { StrictMode, Component } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import "./index.css";
import App from "./App";

class RootErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error("[RootErrorBoundary]", error, info);
  }
  handleReload = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("_", String(Date.now()));
    window.location.replace(url.toString());
  };
  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "#94a3b8",
          background: "#0f172a",
          textAlign: "center",
        }}>
          <h1 style={{ fontSize: "20px", color: "#f1f5f9", marginBottom: "12px" }}>
            Something went wrong loading the site.
          </h1>
          <p style={{ fontSize: "13px", maxWidth: "420px", marginBottom: "24px" }}>
            A cached version of the app may be incompatible. Tap the button below to refresh.
          </p>
          <button
            onClick={this.handleReload}
            style={{
              padding: "12px 24px",
              background: "#19D2FF",
              color: "#000",
              border: "none",
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: "13px",
              cursor: "pointer",
              letterSpacing: "0.05em",
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

(async function enforceFreshShell() {
  const myUrl = import.meta.url || "";
  const myMatch = myUrl.match(/\/assets\/index-([A-Za-z0-9_-]+)\.js/);
  const myHash = myMatch?.[1];
  if (!myHash) return;

  try {
    const res = await fetch("/index.html", { cache: "no-store" });
    if (!res.ok) return;

    const html = await res.text();
    const serverMatch = html.match(/\/assets\/index-([A-Za-z0-9_-]+)\.js/);
    const serverHash = serverMatch?.[1];

    if (serverHash && serverHash !== myHash) {
      const reloadKey = "last_version_reload";
      const lastReload = sessionStorage.getItem(reloadKey);
      const now = Date.now();

      // Only reload if we haven't reloaded in the last 15 seconds to avoid infinite reload loop
      if (!lastReload || now - Number(lastReload) > 15000) {
        sessionStorage.setItem(reloadKey, String(now));
        const url = new URL(window.location.href);
        url.searchParams.set("_", String(now));
        window.location.replace(url.toString());
      } else {
        console.warn("[VersionCheck] Version mismatch detected, but reload throttled to prevent loop.");
      }
    }
  } catch (err) {
    console.warn("[VersionCheck] Background update verification failed:", err);
  }
})();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RootErrorBoundary>
      <HelmetProvider>
        <LanguageProvider>
          <ThemeProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ThemeProvider>
        </LanguageProvider>
      </HelmetProvider>
    </RootErrorBoundary>
  </StrictMode>
);
