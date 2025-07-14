<template>
  <div class="evaluation-manage-view">
    <el-card>
      <div class="header">
        <span class="title">评价管理</span>
        <el-button type="primary" @click="fetchEvaluations">刷新</el-button>
      </div>
      <div class="filter-bar">
        <el-select v-model="filter.collegeId" placeholder="选择学院" clearable style="width: 180px;">
          <el-option v-for="college in collegeList" :key="college.id" :label="college.name" :value="college.id" />
        </el-select>
        <el-select v-model="filter.departmentId" placeholder="选择系" clearable style="width: 180px;">
          <el-option v-for="dep in departmentList" :key="dep.id" :label="dep.name" :value="dep.id" />
        </el-select>
        <el-button type="primary" @click="fetchEvaluations">查询</el-button>
      </div>
      <el-table :data="evaluationList" v-loading="loading" style="margin-top: 16px;">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="courseName" label="课程名称" />
        <el-table-column prop="teacherName" label="教师" />
        <el-table-column prop="studentName" label="学生" />
        <el-table-column prop="score" label="得分" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.status === '已完成' ? 'success' : 'info'">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button size="small" @click="viewDetail(scope.row)">详情</el-button>
            <el-button size="small" type="danger" @click="deleteEvaluation(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 详情对话框 -->
      <el-dialog title="评价详情" v-model="detailDialogVisible">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="课程">{{ detail.courseName }}</el-descriptions-item>
          <el-descriptions-item label="教师">{{ detail.teacherName }}</el-descriptions-item>
          <el-descriptions-item label="学生">{{ detail.studentName }}</el-descriptions-item>
          <el-descriptions-item label="得分">{{ detail.score }}</el-descriptions-item>
          <el-descriptions-item label="评价内容">{{ detail.content }}</el-descriptions-item>
          <el-descriptions-item label="状态">{{ detail.status }}</el-descriptions-item>
        </el-descriptions>
        <template #footer>
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'

const evaluationList = ref([])
const loading = ref(false)
const collegeList = ref([])
const departmentList = ref([])
const filter = reactive({
  collegeId: '',
  departmentId: ''
})

// 详情对话框
const detailDialogVisible = ref(false)
const detail = reactive({})

// 获取评价列表
const fetchEvaluations = async () => {
  loading.value = true
  try {
    const res = await axios.get('/api/evaluation/manage/list', { params: filter })
    evaluationList.value = res.data.data || []
  } catch (e) {
    ElMessage.error('获取评价列表失败')
  } finally {
    loading.value = false
  }
}
// 获取学院列表
const fetchColleges = async () => {
  try {
    const res = await axios.get('/api/organization/college/list')
    collegeList.value = res.data.data || []
  } catch (e) {
    ElMessage.error('获取学院列表失败')
  }
}
// 获取系列表
const fetchDepartments = async () => {
  try {
    const res = await axios.get('/api/organization/department/list')
    departmentList.value = res.data.data || []
  } catch (e) {
    ElMessage.error('获取系列表失败')
  }
}
// 查看详情
const viewDetail = (row) => {
  Object.assign(detail, row)
  detailDialogVisible.value = true
}
// 删除评价
const deleteEvaluation = (id) => {
  ElMessageBox.confirm('确定删除该评价吗？', '提示', { type: 'warning' })
    .then(async () => {
      await axios.post('/api/evaluation/manage/delete', { id })
      ElMessage.success('删除成功')
      fetchEvaluations()
    })
    .catch(() => {})
}

onMounted(() => {
  fetchColleges()
  fetchDepartments()
  fetchEvaluations()
})
</script>

<style scoped>
.evaluation-manage-view {
  padding: 24px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.title {
  font-size: 20px;
  font-weight: bold;
}
.filter-bar {
  margin-bottom: 16px;
  display: flex;
  gap: 12px;
  align-items: center;
}
</style> 