// src/api/course.js

import request from '@/utils/request'

/**
 * 获取我的课程
 * @param {string|number} userId 用户ID
 * @returns {Promise}
 */
export function fetchStudentCourses(studentId,academic_year, semester) {
    return request.get('/student/my-courses', { params: { studentId, academic_year, semester} })
  }
  