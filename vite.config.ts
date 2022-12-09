import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Water Reminder",
        short_name: "MyApp",
        description:
          "Water Reminder is an APP to help you keep up with your daily water intake goal",
        theme_color: "#0EA5E9",
        icons: [
          {
            src: "water-svg.svg",
            sizes: "any",
            type: "image/svg+xml",
          },
          {
            src: "water-svg.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
      devOptions: {
        enabled: false,
        /* other options */
      },
    }),
  ],
});
