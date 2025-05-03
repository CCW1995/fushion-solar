import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    hmr: true,
    open: true,
  },
  resolve: {
    alias: {
      '@': '/src',
      'components': '/src/components',
      'containers': '/src/containers',
      'actions': '/src/actions',
      'assets': '/src/assets',
      'reducers': '/src/reducers',
      'store': '/src/store',
      'router': '/src/router',
      'utils': '/src/utils',
      'stylesheets': '/src/stylesheets',
      'locales': '/src/locales'
    },
  },

})
