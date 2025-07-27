
import request from '@/utils/request'

// 获取督导和领导可评价课程(也就是全校的课程)
export function getSupervisorLeaderCourses(teacherId) {
  return request.get('/supervisor-leader/courses', { params: { teacherId} })
}

// 获取督导和领导评价指标
export function getSupervisorLeaderIndicators() {
  return request.get('/supervisor-leader/indicators')
}

export function submitSupervisorLeaderEvaluation(data) {
  return request.post('/supervisor-leader/submit-evaluation', data)
}

// 根据权限范围获取评价列表
export function getEvaluationsByScope(params) {
  return request.get('/supervisor-leader/evaluations', { params })
}

// 获取评价详情
export function getEvaluationDetail(courseId) {
  return request.get('/supervisor-leader/evaluation-detail', { params: { courseId } })
}



