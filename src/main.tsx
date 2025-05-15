
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);

// More aggressive removal of any dynamically added overlays or safe area elements
document.addEventListener('DOMContentLoaded', () => {
  // Initial removal
  removeOverlayElements();
  
  // Set up a periodic check to remove any dynamically added elements
  const interval = setInterval(removeOverlayElements, 500);
  
  // Clear interval after 10 seconds (20 checks)
  setTimeout(() => clearInterval(interval), 10000);
  
  function removeOverlayElements() {
    // Target all possible overlay elements with more specific selectors
    const selectors = [
      '[class*="safe"]', 
      '[class*="overlay"]', 
      '[class*="edge"]', 
      '[style*="bottom:0"]',
      '[class*="badge"]',
      '[id*="badge"]',
      '[class*="powered-by"]',
      '[id*="powered-by"]',
      '[class*="lovable"]',
      '[id*="lovable"]',
      'div[style*="position: fixed"]',
      'div[style*="position:fixed"]',
      'div[style*="bottom:"]',
      'div[style*="bottom: "]',
      '.safe-area-bottom',
      '.app-edge'
    ];
    
    document.querySelectorAll(selectors.join(', ')).forEach(el => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
  }
});
