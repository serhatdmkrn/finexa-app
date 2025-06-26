import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  base: process.env.NODE_ENV === "production" ? "/finexa/" : "/",
  publicPath:  process.env.NODE_ENV === "production" ? "/finexa/" : "/",
  assetsInclude: ['**/*.png', '**/*.jpg'],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
