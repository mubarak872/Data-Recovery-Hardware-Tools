import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Electron loads the built app from file://, so use relative asset paths.
  base: "./",
});
