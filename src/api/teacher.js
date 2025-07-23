// src/api/course.js

import request from '@/utils/request'

/**
 * 获取我的课程
 * @param {string|number} userId 用户ID
 * @returns {Promise}
 */
export function fetchTeacherCourses(TeacherId,academicYear, semester) {
   
    return request.get('/teacher/my-courses', { params: { TeacherId, academicYear, semester} })
  }
// 获取所有学生对于该课程的平均分和所有评论
export function getCourseEvaluationDetail(assignmentId){
    return request.get('/teacher/course-evaluation', { params: { assignmentId} })
}

/**
 * 教师回复学生评价
 * @param {Object} data { commentId, replyContent }
 * @returns {Promise}
 */
export function submitTeacherReply(data) {
  return request.post('/teacher/submit-reply', data)
}

// 获取可旁听课程
export function getPeerCourses() {
  return request.get('/teacher/peer-courses')
}

// 获取同行评价指标
export function getPeerIndicators() {
  return request.get('/teacher/peer-indicators')
}

// 提交同行评价
export function submitPeerEvaluation(data) {
  return request.post('/teacher/submit-peer-evaluation', data)
}

// 图片上传接口 (示例, 路径需要与后端匹配)
export function uploadPeerImage(file) {
    const formData = new FormData();
    // 创建一个 FormData 对象，这是浏览器提供的表单数据工具。
    // 把图片文件 file 添加进去，键名是 'file'，后端会通过这个名字获取文件。
    formData.append('file', file);
    return request.post('/teacher/peer-image-upload', formData, {
      // 设置请求头 Content-Type 为 multipart/form-data，告诉服务器这是文件上传请求。
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}


// 获取我被评价的课程列表及评价数
export function getMyEvaluatedCourses() {
  return request.get('/teacher/my-evaluated-courses');
}

// 获取某门课程收到的所有同行评价详情
export function getEvaluationsForMyCourse(courseId) {
  return request.get('/teacher/evaluations-for-my-course', { params: { courseId } });
}

