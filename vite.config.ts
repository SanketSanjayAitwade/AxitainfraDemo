// Axita Infrastructure ERP - Vite Configuration
// Production-ready TanStack Start SSR setup with Nitro backend
import { defineConfig } from "vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    react(),
    tailwindcss(),
    tsconfigPaths(),
    nitro(),
  ],
  build: {
    target: "esnext",
  },
  ssr: {
    external: ["sonner"],
  },
});
