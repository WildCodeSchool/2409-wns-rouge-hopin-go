import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
    proxy: {
      '/api': {
        target: "http://back:5000", // or http://localhost:5000 if you are running the front locally with npm run dev
        changeOrigin: true,
        secure: false,
      }
    },
  },
});
