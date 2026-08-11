import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// 路由切换时重置滚动位置，避免从首页中部进入项目页时停留在中间。
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
