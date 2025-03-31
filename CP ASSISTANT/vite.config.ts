import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import cartographer from '@replit/vite-plugin-cartographer'
import runtimeErrorPlugin from '@replit/vite-plugin-runtime-error-modal'
import themejson from '@replit/vite-plugin-shadcn-theme-json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    runtimeErrorPlugin(),
    cartographer({ publicPath: "/utils/" }),
    themejson(),
  ],
  server: {
    host: '0.0.0.0',
    hmr: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src/components'),
      '@shared': path.resolve(__dirname, './shared'),
      '@lib': path.resolve(__dirname, './client/src/lib'),
      '@hooks': path.resolve(__dirname, './client/src/hooks'),
      '@context': path.resolve(__dirname, './client/src/context')
    }
  },
  build: {
    outDir: 'dist/client',
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          'react-query': ['@tanstack/react-query'],
          monaco: ['@monaco-editor/react']
        }
      }
    }
  }
})