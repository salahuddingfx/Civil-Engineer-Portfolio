import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("react-router-dom") || id.includes("react-dom") || id.includes("/react/")) {
            return "react";
          }
          if (id.includes("gsap")) {
            return "animation";
          }
          if (id.includes("react-hook-form") || id.includes("@hookform/resolvers") || id.includes("zod")) {
            return "forms";
          }
          return undefined;
        },
      },
    },
  },
})
