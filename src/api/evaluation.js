// 教学评价相关接口
// 包含学生评价、同行评价、督导评价、领导评价、企业评价、评价管理、评价指标管理等
import request from '@/utils/request'

// 学生评价相关接口
export function getStudentEvaluations(params) {
  // return request.get('/api/evaluation/student', { params })
}

// 同行评价相关接口
export function getPeerEvaluations(params) {
  // return request.get('/api/evaluation/peer', { params })
}

// 督导评价相关接口
export function getSupervisorEvaluations(params) {
  // return request.get('/api/evaluation/supervisor', { params })
}

// 领导评价相关接口
export function getLeaderEvaluations(params) {
  // return request.get('/api/evaluation/leader', { params })
}

// 企业评价相关接口
export function getEnterpriseEvaluations(params) {
  // return request.get('/api/evaluation/enterprise', { params })
}

// 评价管理相关接口
export function getEvaluationManage(params) {
  // return request.get('/api/evaluation/manage', { params })
}

// 评价指标管理相关接口
export function getEvaluationIndicators(params) {
  // return request.get('/api/evaluation/indicators', { params })
} 