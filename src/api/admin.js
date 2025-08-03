import request from '@/utils/request'

// 获取管理员列表
export function getAdminList(params) {
  // 确保分页参数正确
  const requestParams = {
    ...params,
    page: params.page || 0,
    size: params.size || 20
  }
  return request.get('/admin/list', { params: requestParams })
}

// 获取管理员详情
export function getAdminDetail(adminId) {
  return request.get(`/admin/detail/${adminId}`)
}

// 获取可分配管理员权限的用户列表
export function getUsersByRole(params) {
  return request.get('/admin/users', { params })
}

// 分配管理员权限
export function assignAdminRole(data) {
  return request.post('/admin/assign', data)
}

// 更新管理员信息
export function updateAdmin(data) {
  return request.put('/admin/update', data)
}

// 撤销管理员权限
export function revokeAdminRole(adminId) {
  return request.delete(`/admin/revoke/${adminId}`)
}

// 更新管理员状态
export function updateAdminStatus(adminId, status) {
  return request.put(`/admin/status/${adminId}`, null, { params: { status } })
}

// 根据级别获取管理员列表
export function getAdminsByLevel(adminLevel) {
  return request.get(`/admin/level/${adminLevel}`)
}

// 获取学院列表
export function getCollegeList() {
  return request.get('/admin/colleges')
}

// 根据学院ID获取系列表
export function getDepartmentList(collegeId) {
  return request.get(`/admin/departments/${collegeId}`)
} 