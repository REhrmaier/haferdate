import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// relative base so github pages can serve the built app from a project url
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    outDir: "dist",
  },
})
