
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);

// Remove any dynamically added overlays or safe area elements
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.querySelectorAll('[class*="safe"], [class*="overlay"], [class*="edge"], [style*="bottom:0"]').forEach(el => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
  }, 500);
});
