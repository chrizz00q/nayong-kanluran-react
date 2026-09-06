import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The PHP backend (this repo's /api, /uploads, etc.) is expected to be served
// by your local PHP stack (XAMPP/MAMP/`php -S`) at PHP_BACKEND_URL.
// The dev server proxies /api and /uploads to it so the browser sees everything
// as same-origin — no CORS setup needed, and PHP session cookies just work.
const PHP_BACKEND_URL = process.env.PHP_BACKEND_URL || 'http://localhost/RBI';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: PHP_BACKEND_URL,
        changeOrigin: true,
      },
      '/uploads': {
        target: PHP_BACKEND_URL,
        changeOrigin: true,
      },
      '/reports': {
        target: PHP_BACKEND_URL,
        changeOrigin: true,
      },
    },
  },
});
