import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    // Split vendor chunks for better browser caching
    rollupOptions: {
      output: {
        // manualChunks as a function (required by Vite/Rollup TypeScript types)
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/leaflet') || id.includes('node_modules/react-leaflet')) {
            return 'map-vendor';
          }
          if (id.includes('node_modules/three') || id.includes('node_modules/@react-three')) {
            return 'three-vendor';
          }
        },
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'leaflet', 'react-leaflet'],
  },
})
