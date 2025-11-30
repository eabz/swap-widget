import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'swap-widget': path.resolve(__dirname, './src/index.tsx')
    }
  },
  root: 'example',
  server: {
    port: 3000
  }
})
