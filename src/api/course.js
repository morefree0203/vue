// 课程管理相关接口
// 包含课程列表、我的课程、课程信息管理、教师分配、学生选课、院系课程管理、专业课程管理等
import request from '@/utils/request'

// 获取课程列表
export function getCourseList(params) {
  // return request.get('/api/course/list', { params })
}



// 课程信息管理相关接口
export function getCourseInfo(params) {
  // return request.get('/api/course/info', { params })
}

// 院系课程管理相关接口
export function getCollegeCourses(params) {
  // return request.get('/api/course/college', { params })
}

// 专业课程管理相关接口
export function getDepartmentCourses(params) {
  // return request.get('/api/course/department', { params })
} 