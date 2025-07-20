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

  
  // 设置用户信息
  const setUserInfo = (info) => {
    userInfo.value = info
  }
  
  // 清除用户信息
  const clearUserInfo = () => {
    userInfo.value = null
  }
  
  // 检查是否有权限
  // const hasPermission = (requiredRoles) => {
  //   if (!userInfo.value?.role) {
  //     return false
  //   }
    
  //   // 系统管理员拥有所有权限
  //   if (userInfo.value.role === 'system_admin') {
  //     return true
  //   }
    
  //   if (Array.isArray(requiredRoles)) {
  //     return requiredRoles.includes(userInfo.value.role)
  //   } else {
  //     return requiredRoles === userInfo.value.role
  //   }
  // }
  
  // 获取角色显示名称
  const getRoleDisplayName = (role) => {
    const roleNames = {
      'student': '学生',
      'teacher': '教师',
      'supervisor': '督导',
      'leader': '领导',
      'enterprise': '企业',
      'school_admin': '校级管理员',
      'college_admin': '院级管理员',
      'department_admin': '系级管理员',
      'system_admin': '系统管理员'
    }
    return roleNames[role] || role
  }
  
  // 获取管理员级别
  // const getAdminLevel = () => {
  //   const role = userInfo.value?.role
  //   if (role === 'system_admin') return 'system'
  //   if (role === 'school_admin') return 'school'
  //   if (role === 'college_admin') return 'college'
  //   if (role === 'department_admin') return 'department'
  //   return null
  // }
  
  // // 检查是否是管理员
  // const isAdmin = computed(() => {
  //   const role = userInfo.value?.role
  //   return ['school_admin', 'college_admin', 'department_admin', 'system_admin'].includes(role)
  // })
  
  // // 检查是否是系统管理员
  // const isSystemAdmin = computed(() => userInfo.value?.role === 'system_admin')
  
  // // 检查是否是校级管理员
  // const isSchoolAdmin = computed(() => userInfo.value?.role === 'school_admin')
  
  // // 检查是否是院级管理员
  // const isCollegeAdmin = computed(() => userInfo.value?.role === 'college_admin')
  
  // // 检查是否是系级管理员
  // const isDepartmentAdmin = computed(() => userInfo.value?.role === 'department_admin')
  
  // // 获取管理范围
  // const getManageScope = () => {
  //   const role = userInfo.value?.role
  //   switch (role) {
  //     case 'system_admin':
  //       return '全校'
  //     case 'school_admin':
  //       return '全校'
  //     case 'college_admin':
  //       return userInfo.value?.departmentName || '本院系'
  //     case 'department_admin':
  //       return userInfo.value?.departmentName || '本专业'
  //     default:
  //       return '无'
  //   }
  // }
  
  // 初始化用户信息（从sessionStorage）
  const initUserInfo = () => {
    const accountStr = sessionStorage.getItem('account')
    if (accountStr) {
      try {
        const userData = JSON.parse(accountStr)
        userInfo.value = userData
      } catch (error) {
        console.error('解析用户信息失败:', error)
        clearUserInfo()
      }
    }
  }
  {persist: true}
  

  return {
    userInfo,
    userRole,
    userId,
    username,
    // isAdmin,
    // isSystemAdmin,
    // isSchoolAdmin,
    // isCollegeAdmin,
    // isDepartmentAdmin,
    setUserInfo,
    clearUserInfo,
    // hasPermission,
    getRoleDisplayName,
    // getAdminLevel,
    // getManageScope,
    initUserInfo
  }
}) 