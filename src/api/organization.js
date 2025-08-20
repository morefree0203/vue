// 组织管理相关接口
// 包含学院管理、系管理、专业管理、班级管理等
import request from '@/utils/request'

// ==================== 学院管理 ====================

// 获取学院列表
export function getCollegeList(params, userInfo) {
  return request.get('/api/organization/college/list', { 
    params: {
      ...params,
      userRole: userInfo?.role,
      userCollegeId: userInfo?.collegeId,
      userDepartmentId: userInfo?.departmentId
    }
  })
}

// 添加学院
export function addCollege(data) {
  return request.post('/api/organization/college/add', data)
}

// 更新学院
export function updateCollege(data) {
  return request.put('/api/organization/college/update', data)
}

// 删除学院
export function deleteCollege(collegeId) {
  return request.delete(`/api/organization/college/delete/${collegeId}`)
}


// ==================== 系部管理 ====================

// 获取所有系列表
export function getAllDepartmentList(params, userInfo) {
  return request.get('/api/organization/department/list', { 
    params: {
      ...params,
      userRole: userInfo?.role,
      userCollegeId: userInfo?.collegeId,
      userDepartmentId: userInfo?.departmentId
    }
  })
}

// 根据学院ID获取系列表
export function getDepartmentList(collegeId, userInfo) {
  return request.get(`/api/organization/department/list/${collegeId}`, { 
    params: {
      userRole: userInfo?.role,
      userCollegeId: userInfo?.collegeId,
      userDepartmentId: userInfo?.departmentId
    }
  })
}

// 添加系部
export function addDepartment(data) {
  return request.post('/api/organization/department/add', data)
}

// 更新系部
export function updateDepartment(data) {
  return request.put('/api/organization/department/update', data)
}

// 删除系部
export function deleteDepartment(departmentId) {
  return request.delete(`/api/organization/department/delete/${departmentId}`)
}



// ==================== 班级管理 ====================

// 获取班级列表
export function getAllClassList(params, userInfo) {
  return request.get('/api/organization/class/list', { 
    params: {
      ...params,
      userRole: userInfo?.role,
      userCollegeId: userInfo?.collegeId,
      userDepartmentId: userInfo?.departmentId
    }
  })
}



// 添加班级
export function addClass(data) {
  return request.post('/api/organization/class/add', data)
}

// 更新班级
export function updateClass(data) {
  return request.put('/api/organization/class/update', data)
}

// 删除班级
export function deleteClass(classId) {
  return request.delete(`/api/organization/class/delete/${classId}`)
}

// 更新班级状态
export function updateClassStatus(classId, status) {
  return request.put(`/api/organization/class/status/${classId}`, null, {
    params: { status }
  })
} 