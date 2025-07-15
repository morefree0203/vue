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


export function fetchStudentEvaluationTasks(studentId, academicYear, semester) {
  console.log(222)
  return request.get('/student/evaluation-tasks', {
    params: { studentId, academicYear, semester }
  })
}
  