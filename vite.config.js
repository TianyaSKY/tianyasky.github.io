import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 站点部署在 GitHub Pages 根路径（tianyasky.github.io），深链接由构建期预渲染成真实文件，
  // 因此资源必须用绝对路径 —— 相对路径（'./assets/…'）在 /projects/<id>/ 这类深层页面会被解析到子目录而 404。
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
})
