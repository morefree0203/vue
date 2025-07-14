
<template>
  <div class="dashboard-view">
    <!-- 系统公告 -->
    <el-card class="dashboard-section" shadow="hover">
      <template #header>
        <span>系统公告</span>
      </template>
      <el-alert
        v-for="notice in notices"
        :key="notice.id"
        :title="notice.title"
        type="info"
        :description="notice.content"
        show-icon
        style="margin-bottom: 8px;"
      />
    </el-card>

    <!-- 个人信息 -->
    <el-card class="dashboard-section" shadow="hover">
      <template #header>
        <span>个人信息</span>
      </template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="用户名">{{ userInfo.username }}</el-descriptions-item>
        <el-descriptions-item label="角色">{{ userInfo.role }}</el-descriptions-item>
        <el-descriptions-item label="所属组织">{{ userInfo.departmentName || '-' }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 统计概览 -->
    <el-card class="dashboard-section" shadow="hover">
      <template #header>
        <span>统计概览</span>
      </template>
      <el-row :gutter="24">
        <el-col :span="6">
          <el-statistic title="课程总数" :value="overview.courseCount" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="教师总数" :value="overview.teacherCount" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="学生总数" :value="overview.studentCount" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="本学期评价数" :value="overview.evaluationCount" />
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const userInfo = userStore.userInfo

// 系统公告
const notices = ref([])
// 统计概览
const overview = ref({
  courseCount: 0,
  teacherCount: 0,
  studentCount: 0,
  evaluationCount: 0
})

// 获取系统公告
function fetchNotices() {
  axios.get('http://localhost:8080/api/notice/list')
    .then(res => {
      notices.value = res.data.data || []
    })
    .catch(() => {})
}

// 获取统计概览
function fetchOverview() {
  axios.get('http://localhost:8080/api/dashboard/overview')
    .then(res => {
      overview.value = res.data.data || overview.value
    })
    .catch(() => {})
}

onMounted(() => {
  fetchNotices()
  fetchOverview()
})
</script>

<style scoped>
.dashboard-view {
  padding: 24px;
  background: #f5f7fa;
  min-height: 100vh;
}
.dashboard-section {
  margin-bottom: 24px;
}
</style> 