<!-- 数据统计 -->


<template>
  <div class="statistics-view">
    <el-card>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="评价统计" name="evaluation">
          <div class="filter-bar">
            <el-select v-model="evaluationFilter.collegeId" placeholder="选择学院" clearable style="width: 180px;">
              <el-option v-for="college in collegeList" :key="college.id" :label="college.name" :value="college.id" />
            </el-select>
            <el-button type="primary" @click="fetchEvaluationStats">查询</el-button>
          </div>
          <el-table :data="evaluationStats" v-loading="loading.evaluation">
            <el-table-column prop="collegeName" label="学院" />
            <el-table-column prop="departmentName" label="系" />
            <el-table-column prop="courseName" label="课程" />
            <el-table-column prop="score" label="平均分" />
            <el-table-column prop="count" label="评价人数" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="课程统计" name="course">
          <div class="filter-bar">
            <el-select v-model="courseFilter.collegeId" placeholder="选择学院" clearable style="width: 180px;">
              <el-option v-for="college in collegeList" :key="college.id" :label="college.name" :value="college.id" />
            </el-select>
            <el-button type="primary" @click="fetchCourseStats">查询</el-button>
          </div>
          <el-table :data="courseStats" v-loading="loading.course">
            <el-table-column prop="collegeName" label="学院" />
            <el-table-column prop="departmentName" label="系" />
            <el-table-column prop="courseName" label="课程" />
            <el-table-column prop="teacherName" label="教师" />
            <el-table-column prop="studentCount" label="选课人数" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="用户统计" name="user">
          <div class="filter-bar">
            <el-select v-model="userFilter.role" placeholder="选择角色" clearable style="width: 180px;">
              <el-option label="学生" value="student" />
              <el-option label="教师" value="teacher" />
              <el-option label="企业导师" value="enterprise" />
              <el-option label="校领导" value="leader" />
              <el-option label="督导员" value="supervisor" />
            </el-select>
            <el-button type="primary" @click="fetchUserStats">查询</el-button>
          </div>
          <el-table :data="userStats" v-loading="loading.user">
            <el-table-column prop="role" label="角色" />
            <el-table-column prop="count" label="人数" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const activeTab = ref('evaluation')
const collegeList = ref([])

// 评价统计
const evaluationStats = ref([])
const evaluationFilter = reactive({ collegeId: '' })
// 课程统计
const courseStats = ref([])
const courseFilter = reactive({ collegeId: '' })
// 用户统计
const userStats = ref([])
const userFilter = reactive({ role: '' })

const loading = reactive({
  evaluation: false,
  course: false,
  user: false
})

// 获取学院列表
const fetchColleges = async () => {
  try {
    const res = await axios.get('/api/organization/college/list')
    collegeList.value = res.data.data || []
  } catch (e) {
    ElMessage.error('获取学院列表失败')
  }
}
// 评价统计
const fetchEvaluationStats = async () => {
  loading.evaluation = true
  try {
    const res = await axios.get('/api/statistics/evaluation', { params: evaluationFilter })
    evaluationStats.value = res.data.data || []
  } catch (e) {
    ElMessage.error('获取评价统计失败')
  } finally {
    loading.evaluation = false
  }
}
// 课程统计
const fetchCourseStats = async () => {
  loading.course = true
  try {
    const res = await axios.get('/api/statistics/course', { params: courseFilter })
    courseStats.value = res.data.data || []
  } catch (e) {
    ElMessage.error('获取课程统计失败')
  } finally {
    loading.course = false
  }
}
// 用户统计
const fetchUserStats = async () => {
  loading.user = true
  try {
    const res = await axios.get('/api/statistics/user', { params: userFilter })
    userStats.value = res.data.data || []
  } catch (e) {
    ElMessage.error('获取用户统计失败')
  } finally {
    loading.user = false
  }
}

onMounted(() => {
  fetchColleges()
  fetchEvaluationStats()
  fetchCourseStats()
  fetchUserStats()
})
</script>

<style scoped>
.statistics-view {
  padding: 24px;
}
.filter-bar {
  margin-bottom: 16px;
  display: flex;
  gap: 12px;
  align-items: center;
}
</style> 