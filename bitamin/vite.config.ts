import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    proxy: {
      '/api': {
        target: 'https://i11b105.p.ssafy.io', // 백엔드 서버의 주소
        changeOrigin: true,
        secure: false,
      },
    },
  },
  define: {
    global: 'globalThis',
  },
  assetsInclude: ['**/*.ttf', '**/*.woff', '**/*.woff2', '**/*.eot'],
})
