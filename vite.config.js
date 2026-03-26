import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 1. นำเข้า Tailwind v4

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 2. เปิดสวิตช์ตรงนี้!
  ],
})
