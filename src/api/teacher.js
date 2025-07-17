// src/api/course.js

import request from '@/utils/request'

/**
 * 获取我的课程
 * @param {string|number} userId 用户ID
 * @returns {Promise}
 */
export function fetchTeacherCourses(studentId,academicYear, semester) {
   
    return request.get('/teacher/my-courses', { params: { studentId, academicYear, semester} })
  }
// 获取所有学生对于该课程的平均分和所有评论
export function getCourseEvaluationDetail(courseId){
    return request.get('/teacher/course-evaluation', { params: { courseId} })
}

/**
 * 教师回复学生评价
 * @param {Object} data { commentId, replyContent }
 * @returns {Promise}
 */
export function submitTeacherReply(data) {
  return request.post('/teacher/submit-reply', data)
}

