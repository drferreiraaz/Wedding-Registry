import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      {
        find: /^firebase\/auth$/,
        replacement: 'C:/Users/davi2/AppData/Local/Temp/opencode/firebase-auth-stub-visitor.js',
      },
      {
        find: /^firebase\/firestore$/,
        replacement: 'C:/Users/davi2/AppData/Local/Temp/opencode/firebase-firestore-stub.js',
      },
    ],
  },
  server: {
    port: 5193,
    strictPort: true,
  },
})
