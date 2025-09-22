import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/weather_frontend/',   // 👈 required for GitHub Pages
  server: {
    host: "127.0.0.1",  // force IPv4
    port: 3000          // local dev port
  }
})

