import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.GITHUB_REPOSITORY
    ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`
    : '/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.AEROEDU_API_ORIGIN ?? 'http://127.0.0.1:8000',
      },
    },
  },
})
