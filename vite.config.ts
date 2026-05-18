import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          gsap: ["gsap"],
          threeCore: ["three", "three-stdlib"],
          threeRuntime: ["@react-three/fiber", "@react-three/drei"],
          threeEffects: ["@react-three/postprocessing", "@react-three/rapier"],
        },
      },
    },
  },
});
