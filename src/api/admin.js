import request from '@/utils/request'

// 获取管理员列表 根据分页参数和搜索参数
export function getAdminList(params) {
  // 确保分页参数正确
  const requestParams = {
    ...params,
    page: params.page || 0,
    size: params.size || 20
  }
  return request.get('/admin/list', { params: requestParams })
}


// 获取可分配管理员权限的用户列表 
export function getUsersByRole(params) {
  return request.get('/admin/users', { params })
}

// 分配管理员权限 根据管理员ID和角色ID
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


// 获取学院列表
export function getCollegeList() {
  return request.get('/admin/colleges')
}

// 根据学院ID获取系列表
export function getDepartmentList(collegeId) {
  return request.get(`/admin/departments/${collegeId}`)
} 

export function getEvaluationIndicators() {
  return request.get('/admin/evaluation-indicators')
}

export function addEvaluationIndicator(data) {
  return request.post('/admin/evaluation-indicators', data)
}

export function updateEvaluationIndicator(id, data) {
  return request.put(`/admin/evaluation-indicators/${id}`, data)
}

export function deleteEvaluationIndicator(id) {
  return request.delete(`/admin/evaluation-indicators/${id}`)
} 