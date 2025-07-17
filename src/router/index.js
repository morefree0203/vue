import { createRouter, createWebHistory } from 'vue-router' // 使用 createWebHistory
import LoginView from '@/views/LoginView.vue'
import HomeView from '@/views/HomeView.vue'
import request from '@/utils/request'
import { useUserStore } from '@/stores/user'
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView },
  {
    path: '/findpassword',
    name: 'FindPassword',
    component: () => import('@/views/FindPasswordView.vue')
  },
  { 
    path: '/Home', 
    component: HomeView,
    children: [
      {
        path: '',                // 关键：空路径，表示 /Home
        redirect: '/dashboard'   // 自动跳转到 /dashboard
      },
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/DashboardView.vue')
      },
      // 课程管理
      {
        path: '/course/list',
        name: 'CourseList',
        component: () => import('@/views/course/CourseListView.vue')
      },
      // 通用查看我的课程接口 不同角色的数据获取在内部判断
      {
        path: '/course/my-courses',
        name: 'MyCourses',
        component: () => import('@/views/course/MyCoursesView.vue')
      },
      // 老师查看自己的课程评价详情的接口
      {
        path: '/course/evaluation/:courseId',
        name: 'CourseEvaluationDetail',
        component: () => import('@/views/course/CourseEvaluationDetail.vue')
      },
      {
        path: '/course/info',
        name: 'CourseInfoManagement',
        component: () => import('@/views/course/CourseInfoManagement.vue')
      },
      // {
      //   path: '/course/teacher-assignment',
      //   name: 'TeacherAssignmentManagement',
      //   component: () => import('@/views/course/TeacherAssignmentManagement.vue')
      // },
      // {
      //   path: '/course/student-selection',
      //   name: 'StudentSelectionManagement',
      //   component: () => import('@/views/course/StudentSelectionManagement.vue')
      // },
      {
        path: '/course/college',
        name: 'CollegeCourseManagement',
        component: () => import('@/views/course/CollegeCourseManagement.vue')
      },
      {
        path: '/course/department',
        name: 'DepartmentCourseManagement',
        component: () => import('@/views/course/DepartmentCourseManagement.vue')
      },
      // 教学评价
      {
        path: '/evaluation/student-tasks',
        name: 'StudentEvaluationTasks',
        component: () => import('@/views/evaluation/StudentEvaluationTasks.vue')
      },
      {
        path: '/evaluation/student/:assignmentId',
        name: 'StudentEvaluation',  
        component: () => import('@/views/evaluation/StudentEvaluation.vue')
      },
      {
        path: '/evaluation/student/detail/:assignmentId',
        name: 'StudentEvaluationDetail',
        component: () => import('@/views/evaluation/StudentEvaluationDetail.vue')
      },
      {
        path: '/evaluation/peer',
        name: 'PeerEvaluation',
        component: () => import('@/views/evaluation/PeerEvaluation.vue')
      },
      {
        path: '/evaluation/supervisor',
        name: 'SupervisorEvaluation',
        component: () => import('@/views/evaluation/SupervisorEvaluation.vue')
      },
      {
        path: '/evaluation/leader',
        name: 'LeaderEvaluation',
        component: () => import('@/views/evaluation/LeaderEvaluation.vue')
      },
      {
        path: '/evaluation/enterprise',
        name: 'EnterpriseEvaluation',
        component: () => import('@/views/evaluation/EnterpriseEvaluation.vue')
      },
      {
        path: '/evaluation/manage',
        name: 'EvaluationManagement',
        component: () => import('@/views/evaluation/EvaluationManageView.vue')
      },
      {
        path: '/evaluation/indicators',
        name: 'EvaluationIndicators',
        component: () => import('@/views/evaluation/EvaluationIndicatorsView.vue')
      },
      {
        path: '/evaluation/task-management',
        name: 'EvaluationTaskManagement',
        component: () => import('@/views/evaluation/EvaluationTaskManagement.vue')
      },
      // 组织管理
      {
        path: '/organization/college',
        name: 'CollegeManagement',
        component: () => import('@/views/organization/CollegeManagement.vue')
      },
      {
        path: '/organization/department',
        name: 'DepartmentManagement',
        component: () => import('@/views/organization/DepartmentManagement.vue')
      },
      {
        path: '/organization/major',
        name: 'MajorManagement',
        component: () => import('@/views/organization/MajorManagement.vue')
      },
      {
        path: '/organization/class',
        name: 'ClassManagement',
        component: () => import('@/views/organization/ClassManagement.vue')
      },
      // 统计分析
      {
        path: '/statistics/evaluation',
        name: 'EvaluationStatistics',
        component: () => import('@/views/dashboard/StatisticsView.vue')
      },
      {
        path: '/statistics/course',
        name: 'CourseStatistics',
        component: () => import('@/views/dashboard/StatisticsView.vue')
      },
      {
        path: '/statistics/user',
        name: 'UserStatistics',
        component: () => import('@/views/dashboard/StatisticsView.vue')
      },
      // 系统管理
      {
        path: '/admin/user',
        name: 'UserManagement',
        component: () => import('@/views/admin/UserManagementView.vue')
      },
      {
        path: '/admin/role',
        name: 'RolePermissionManagement',
        component: () => import('@/views/admin/RolePermissionManagement.vue')
      },
      {
        path: '/admin/permission',
        name: 'PermissionAssignment',
        component: () => import('@/views/admin/PermissionAssignmentView.vue')
      },
      {
        path: '/admin/system',
        name: 'SystemSettings',
        component: () => import('@/views/admin/SystemSettingsView.vue')
      }
    ]
  }
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

