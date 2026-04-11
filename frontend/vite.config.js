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
          if (id.includes("node_modules/three") || id.includes("node_modules/@react-three")) {
            return "three-bundle";
          }
          if (id.includes("node_modules/lucide-react")) {
            return "icons";
          }
          if (id.includes("node_modules/react-router-dom") || id.includes("node_modules/react-dom") || id.includes("node_modules/react/")) {
            return "react-core";
          }
          if (id.includes("node_modules/gsap")) {
            return "animations";
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
