import { createRouter, createWebHistory } from 'vue-router' // 使用 createWebHistory
import LoginView from '@/views/LoginView.vue'
import HomeView from '@/views/HomeView.vue'
import request from '@/utils/request'

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

// 路由守卫
router.beforeEach(async (to, from, next) => {
  if(to.path === '/login'){
    const token = sessionStorage.getItem('token')
    if (token) {
      // 有token，验证token是否有效
      const isValid = await validateToken(token)
      
      if (isValid) {
        next('/Home')
      }
      else{
        next();  
      } 
  }
  } 
  // else {
  //   // 没有token
  //   if (to.path !== '/login' && to.path !== '/findpassword') {
  //     next('/login')
  //   } else {
  //     next()
  //   }
  // }
// }
next()
}
)

export default router