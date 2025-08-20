import request from '@/utils/request'

// 企业提交评价
export function submitEnterpriseEvaluation(data) {
  console.log(data);
  return request.post('/enterprise/submit-evaluation', data)
}

// 企业查看自己的评价历史
export function getEnterpriseEvaluationHistory(enterpriseId) {
  console.log(enterpriseId);
  return request.get('/enterprise/my-evaluations', { params: { enterpriseId } })
}

// // 管理员获取所有企业评价
// export function getAllEnterpriseEvaluations(params) {
//   return request.get('/enterprise/all-evaluations', { params })
// }

// // 管理员获取企业评价详情
// export function getEnterpriseEvaluationDetail(evaluationId) {
//   return request.get('/enterprise/evaluation-detail', { params: { evaluationId } })
// } 