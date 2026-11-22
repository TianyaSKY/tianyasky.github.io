import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Deployed at the GitHub Pages root (tianyasky.github.io) with build-time prerendered deep links.
  // Assets must use absolute paths so deep routes like /projects/<id>/ do not resolve relative assets to 404.
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
})
