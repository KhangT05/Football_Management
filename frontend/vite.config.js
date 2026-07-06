import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3001, // Frontend chạy trên 3001 để không conflict với API (port 3000)
    proxy: {
      // Mọi request từ frontend bắt đầu bằng /api sẽ được
      // Vite dev server forward server-side đến backend.
      // Vì proxy chạy phía Node.js (không phải browser) → không bị CORS block.
      '/api': {
        target: 'http://149.28.133.66:3000/', // Backend API URL (port 3000)
        changeOrigin: true,              // Đổi Origin header thành target → backend nhận đúng origin
        secure: false,                   // Cho phép HTTP (không cần HTTPS ở local)
        // withCredentials được xử lý tự động khi dùng proxy
      },
    },
  },
  build: {
    // Tắt sourcemap trong production → giảm build size đáng kể
    sourcemap: false,
    // Tách vendor bundles → browser cache riêng, chỉ tải lại khi dependency thay đổi
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // React core — ít thay đổi, cache lâu dài
            if (id.includes('react-dom') || id.includes('/react/')) {
              return 'vendor-react';
            }
            // Router — tách riêng vì là dependency lớn
            if (id.includes('react-router')) {
              return 'vendor-router';
            }
            // Utilities — axios, zustand
            if (id.includes('axios') || id.includes('zustand')) {
              return 'vendor-utils';
            }
            // Icons — lucide-react chứa nhiều SVG, tách riêng
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
          }
        },
      },
    },
  },
})

