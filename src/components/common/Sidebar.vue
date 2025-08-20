<template>
  <div class="sidebar">

    <el-menu
      :default-active="activeMenu"
      class="sidebar-menu"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
      :collapse="isCollapse"
      router
    >

      <template v-for="menu in filteredMenus" :key="menu.path">
      
        <el-sub-menu v-if="menu.children && menu.children.length > 0" :index="menu.path">
          <template #title>
            <el-icon><component :is="menu.icon" /></el-icon>
            <span>{{ menu.title }}</span>
          </template>
          <el-menu-item 
            v-for="child in menu.children" 
            :key="child.path"
            :index="child.path"
            v-show="hasPermission(child.roles)"
          >
            <el-icon><component :is="child.icon" /></el-icon>
            <span>{{ child.title }}</span>
          </el-menu-item>
        </el-sub-menu>
        
        <el-menu-item 
          v-else 
          :index="menu.path"
          v-show="hasPermission(menu.roles)"
        >
          <el-icon><component :is="menu.icon" /></el-icon>
          <span>{{ menu.title }}</span>
        </el-menu-item>
      </template>

    </el-menu>

  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import {
  House,
  User,
  Document,
  DataAnalysis,
  Setting,
  Star,
  ChatDotRound,
  View,
  Edit,
  List,
  OfficeBuilding,
  Comment,
  ChatLineSquare,
  DocumentChecked
} from '@element-plus/icons-vue'

const route = useRoute()
const userStore = useUserStore()
const isCollapse = ref(false)

// 当前激活的菜单
const activeMenu = computed(() => {
  // 如果当前路径是 /Home 或 /home，返回 /dashboard，否则返回当前路径
  // route.path='/dashboard'
  return route.path === '/Home'  ? '/dashboard' : route.path
})

// 菜单配置
const menus = [
  {
    path: '/dashboard',
    title: '首页',
    icon: House,
    roles: ['student', 'teacher', 'supervisor', 'leader', 'enterprise', 'school_admin', 'college_admin', 'department_admin', 'system_admin']
  },


  {
    path: '/course',
    title: '课程管理',
    icon: Document,
    roles: ['student', 'teacher'],
    children: [
      {
        path: '/course/my-courses',
        title: '我的课程',
        icon: Document,
        roles: ['student', 'teacher']
      },
    ]
  },

  {
    path: '/evaluation',
    title: '教学评价',
    icon: Star,
    roles: ['student', 'teacher', 'supervisor', 'leader', 'enterprise', 'school_admin', 'college_admin', 'department_admin'],
    children: [
      {
        path: '/evaluation/student-tasks',
        title: '我的任务',
        icon: User,
        roles: ['student']
      },
      {
        path: '/evaluation/peer-evaluation',
        title: '同行互评',
        icon: ChatDotRound,
        roles: ['teacher']
      },
      {
        path: '/evaluation/received-peer-evaluation',
        title: '收到的评价',
        icon: ChatDotRound,
        roles: ['teacher']
      },

      {
        path: '/evaluation/Supervisor-leader',
        title: '督导评价',
        icon: View,
        roles: ['supervisor']
      },
      {
        path: '/evaluation/Supervisor-leader',
        title: '领导评价',
        icon: View,
        roles: ['leader']
      },
      {
        path: '/evaluation/enterprise',
        title: '企业评价',
        icon: View,
        roles: ['enterprise']
      },
      {
        path: '/evaluation/manage',
        title: '评价管理',
        icon: Edit,
        roles: ['school_admin', 'college_admin', 'department_admin']
      },
      {
        path: '/evaluation/indicators',
        title: '评价指标管理',
        icon: Setting,
        roles: ['school_admin']
      },
      {
        path: '/evaluation/task-management',
        title: '评价任务管理',
        icon: Document,
        roles: ['school_admin', 'college_admin', 'department_admin']
      },
      // 在 menus 数组中添加
      {
        path: '/evaluation/view-evaluations',
        title: '查看评价',
        icon: View,
        roles: ['supervisor', 'leader'],
        // 特殊权限检查：只有有查看权限的督导/领导才能看到
        showCondition: () => {
          const userRole = userStore.userInfo?.role
          if (userRole === 'supervisor' || userRole === 'leader') {
            const viewScopeType = userStore.userInfo?.viewScopeType
            return viewScopeType && viewScopeType !== 'NONE'
          }
          return false
        }
      }
    ]
  },
  {
    path: '/organization',
    title: '组织管理',
    icon: OfficeBuilding,
    roles: ['school_admin', 'college_admin', 'department_admin'], // 三类管理员都可见
    children: [
      {
        path: '/organization/college',
        title: '学院管理',
        icon: OfficeBuilding,
        roles: ['school_admin'] // 校级管理员
      },
      {
        path: '/organization/department',
        title: '系管理',
        icon: OfficeBuilding,
        roles: ['school_admin', 'college_admin'] // 两类管理员
      },
     
      {
        path: '/organization/class',
        title: '班级管理',
        icon: OfficeBuilding,
        roles: ['school_admin', 'college_admin', 'department_admin'] // 三类管理员
      }
    ]
  },
  {
    path: '/admin',
    title: '系统管理',
    icon: Setting,
    roles: ['school_admin', 'college_admin', 'department_admin', 'system_admin'],
    children: [
      {
        path: '/admin/role',
        title: '角色权限管理',
        icon: Setting,
        roles: ['system_admin','school_admin', 'college_admin', 'department_admin']
      },
    ]
  }
]

// 过滤菜单（根据用户角色）
const filteredMenus = computed(() => {
  return menus.filter(menu => {
    // 基础权限检查
    if (!hasPermission(menu.roles)) {
      return false
    }
    
    // 特殊条件检查
    if (menu.showCondition && typeof menu.showCondition === 'function') {
      return menu.showCondition()
    }
    
    return true
  })
})



// 检查权限
const hasPermission = (roles) => {
  const userRole = userStore.userInfo?.role
  
  if (!userRole) {
    return false
  }
  
  // 基础角色检查
  if (Array.isArray(roles)) {
    if (!roles.includes(userRole)) {
      return false
    }
  } else {
    if (roles !== userRole) {
      return false
  }
  }
  
  return true
}


</script>

<style scoped>
.sidebar {
  height: 100%;
  background-color: #304156;
}

.sidebar-menu {
  border-right: none;
  height: 100%;
}

.sidebar-menu:not(.el-menu--collapse) {
  width: 200px;
}

.el-menu-item, .el-sub-menu__title {
  height: 50px;
  line-height: 50px;
}

.el-menu-item.is-active {
  background-color: #1890ff !important; /* 高亮背景色 */
  color: #fff !important;               /* 高亮文字色 */
}

.el-menu-item:hover, .el-sub-menu__title:hover {
  background-color: #263445 !important;
}

.el-menu-item.is-active {
  background-color: #1890ff !important;
}
</style> 