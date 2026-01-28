import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(),
  react()
  ],
  server: {
    proxy: {
      '/sitemap.xml': {
        target: 'https://printnova-backend.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sitemap\.xml/, '/api/seo/sitemap.xml'),
      },
    },
  },
})
