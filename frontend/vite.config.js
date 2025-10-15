import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 1200,
    // Optimize for faster loading with esbuild (default, faster than terser)
    minify: 'esbuild',
    rollupOptions: {
      output: {
        // Let Vite handle chunking automatically for better module loading
        experimentalMinChunkSize: 20000, // Merge small chunks for fewer requests
      }
    }
  },
  // Performance optimizations
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
    exclude: ['three', '@react-three/fiber', '@react-three/drei'] // Load 3D libs on-demand
  }
})
