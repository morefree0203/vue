import { createRouter, createWebHistory } from 'vue-router' // 使用 createWebHistory
import LoginView from '@/views/LoginView.vue'
import HomeView from '@/views/HomeView.vue'
import request from '@/utils/request'
import { useRouter } from 'vue-router'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView },
  {
    path: '/findpassword',
    name: 'FindPassword',
    component: () => import('@/views/FindPasswordView.vue')
  },
  { path: '/Home', component: HomeView },
]

const router = createRouter({
  // 改为历史模式，移除 URL 中的 # 
  history: createWebHistory(),
  routes
})

// 验证token是否有效
const validateToken = async (token) => {
  try {
    const response = await request.get('/api/validate-token', {
      headers: {
        'token': token
      }
    })
    return response.code === '200'
  } catch (error) {
    return false
  }
}

// 获取token（只从sessionStorage获取）
const getToken = () => {
  return sessionStorage.getItem('token')
}

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const token = getToken()
  
  if (token) {
    // 有token，验证token是否有效
    const isValid = await validateToken(token)
    
    if (isValid) {
      // token有效
      if (to.path === '/login') {
        // 如果在登录页面且token有效，直接跳转到首页
        next('/Home')
      } else {
        // 其他页面正常放行
        next()
      }
    } else {
      // token无效，清除存储的token
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('account')
      
      if (to.path !== '/login') {
        next('/login')
      } else {
        next()
      }
    }
  } else {
    // 没有token
    if (to.path !== '/login') {
      next('/login')
    } else {
      next()
    }
  }
})

export default router