import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 用户信息
  const userInfo = ref(null)
  
  // 用户角色
  const userRole = computed(() => userInfo.value?.role)
  
  // 用户ID
  const userId = computed(() => userInfo.value?.id)
  
  // 用户名
  const username = computed(() => userInfo.value?.username)
  
  // 是否已登录
  const isLoggedIn = computed(() => !!userInfo.value)
  
  // 设置用户信息
  const setUserInfo = (info) => {
    userInfo.value = info
  }
  
  // 清除用户信息
  const clearUserInfo = () => {
    userInfo.value = null
  }
  
  // 检查是否有权限
  const hasPermission = (requiredRoles) => {
    if (!userInfo.value?.role) {
      return false
    }
    
    // 系统管理员拥有所有权限
    if (userInfo.value.role === 'system_admin') {
      return true
    }
    
    if (Array.isArray(requiredRoles)) {
      return requiredRoles.includes(userInfo.value.role)
    } else {
      return requiredRoles === userInfo.value.role
    }
  }
  
  // 获取角色显示名称
  const getRoleDisplayName = (role) => {
    const roleNames = {
      'student': '学生',
      'teacher': '教师',
      'supervisor': '督导',
      'leader': '领导',
      'enterprise': '企业',
      'admin': '管理员',
      'system_admin': '系统管理员'
    }
    return roleNames[role] || role
  }
  
  // 初始化用户信息（从sessionStorage）
  const initUserInfo = () => {
    const accountStr = sessionStorage.getItem('account')
    if (accountStr) {
      try {
        userInfo.value = JSON.parse(accountStr)
      } catch (error) {
        console.error('解析用户信息失败:', error)
        clearUserInfo()
      }
    }
  }
  
  return {
    userInfo,
    userRole,
    userId,
    username,
    isLoggedIn,
    setUserInfo,
    clearUserInfo,
    hasPermission,
    getRoleDisplayName,
    initUserInfo
  }
}) 