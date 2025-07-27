
import request from '@/utils/request'

export function getSupervisorLeaderCourses(teacherId) {
  return request.get('/supervisor-leader/courses', { params: { teacherId} })
}

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

// 获取督导可评价课程
export function getSupervisorCourses() {
  return request.get('/supervisor-leader/supervisor-courses')
}

// 获取领导可评价课程
export function getLeaderCourses() {
  return request.get('/supervisor-leader/leader-courses')
}
// 获取督导评价指标
export function getSupervisorIndicators() {
  return request.get('/supervisor-leader/supervisor-indicators')
}

// 获取领导评价指标
export function getLeaderIndicators() {
  return request.get('/supervisor-leader/leader-indicators')
}

// 提交督导评价
export function submitSupervisorEvaluation(data) {
  return request.post('/supervisor-leader/submit-supervisor-evaluation', data)
}

// 提交领导评价
export function submitLeaderEvaluation(data) {
  return request.post('/supervisor-leader/submit-leader-evaluation', data)
}
