import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  assetsInclude:["**/*.JPEG","**/*.MOV","**/*.PNG"],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 5s linear infinite', // custom slow spin
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
})