// 更新用户信息
const updateUserInfo = async (token) => {
  try {
    const response = await request.get('/api/validate-token', {
      headers: {
        'token': token
      }
    })
    if (response.code === '200') {
      // 更新 sessionStorage
      sessionStorage.setItem('account', JSON.stringify(response.data))
      // 更新 store
      const { useUserStore } = await import('@/stores/user')
      const userStore = useUserStore()
      userStore.setUserInfo(response.data)
      return true
    }
    return false
  } catch (error) {
    return false
  }
}

// 路由守卫
// router.beforeEach(async (to, from) => {
//   const token = sessionStorage.getItem('token')

//   if (to.path === '/login') {
//     if (token) {
//       const isValid = await updateUserInfo(token)
//       if (isValid) {
//         return '/Home'
//       } else {
//         return true
//       }
//     } else {
//       return true
//     }
//   } else if (to.path === '/findpassword') {
//     return true
//   } else {
//     const { useUserStore } = await import('@/stores/user')
    // 其他页面需要验证token
    // if (!token) {
    //   return '/login'
    // } else {
    //   const isValid = await updateUserInfo(token)
    //   if (isValid) {
    //     return true
    //   } else {
    //     return '/login'
    //   }
    // }
//     const userStore = useUserStore()
//     const accountStr = sessionStorage.getItem('account') // 取出字符串
//     const account = JSON.parse(accountStr)// 转回对象
//     userStore.setUserInfo(account)
//     return true
//   }

// })

router.beforeEach(async (to, from, next) => {
  const token = sessionStorage.getItem('token')
  
  if (to.path === '/login') {
    if (token) {
      // 有token，验证token是否有效并更新用户信息
      const isValid = await updateUserInfo(token)
      if (isValid) {
        next('/Home')
      } else {
        next()
      }
    } else {
      next()
    }
  } else if (to.path === '/findpassword') {
    next()
  } else {
    // 其他页面需要验证token
    if (!token) {
      next('/login')
    } else {
      const isValid = await updateUserInfo(token)
      if (isValid) {
  next()
      } else {
        next('/login')
      }
    }
  }
})
export default router