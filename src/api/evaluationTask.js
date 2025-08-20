import request from '@/utils/request'

/**
 * 获取评价任务列表
 */
export function getEvaluationTasks(params, userInfo) {
  return request({
    url: '/api/school-admin/evaluation-tasks',
    method: 'get',
    params: {
      ...params,
      userRole: userInfo?.role,
      userCollegeId: userInfo?.collegeId,
      userDepartmentId: userInfo?.departmentId
    }
  })
}

/**
 * 创建评价任务
 */
export function createEvaluationTask(data) {
  return request({
    url: '/api/school-admin/evaluation-tasks',
    method: 'post',
    data
  })
}


/**
 * 删除评价任务
 */
export function deleteEvaluationTask(taskId) {
  return request({
    url: `/api/school-admin/evaluation-tasks/${taskId}`,
    method: 'delete'
  })
}

// 获取可分配的学生列表
export function getAvailableStudents(params, userInfo) {
  return request({
    url: '/api/school-admin/evaluation-tasks/available-students',
    method: 'get',
    params: {
      ...params,
      userRole: userInfo?.role,
      userCollegeId: userInfo?.collegeId,
      userDepartmentId: userInfo?.departmentId
    }
  })
}

// 分配任务给学生
export function assignTaskToStudents(taskId, studentIds) {
  return request({
    url: `/api/school-admin/evaluation-tasks/${taskId}/assign`,
    method: 'post',
    data: studentIds
  })
}

/**
 * 获取任务分配列表
 */
export function getTaskAssignments(taskId) {
  return request({
    url: `/api/school-admin/evaluation-tasks/${taskId}/assignments`,
    method: 'get'
  })
}


/**
 * 获取课程列表
 */
export function getCourseList(userInfo) {
  return request({
    url: '/api/school-admin/courses',
    method: 'get',
    params: {
      userRole: userInfo?.role,
      userCollegeId: userInfo?.collegeId,
      userDepartmentId: userInfo?.departmentId
    }
  })
}

/**
 * 获取学院列表
 */
export function getCollegeList(userInfo) {
  return request({
    url: '/api/school-admin/colleges',
    method: 'get',
    params: {
      userRole: userInfo?.role,
      userCollegeId: userInfo?.collegeId,
      userDepartmentId: userInfo?.departmentId
    }
  })
}

/**
 * 根据学院ID获取系列表
 */
export function getDepartmentList(collegeId) {
  return request({
    url: `/api/school-admin/departments/${collegeId}`,
    method: 'get'
  })
}

/**
 * 根据目标范围获取学生列表
 */
export function getStudentsByScope(targetScope, targetCollegeId, targetDepartmentId) {
  return request({
    url: '/api/school-admin/students',
    method: 'get',
    params: { targetScope, targetCollegeId, targetDepartmentId }
  })
}
