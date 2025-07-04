import { createRouter, createWebHistory } from 'vue-router' // 使用 createWebHistory
import LoginView from '@/views/LoginView.vue'
import HomeView from '@/views/HomeView.vue'
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView },
  {
    path: '/findpassword',
    name: 'FindPassword',
    component: () => import('@/views/FindPasswordView.vue')
  },
  { path: '/home', component: HomeView },
]

const router = createRouter({
  // 改为历史模式，移除 URL 中的 # 
  history: createWebHistory(),
  routes
})

export default router