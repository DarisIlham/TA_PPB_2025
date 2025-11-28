import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa' // Import plugin

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Service worker akan update otomatis jika ada versi baru
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'], // Aset statis tambahan
      manifest: {
        name: 'FitForge App',
        short_name: 'FitForge',
        description: 'Track your fitness goals and progress',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone', // Tampilan seperti aplikasi native (tanpa address bar)
        icons: [
          {
            src: 'dumbbell.png', // Anda perlu membuat icon ini nanti
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'dumbbell.png', // Anda perlu membuat icon ini nanti
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'dumbbell.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        // Konfigurasi Caching (Agar bisa offline)
        runtimeCaching: [
          {
            // Cache untuk request ke API Backend (GET requests)
            urlPattern: ({ url }) => url.pathname.startsWith('/api'),
            handler: 'NetworkFirst', // Coba internet dulu, kalau offline baru ambil cache
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7 // Cache bertahan 1 minggu
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Cache untuk Google Fonts (jika ada)
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 tahun
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
})