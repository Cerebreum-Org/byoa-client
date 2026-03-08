import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": resolve(__dirname, "src") } },
  base: command === "build" ? "./" : "/",
  server: {
    host: "0.0.0.0",
    proxy: {
      // WebSocket server runs on 3002 — must be proxied separately
      "/api/ws": {
        target: "http://localhost:3002",
        changeOrigin: true,
        ws: true,
      },
      // All other API calls go to Next.js on 3000
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
}));
