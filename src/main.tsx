import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

// Self-hosted fonts keep typography consistent on LAN/Tailscale clients.
import '@fontsource/cormorant-garamond/latin-500.css'
import '@fontsource/cormorant-garamond/latin-500-italic.css'
import '@fontsource/cormorant-garamond/latin-700.css'
import '@fontsource/cormorant-garamond/latin-700-italic.css'
import '@fontsource/corinthia/latin-700.css'
import '@fontsource/manrope/latin-400.css'
import '@fontsource/manrope/latin-500.css'
import '@fontsource/manrope/latin-600.css'
import '@fontsource/manrope/latin-700.css'
import '@fontsource/noto-serif/latin-400.css'
import '@fontsource/noto-serif/latin-400-italic.css'
import '@fontsource/noto-serif/latin-700.css'
import '@fontsource/noto-serif/latin-700-italic.css'
import '@fontsource/poppins/latin-400.css'
import '@fontsource/poppins/latin-500.css'
import '@fontsource/poppins/latin-600.css'

import './index.css'
import App from './App.tsx'
import { ModeProvider } from './context/ModeContext'

// Always start a fresh load from the top instead of restoring the browser's
// previous scroll position (especially important for the pinned culture carousel).
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}
window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })

/* 
 * [Refactor]: Konfigurasi Entry Point Utama (main.tsx)
 * File ini adalah titik awal (entry point) aplikasi Vite. 
 * Di sini kita menginisialisasi React DOM root, mengimpor styling global (index.css), 
 * dan membungkus App dengan BrowserRouter serta context provider.
 */
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ModeProvider>
      <App />
    </ModeProvider>
  </BrowserRouter>,
)

// Register Service Worker for caching images, fonts & 3D models on slow networks
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (reg) => console.log('[ServiceWorker] Registered with scope:', reg.scope),
      (err) => console.warn('[ServiceWorker] Registration failed:', err)
    );
  });
}


