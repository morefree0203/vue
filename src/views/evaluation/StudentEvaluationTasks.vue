<template>
  <div class="student-evaluation-tasks">
    <el-card class="tasks-card">
      <template #header>
        <div class="card-header">
          <span>我的评价任务</span>
        </div>
      </template>
      <el-table
        :data="taskList"
        style="width: 100%"
        border
        v-loading="loading"
        empty-text="暂无评价任务"
      >
        <el-table-column prop="courseName" label="课程名称" min-width="120" />
        <el-table-column prop="teacherName" label="授课教师" min-width="100" />
        <el-table-column prop="evaluationType" label="任务类型" min-width="100" />
        <el-table-column prop="startTime" label="开始时间" min-width="140" />
        <el-table-column prop="endTime" label="结束时间" min-width="140" />
        <el-table-column
          prop="status"
          label="任务进度"
          min-width="100"
          :formatter="formatStatus"
        />
        <el-table-column label="操作" min-width="120">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              :disabled="scope.row.status === 1"
              @click="goToEvaluation(scope.row)"
            >
              {{ scope.row.status === 1 ? '已完成' : '去评价' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getCurrentAcademicYear, getCurrentSemester } from '@/utils/date'
import { fetchStudentEvaluationTasks } from '@/api/student' // 你的API
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const router = useRouter()
const loading = ref(false)
const taskList = ref([])
const academicYear = getCurrentAcademicYear()
const semester = getCurrentSemester()

const fetchTasks = async () => {
  loading.value = true
  try {
    // 这里调用后端API获取任务列表
    const res = await fetchStudentEvaluationTasks(userStore.userId, academicYear, semester)
    taskList.value = res.data
    // 示例数据
  } catch (e) {
    ElMessage.error('获取评价任务失败')
  }
  loading.value = false
}

const formatStatus = (row, column, cellValue) => {
  return cellValue === 1 ? '已完成' : '未完成'
}

const goToEvaluation = (row) => {
  // 跳转到具体评价页面，带上 assignmentId
  router.push({ path: `/student/evaluation/${row.id}` })
}

onMounted(() => {
  fetchTasks()
})
</script>

<style scoped>
.student-evaluation-tasks {
  width: 100%;
  min-height: 100%;
  box-sizing: border-box;
  padding: 0px 16px;
  background: #f5f6fa;
  overflow: auto;
}
.tasks-card {
  width: 90%;
  max-width: 1800px;
  margin: 0 auto;
  background: #fafbfc;
  border-radius: 12px;
  padding: 36px 36px 24px 36px;
  font-size: 20px;
  box-sizing: border-box;
  box-shadow: none;
  border: none;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 32px;
  font-weight: bold;
  padding-bottom: 18px;
  border-bottom: 1px solid #f0f0f0;
}
.el-table {
  margin-top: 24px;
  font-size: 20px;
  background: #fff;
  border-radius: 8px;
}
.el-table th, .el-table td {
  text-align: center;
}
.el-button {
  font-size: 18px;
  border-radius: 8px;
}
</style> 