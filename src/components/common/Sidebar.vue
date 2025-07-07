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
  List
} from '@element-plus/icons-vue'

const route = useRoute()
const userStore = useUserStore()
const isCollapse = ref(false)

// 当前激活的菜单
const activeMenu = computed(() => route.path)

// 菜单配置
const menus = [
  {
    path: '/dashboard',
    title: '首页',
    icon: 'House',
    roles: ['student', 'teacher', 'supervisor', 'leader', 'enterprise', 'admin', 'system_admin']
  },
  {
    path: '/course',
    title: '课程管理',
    icon: 'Document',
    roles: ['student', 'teacher', 'supervisor', 'leader', 'enterprise', 'admin', 'system_admin'],
    children: [
      {
        path: '/course/list',
        title: '课程列表',
        icon: 'List',
        roles: ['student', 'teacher', 'supervisor', 'leader', 'enterprise', 'admin', 'system_admin']
      },
      {
        path: '/course/manage',
        title: '课程管理',
        icon: 'Edit',
        roles: ['admin', 'system_admin']
      }
    ]
  },
  {
    path: '/evaluation',
    title: '教学评价',
    icon: 'Star',
    roles: ['student', 'teacher', 'supervisor', 'leader', 'enterprise', 'admin', 'system_admin'],
    children: [
      {
        path: '/evaluation/student',
        title: '学生评价',
        icon: 'User',
        roles: ['student']
      },
      {
        path: '/evaluation/peer',
        title: '同行评价',
        icon: 'ChatDotRound',
        roles: ['teacher']
      },
      {
        path: '/evaluation/supervisor',
        title: '督导评价',
        icon: 'View',
        roles: ['supervisor']
      },
      {
        path: '/evaluation/leader',
        title: '领导评价',
        icon: 'View',
        roles: ['leader']
      },
      {
        path: '/evaluation/enterprise',
        title: '企业评价',
        icon: 'View',
        roles: ['enterprise']
      },
      {
        path: '/evaluation/manage',
        title: '评价管理',
        icon: 'Edit',
        roles: ['admin', 'system_admin']
      }
    ]
  },
  {
    path: '/statistics',
    title: '统计分析',
    icon: 'DataAnalysis',
    roles: ['teacher', 'admin', 'system_admin'],
    children: [
      {
        path: '/statistics/evaluation',
        title: '评价统计',
        icon: 'DataAnalysis',
        roles: ['teacher', 'admin', 'system_admin']
      },
      {
        path: '/statistics/course',
        title: '课程统计',
        icon: 'DataAnalysis',
        roles: ['admin', 'system_admin']
      },
      {
        path: '/statistics/user',
        title: '用户统计',
        icon: 'DataAnalysis',
        roles: ['admin', 'system_admin']
      }
    ]
  },
  {
    path: '/admin',
    title: '系统管理',
    icon: 'Setting',
    roles: ['admin', 'system_admin'],
    children: [
      {
        path: '/admin/user',
        title: '用户管理',
        icon: 'User',
        roles: ['admin', 'system_admin']
      },
      {
        path: '/admin/role',
        title: '角色管理',
        icon: 'Setting',
        roles: ['system_admin']
      },
      {
        path: '/admin/department',
        title: '院系管理',
        icon: 'Setting',
        roles: ['admin', 'system_admin']
      },
      {
        path: '/admin/system',
        title: '系统设置',
        icon: 'Setting',
        roles: ['system_admin']
      }
    ]
  }
]

// 过滤菜单（根据用户角色）
const filteredMenus = computed(() => {
  return menus.filter(menu => hasPermission(menu.roles))
})

// 检查权限
const hasPermission = (roles) => {
  const userRole = userStore.userInfo?.role
  
  if (!userRole) {
    return false
  }
  
  // 系统管理员拥有所有权限
  if (userRole === 'system_admin') {
    return true
  }
  
  if (Array.isArray(roles)) {
    return roles.includes(userRole)
  } else {
    return roles === userRole
  }
}
</script>

<style scoped>
.sidebar {
  height: 100vh;
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

.el-menu-item:hover, .el-sub-menu__title:hover {
  background-color: #263445 !important;
}

.el-menu-item.is-active {
  background-color: #1890ff !important;
}
</style> 