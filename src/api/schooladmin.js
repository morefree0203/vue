import request from '@/utils/request'

/**
 * 根据管理员角色选择对应的API基础路径
 * @param {string} role - 管理员角色
 * @returns {string} API基础路径
 */
const getApiBaseUrl = (role) => {
  switch (role) {
    case 'school_admin':
      return '/api/school-admin'
    case 'college_admin':
      return '/api/college-admin'
    case 'department_admin':
      return '/api/department-admin'
    default:
      return '/api/school-admin'
  }
}

// 获取课程列表（根据管理员级别）
export const getCoursesByAdminLevel = (params, userInfo) => {
  const baseUrl = getApiBaseUrl(userInfo?.role)
  return request.get(`${baseUrl}/evaluation/courses`, { params })
}

// 获取课程评价详情
export const getCourseEvaluationDetail = (courseId, userInfo) => {
  const baseUrl = getApiBaseUrl(userInfo?.role)
  return request.get(`${baseUrl}/evaluation/course/${courseId}`)
}

// 删除评价
export const deleteEvaluation = (evaluationId, role, userInfo) => {
  const baseUrl = getApiBaseUrl(userInfo?.role)
  console.log(role, userInfo)
  return request.delete(`${baseUrl}/evaluation/${evaluationId}`, { 
    params: { role, adminId: userInfo?.id } 
  })
}



// 删除用户账号
export const deleteUser = (userId, role, userInfo) => {
  console.log(userId, role, userInfo)
  const baseUrl = getApiBaseUrl(userInfo?.role)
  return request.delete(`${baseUrl}/user/${userId}`, { 
    params: { role, adminId: userInfo?.id } 
  })
}

// 取消用户匿名评价权限
export const revokeAnonymousPermission = (userId, adminId, reason = '', userInfo) => {
  const baseUrl = getApiBaseUrl(userInfo?.role)
  return request.post(`${baseUrl}/user/${userId}/revoke-anonymous`, null, { 
    params: { adminId, reason } 
  })
}

// 获取管理员权限范围内的统计信息
export const getAdminStatistics = (params, userInfo) => {
  const baseUrl = getApiBaseUrl(userInfo?.role)
  return request.get(`${baseUrl}/evaluation/statistics`, { params })
}

// 批量删除评价
export const batchDeleteEvaluations = (evaluationIds, adminId, reason = '', userInfo) => {
  const baseUrl = getApiBaseUrl(userInfo?.role)
  return request.post(`${baseUrl}/evaluation/batch-delete`, { 
    evaluationIds, adminId, reason 
  })
}

// 获取用户操作日志
export const getUserOperationLogs = (params, userInfo) => {
  const baseUrl = getApiBaseUrl(userInfo?.role)
  return request.get(`${baseUrl}/operation-logs`, { params })
}

// 导出评价数据
export const exportEvaluationData = (params, userInfo) => {
  const baseUrl = getApiBaseUrl(userInfo?.role)
  return request.get(`${baseUrl}/evaluation/export`, { 
    params,
    responseType: 'blob'
  })
}

// 获取评价图片列表
export const getEvaluationImages = (evaluationId, evaluationType, userInfo) => {
  const baseUrl = getApiBaseUrl(userInfo?.role)
  return request.get(`${baseUrl}/evaluation/${evaluationId}/images`, {
    params: { evaluationType }
  })
}

// 获取评价图片数量
export const getEvaluationImageCount = (evaluationId, evaluationType, userInfo) => {
  const baseUrl = getApiBaseUrl(userInfo?.role)
  return request.get(`${baseUrl}/evaluation/${evaluationId}/images/count`, {
    params: { evaluationType }
  })
}

// ======================= 企业评价相关API =======================

// 获取学校级别的企业评价列表
export const getEnterpriseEvaluations = (params, userInfo) => {
  const baseUrl = getApiBaseUrl(userInfo?.role)
  return request.get(`${baseUrl}/enterprise-evaluations`, { params })
}

// 获取企业评价详情
export const getEnterpriseEvaluationDetail = (evaluationId, userInfo) => {
  const baseUrl = getApiBaseUrl(userInfo?.role)
  return request.get(`${baseUrl}/enterprise-evaluation/${evaluationId}`)
}

// 删除企业评价
export const deleteEnterpriseEvaluation = (evaluationId, adminId, reason = '', userInfo) => {
  const baseUrl = getApiBaseUrl(userInfo?.role)
  return request.delete(`${baseUrl}/enterprise-evaluation/${evaluationId}`, { 
    params: { adminId, reason } 
  })
}

// 批量删除企业评价
export const batchDeleteEnterpriseEvaluations = (evaluationIds,userInfo) => {
  const baseUrl = getApiBaseUrl(userInfo?.role)
  return request.post(`${baseUrl}/enterprise-evaluation/batch-delete`, { 
    evaluationIds
  })
}