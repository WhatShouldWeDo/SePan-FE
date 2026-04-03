import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          // Charts — recharts + 내부 d3 의존성 포함 (geo보다 먼저 체크)
          if (id.includes("/recharts/")) return "vendor-charts";

          // Geo — d3-geo 계열만 (recharts 내부 d3와 분리)
          if (/\/d3-(geo|selection|transition|zoom)\//.test(id))
            return "vendor-geo";
          if (id.includes("/topojson-client/")) return "vendor-geo";

          // UI — radix, icons, utilities
          if (id.includes("/radix-ui/")) return "vendor-ui";
          if (id.includes("/lucide-react/")) return "vendor-ui";
          if (id.includes("/class-variance-authority/")) return "vendor-ui";
          if (id.includes("/clsx/")) return "vendor-ui";
          if (id.includes("/tailwind-merge/")) return "vendor-ui";
          if (id.includes("/sonner/")) return "vendor-ui";

          // React core
          if (id.includes("/react-dom/")) return "vendor-react";
          if (id.includes("/react/")) return "vendor-react";
          if (id.includes("/react-router")) return "vendor-react";
          if (id.includes("/@tanstack/react-query/")) return "vendor-react";
        },
      },
    },
  },
})
