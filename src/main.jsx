import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// 构建期预渲染（scripts/prerender.mjs）会在 #root 内写入一份静态外壳：给不执行 JS 的
// 爬虫/分享预览机器人（QQ、微信、Twitter）以及禁用 JS 的访客看的内容与元信息。
// React 从这里接管前先清空它，避免出现重复正文。
const container = document.getElementById('root');
if (container.firstElementChild) {
  container.replaceChildren();
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
