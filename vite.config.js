import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Deployed at the GitHub Pages root (tianyasky.github.io) with build-time prerendered deep links.
  // Assets must use absolute paths so deep routes like /projects/<id>/ do not resolve relative assets to 404.
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        home: fileURLToPath(new URL('./index.html', import.meta.url)),
        racingVisualizer: fileURLToPath(new URL('./projects/rl-racing/visualizer/index.html', import.meta.url)),
        visionVisualizer: fileURLToPath(new URL('./projects/vision-positioning/visualizer/index.html', import.meta.url))
      }
    },
    sourcemap: false
  }
})
