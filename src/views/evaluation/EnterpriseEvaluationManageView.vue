<!-- 管理员管理企业企业评价页面 -->
<template>
  <div class="enterprise-evaluation-manage">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>企业评价管理</span>
          <div class="header-description">
            管理学校级别的企业评价意见
          </div>
        </div>
      </template>

      <!-- 搜索区域 -->
      <div class="search-section">
        <el-form :model="searchForm" inline>
          <el-form-item label="企业名称">
            <el-input
              v-model="searchForm.enterpriseName"
              placeholder="请输入企业名称"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchEvaluations">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 评价列表 -->
      <div class="evaluation-list">
        <el-table
          :data="evaluationList"
          v-loading="loading"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="evaluatorName" label="企业名称" width="200" />
          <el-table-column prop="comment" label="评价内容" show-overflow-tooltip />
          <el-table-column prop="createTime" label="评价时间" width="180">
            <template #default="scope">
              {{ formatTime(scope.row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <div class="operation-buttons">
                <el-button
                  type="primary"
                  size="small"
                  @click="viewDetail(scope.row)"
                >
                  查看详情
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  @click="deleteEvaluation(scope.row)"
                >
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="pagination.current"
            v-model:page-size="pagination.size"
            :page-sizes="[10, 20, 50, 100]"
            :total="pagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>

      <!-- 批量操作 -->
      <div class="batch-actions" v-if="selectedEvaluations.length > 0">
        <el-button
          type="danger"
          @click="batchDelete"
          :disabled="selectedEvaluations.length === 0"
        >
          批量删除 ({{ selectedEvaluations.length }})
        </el-button>
      </div>
    </el-card>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="企业评价详情"
      width="60%"
      :before-close="handleCloseDetail"
    >
      <div v-if="currentEvaluation" class="evaluation-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="企业名称">
            {{ currentEvaluation.evaluatorName }}
          </el-descriptions-item>
          <el-descriptions-item label="行业类型">
            {{ currentEvaluation.industryType || '未填写' }}
          </el-descriptions-item>
          <el-descriptions-item label="评价时间">
            {{ formatTime(currentEvaluation.createTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="评价类型">
            企业评价
          </el-descriptions-item>
        </el-descriptions>
        
        <div class="comment-section">
          <h4>评价内容：</h4>
          <div class="comment-content">
            {{ currentEvaluation.comment }}
          </div>
        </div>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
          <el-button
            type="danger"
            @click="deleteCurrentEvaluation"
          >
            删除此评价
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 删除确认对话框 -->
    <el-dialog
      v-model="deleteDialogVisible"
      title="确认删除"
      width="30%"
    >
      <span>确定要删除选中的企业评价吗？此操作不可恢复。</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="confirmDelete">确定删除</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import {
  getEnterpriseEvaluations,
  deleteEnterpriseEvaluation,
  batchDeleteEnterpriseEvaluations
} from '@/api/schooladmin'

const userStore = useUserStore()

// 响应式数据
const loading = ref(false)
const evaluationList = ref([])
const selectedEvaluations = ref([])
const detailDialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const currentEvaluation = ref(null)
const pendingDeleteEvaluation = ref(null)

// 搜索表单
const searchForm = reactive({
  enterpriseName: ''
})

// 分页
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

// 搜索评价
const searchEvaluations = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.current,
      size: pagination.size,
      ...searchForm
    }
    
    const response = await getEnterpriseEvaluations(params, userStore.userInfo)
    
    if (response.code === '200') {
      evaluationList.value = response.data.records
      pagination.total = response.data.total
    } else {
      ElMessage.error(response.message || '获取企业评价列表失败')
    }
  } catch (error) {
    console.error('获取企业评价列表失败:', error)
    ElMessage.error('获取企业评价列表失败')
  } finally {
    loading.value = false
  }
}

// 重置搜索
const resetSearch = () => {
  searchForm.enterpriseName = ''
  pagination.current = 1
  searchEvaluations()
}

// 查看详情
const viewDetail = (evaluation) => {
  currentEvaluation.value = evaluation
  detailDialogVisible.value = true
}

// 删除评价
const deleteEvaluation = (evaluation) => {
  pendingDeleteEvaluation.value = evaluation
  deleteDialogVisible.value = true
}

// 确认删除
const confirmDelete = async () => {
  if (!pendingDeleteEvaluation.value) return
  
  try {
    const response = await deleteEnterpriseEvaluation(
      pendingDeleteEvaluation.value.id,
      userStore.userInfo.id,
      '管理员删除',
      userStore.userInfo
    )
    
    if (response.code === '200') {
      ElMessage.success('删除成功')
      deleteDialogVisible.value = false
      pendingDeleteEvaluation.value = null
      searchEvaluations()
    } else {
      ElMessage.error(response.message || '删除失败')
    }
  } catch (error) {
    console.error('删除评价失败:', error)
    ElMessage.error('删除评价失败')
  }
}

// 删除当前查看的评价
const deleteCurrentEvaluation = async () => {
  if (!currentEvaluation.value) return
  
  try {
    await ElMessageBox.confirm(
      '确定要删除此企业评价吗？此操作不可恢复。',
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const response = await deleteEnterpriseEvaluation(
      currentEvaluation.value.id,
      userStore.userInfo.id,
      '管理员删除',
      userStore.userInfo
    )
    
    if (response.code === '200') {
      ElMessage.success('删除成功')
      detailDialogVisible.value = false
      currentEvaluation.value = null
      searchEvaluations()
    } else {
      ElMessage.error(response.message || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除评价失败:', error)
      ElMessage.error('删除评价失败')
    }
  }
}

// 批量删除
const batchDelete = async () => {
  if (selectedEvaluations.value.length === 0) return
  
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedEvaluations.value.length} 条企业评价吗？此操作不可恢复。`,
      '确认批量删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const evaluationIds = selectedEvaluations.value.map(item => item.id)
    const response = await batchDeleteEnterpriseEvaluations(
      evaluationIds,
      userStore.userInfo
    )
    
    if (response.code === '200') {
      ElMessage.success('批量删除成功')
      selectedEvaluations.value = []
      searchEvaluations()
    } else {
      ElMessage.error(response.message || '批量删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量删除失败:', error)
      ElMessage.error('批量删除失败')
    }
  }
}

// 选择变化
const handleSelectionChange = (selection) => {
  selectedEvaluations.value = selection
}

// 分页大小变化
const handleSizeChange = (size) => {
  pagination.size = size
  pagination.current = 1
  searchEvaluations()
}

// 当前页变化
const handleCurrentChange = (current) => {
  pagination.current = current
  searchEvaluations()
}

// 关闭详情对话框
const handleCloseDetail = () => {
  detailDialogVisible.value = false
  currentEvaluation.value = null
}

// 格式化时间
const formatTime = (time) => {
  if (!time) return ''
  return new Date(time).toLocaleString('zh-CN')
}

// 组件挂载时加载数据
onMounted(() => {
  searchEvaluations()
})
</script>

<style scoped>
.enterprise-evaluation-manage {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-description {
  font-size: 14px;
  color: #666;
  font-weight: normal;
}

.search-section {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.evaluation-list {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.batch-actions {
  margin-top: 20px;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.evaluation-detail {
  padding: 20px 0;
}

.comment-section {
  margin-top: 20px;
}

.comment-section h4 {
  margin-bottom: 10px;
  color: #333;
}

.comment-content {
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 4px;
  line-height: 1.6;
  white-space: pre-wrap;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.operation-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
