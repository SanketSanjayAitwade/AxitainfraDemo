// Axita Infrastructure ERP - Vite Configuration
// TanStack Start SSR, deployed to Netlify via the official Netlify plugin
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import netlify from "@netlify/vite-plugin-tanstack-start";

export default defineConfig({
  plugins: [
    tanstackStart(),
    react(),
    tailwindcss(),
    tsconfigPaths(),
    netlify(),
  ],
  build: {
    target: "esnext",
  },
  ssr: {
    external: ["sonner"],
  },
});
