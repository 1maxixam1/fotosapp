import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,           // permite acceder desde otras interfaces (0.0.0.0)
    port: 5173,
    strictPort: true,
    hmr: {
      protocol: 'ws',     // fuerza WebSocket (no wss)
      host: 'localhost',  // ajusta el host del cliente HMR
      port: 5173,
    },
    watch: {
      usePolling: false,  // si estás en WSL/Docker y no refresca, pon true
    },
    // overlay: false,    // descomenta si no quieres ver el overlay de errores
  },
})
