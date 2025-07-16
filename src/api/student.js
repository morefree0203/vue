// src/api/course.js

import request from '@/utils/request'

/**
 * 获取我的课程
 * @param {string|number} userId 用户ID
 * @returns {Promise}
 */
export function fetchStudentCourses(studentId,academicYear, semester) {
   
    return request.get('/student/my-courses', { params: { studentId, academicYear, semester} })
  }

export function getEvaluationAssignmentDetail(assignmentId) {
    return request.get('/student/evaluation-assignment', { params: { assignmentId } })
  }

export function fetchStudentEvaluationTasks(studentId, academicYear, semester) {
  return request.get('/student/evaluation-tasks', {
    params: { studentId, academicYear, semester }
  })
}
  
//  提交学生评价
export function submitStudentEvaluation(assignmentId, data) {
  console.log(222)
  return request.post('/student/submit-evaluation', data, {
    params: { assignmentId }
  })
}
