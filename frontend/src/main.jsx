import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import "./index.css";
import App from "./App";

const BUILD_STAMP = `__BUILD_${Date.now()}__`;

(function enforceFreshShell() {
  try {
    const last = sessionStorage.getItem("__build_stamp__");
    if (last && last !== BUILD_STAMP) {
      sessionStorage.setItem("__build_stamp__", BUILD_STAMP);
      window.location.reload();
      return;
    }
    if (!last) {
      sessionStorage.setItem("__build_stamp__", BUILD_STAMP);
    }
  } catch {
    /* sessionStorage unavailable */
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
