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

const overlay = document.createElement("div");
overlay.id = "__version_check_overlay__";
overlay.innerHTML = `
  <div style="position:fixed;inset:0;z-index:99999;background:#0f172a;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#94a3b8;font-family:system-ui,-apple-system,sans-serif;">
    <div style="width:32px;height:32px;border:2px solid #1e293b;border-top-color:#19D2FF;border-radius:50%;animation:__spin__ 0.8s linear infinite;"></div>
    <p style="margin-top:16px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;font-weight:700;">Updating...</p>
  </div>
  <style>@keyframes __spin__{to{transform:rotate(360deg)}}</style>
`;

(async function enforceFreshShell() {
  const myUrl = import.meta.url || "";
  const myMatch = myUrl.match(/\/assets\/index-([A-Za-z0-9_-]+)\.js/);
  const myHash = myMatch?.[1];
  if (!myHash) return;

  try {
    document.body.appendChild(overlay);

    const res = await fetch("/index.html", { cache: "no-store" });
    if (!res.ok) {
      overlay.remove();
      return;
    }
    const html = await res.text();
    const serverMatch = html.match(/\/assets\/index-([A-Za-z0-9_-]+)\.js/);
    const serverHash = serverMatch?.[1];

    if (serverHash && serverHash !== myHash) {
      const url = new URL(window.location.href);
      url.searchParams.set("_", String(Date.now()));
      window.location.replace(url.toString());
      return;
    }

    overlay.remove();
  } catch {
    overlay.remove();
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
