import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // server: {
  //   proxy: {
  //     // 字符串简写写法
  //     // '/foo': 'http://localhost:4567',
  //     // 选项写法
  //     '/teacher': {
  //       target: 'http://localhost:8080', // 确保这是你后端服务的地址和端口
  //       changeOrigin: true,
  //       // 如果你的后端接口路径没有/api前缀，可以不用重写
  //       // rewrite: (path) => path.replace(/^\/api/, '') 
  //     },
  //     // ... 其他需要代理的路径
  //   }
  // }
})
