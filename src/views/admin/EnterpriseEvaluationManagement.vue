
<!-- 管理员查看企业评价模块 -->

<template>
  <div class="enterprise-evaluation-management">
    <div class="page-header">
      <h2>企业评价管理</h2>
      <p class="page-desc">查看所有企业提交的学校整体评价，分析人才培养质量反馈</p>
    </div>

    <!-- 搜索筛选 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="企业名称">
          <el-input v-model="searchForm.enterpriseName" placeholder="请输入企业名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 评价列表 -->
    <el-card class="list-card">
      <template #header>
        <div class="card-header">
          <span>企业评价列表</span>
          <span class="total-count">共 {{ total }} 条评价</span>
        </div>
      </template>

      <el-table :data="evaluationList" v-loading="loading" stripe>
        <el-table-column prop="enterpriseName" label="企业名称" width="200" />
        <el-table-column prop="industryType" label="行业类型" width="120" />
        <el-table-column prop="comment" label="评价内容" min-width="400">
          <template #default="scope">
            <div class="comment-cell">
              <div class="comment-text">{{ scope.row.comment }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="评价时间" width="180" align="center">
          <template #default="scope">
            <div class="time-cell">
              {{ formatTime(scope.row.createTime) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right" align="center">
          <template #default="scope">
            <el-button size="small" @click="viewDetail(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 评价详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="企业评价详情"
      width="800px"
      :close-on-click-modal="false"
    >
      <div v-if="currentEvaluation" class="evaluation-detail">
        <div class="detail-item">
          <label>企业名称：</label>
          <span>{{ currentEvaluation.enterpriseName }}</span>
        </div>
        <div class="detail-item">
          <label>行业类型：</label>
          <span>{{ currentEvaluation.industryType }}</span>
        </div>
        <div class="detail-item">
          <label>评价时间：</label>
          <span>{{ formatTime(currentEvaluation.createTime) }}</span>
        </div>
        <div class="detail-item">
          <label>评价内容：</label>
          <div class="comment-content">{{ currentEvaluation.comment }}</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getAllEnterpriseEvaluations, getEnterpriseEvaluationDetail } from '@/api/enterprise'

const loading = ref(false)
const detailDialogVisible = ref(false)
const currentEvaluation = ref(null)
const total = ref(0)

// 搜索表单
const searchForm = reactive({
  enterpriseName: ''
})

// 分页
const pagination = reactive({
  current: 1,
  size: 20
})

// 评价列表
const evaluationList = ref([])

// 获取评价列表
const getEvaluationList = async () => {
  try {
    loading.value = true
    const params = {
      ...searchForm,
      page: (pagination.current - 1) * pagination.size,
      size: pagination.size
    }
    
    const response = await getAllEnterpriseEvaluations(params)
    evaluationList.value = response.data.evaluations || []
    total.value = response.data.total || 0
  } catch (error) {
    ElMessage.error('获取评价列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.current = 1
  getEvaluationList()
}

// 重置搜索
const resetSearch = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = ''
  })
  pagination.current = 1
  getEvaluationList()
}

// 分页大小变化
const handleSizeChange = (size) => {
  pagination.size = size
  pagination.current = 1
  getEvaluationList()
}

// 当前页变化
const handleCurrentChange = (current) => {
  pagination.current = current
  getEvaluationList()
}

// 查看详情
const viewDetail = async (row) => {
  try {
    const response = await getEnterpriseEvaluationDetail(row.id)
    currentEvaluation.value = response.data
    detailDialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取评价详情失败')
  }
}

// 格式化时间
const formatTime = (time) => {
  if (!time) return ''
  const date = new Date(time)
  return date.toLocaleString('zh-CN')
}

onMounted(() => {
  getEvaluationList()
})
</script>

<style scoped>
.enterprise-evaluation-management {
  padding: 24px;
  background: #fff;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h2 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 24px;
}

.page-desc {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

.search-card {
  margin-bottom: 24px;
}

.list-card {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  color: #303133;
}

.total-count {
  font-size: 14px;
  color: #909399;
  font-weight: normal;
}

.comment-cell {
  padding: 8px 0;
}

.comment-text {
  line-height: 1.6;
  word-wrap: break-word;
  white-space: pre-wrap;
  max-height: 120px;
  overflow-y: auto;
  color: #606266;
}

.time-cell {
  text-align: center;
  color: #909399;
  font-size: 14px;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.evaluation-detail {
  padding: 20px;
}

.detail-item {
  margin-bottom: 16px;
  display: flex;
  align-items: flex-start;
}

.detail-item label {
  font-weight: bold;
  color: #303133;
  width: 100px;
  flex-shrink: 0;
}

.detail-item span {
  color: #606266;
}

.comment-content {
  margin-top: 8px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 4px;
  line-height: 1.6;
  white-space: pre-wrap;
  color: #606266;
  max-height: 300px;
  overflow-y: auto;
}

:deep(.el-table) {
  margin-top: 16px;
}

:deep(.el-table .cell) {
  padding: 8px 12px;
}
</style> 