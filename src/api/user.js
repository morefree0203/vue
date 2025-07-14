// 用户自身相关接口
// 包含登录、登出、获取当前用户信息、修改密码等
import request from '@/utils/request'

// 登录接口
export function login(data) {
  // return request.post('/api/user/login', data)
}

// 登出接口
export function logout() {
  // return request.post('/api/user/logout')
}

// 获取当前用户信息
export function getCurrentUser() {
  // return request.get('/api/user/info')
}

// 修改密码接口
export function changePassword(data) {
  // return request.post('/api/user/change-password', data)
} 