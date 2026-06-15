import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000, // Đổi frontend sang 3001 để không conflict với API (port 3000)
    proxy: {
      // Mọi request từ frontend bắt đầu bằng /api sẽ được
      // Vite dev server forward server-side đến backend.
      // Vì proxy chạy phía Node.js (không phải browser) → không bị CORS block.
      '/api': {
        target: 'http://localhost:3000', // Backend API URL
        changeOrigin: true,              // Đổi Origin header thành target → backend nhận đúng origin
        secure: false,                   // Cho phép HTTP (không cần HTTPS ở local)
        // withCredentials được xử lý tự động khi dùng proxy
      },
    },
  },
})

