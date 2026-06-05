import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import "./index.css";
import App from "./App";

(async function enforceFreshShell() {
  try {
    const myUrl = import.meta.url || "";
    const myMatch = myUrl.match(/\/assets\/index-([A-Za-z0-9_-]+)\.js/);
    const myHash = myMatch?.[1];
    if (!myHash) return;

    const res = await fetch("/index.html", { cache: "no-store" });
    if (!res.ok) return;
    const html = await res.text();
    const serverMatch = html.match(/\/assets\/index-([A-Za-z0-9_-]+)\.js/);
    if (!serverMatch) return;
    const serverHash = serverMatch[1];

    if (serverHash !== myHash) {
      window.location.reload();
    }
  } catch {
    /* network or storage unavailable */
  }
})();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <LanguageProvider>
        <ThemeProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </LanguageProvider>
    </HelmetProvider>
  </StrictMode>
);
