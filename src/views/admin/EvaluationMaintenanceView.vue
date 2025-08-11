<template>
  <div class="evaluation-maintenance">
    <div class="page-header">
      <h2>评价维护</h2>
      <p>处理恶意评价、不良评价或用户举报的评价信息</p>
    </div>

    <!-- 搜索区域 -->
    <div class="search-area">
      <el-form :model="searchForm" inline>
        <el-form-item label="评价类型">
          <el-select v-model="searchForm.evaluationType" placeholder="请选择评价类型" style="width: 150px;">
            <el-option label="全部" value=""></el-option>
            <el-option label="学生评价" value="student"></el-option>
            <el-option label="同行评价" value="peer"></el-option>
            <el-option label="督导评价" value="supervisor"></el-option>
            <el-option label="领导评价" value="leader"></el-option>
            <el-option label="企业评价" value="enterprise"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" style="width: 150px;">
            <el-option label="全部" value=""></el-option>
            <el-option label="待处理" value="pending"></el-option>
            <el-option label="已处理" value="processed"></el-option>
            <el-option label="已忽略" value="ignored"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="请输入关键词" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 评价列表 -->
    <div class="table-area">
      <el-table :data="evaluationList" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
        <el-table-column prop="evaluationType" label="评价类型" width="100" align="center">
          <template #default="scope">
            <el-tag :type="getEvaluationTypeTag(scope.row.evaluationType)">
              {{ getEvaluationTypeText(scope.row.evaluationType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="courseName" label="课程名称" width="150" align="center"></el-table-column>
        <el-table-column prop="teacherName" label="被评价教师" width="120" align="center"></el-table-column>
        <el-table-column prop="evaluatorName" label="评价人" width="120" align="center"></el-table-column>
        <el-table-column prop="score" label="评分" width="80" align="center"></el-table-column>
        <el-table-column prop="content" label="评价内容" min-width="200" align="center">
          <template #default="scope">
            <div class="content-preview">
              {{ scope.row.content ? scope.row.content.substring(0, 50) + '...' : '无' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="reportReason" label="举报原因" width="120" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.reportReason" type="danger" size="small">
              {{ scope.row.reportReason }}
            </el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="scope">
            <el-tag :type="getStatusTag(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="评价时间" width="150" align="center"></el-table-column>
        <el-table-column label="操作" width="250" align="center">
          <template #default="scope">
            <el-button size="small" @click="handleView(scope.row)">查看详情</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除评价</el-button>
            <el-button size="small" type="warning" @click="handleBanUser(scope.row)">禁言用户</el-button>
            <el-button size="small" type="info" @click="handleRevokePermission(scope.row)">取消权限</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-area">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 评价详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="评价详情" width="800px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="评价类型">{{ getEvaluationTypeText(currentEvaluation.evaluationType) }}</el-descriptions-item>
        <el-descriptions-item label="课程名称">{{ currentEvaluation.courseName }}</el-descriptions-item>
        <el-descriptions-item label="被评价教师">{{ currentEvaluation.teacherName }}</el-descriptions-item>
        <el-descriptions-item label="评价人">{{ currentEvaluation.evaluatorName }}</el-descriptions-item>
        <el-descriptions-item label="评分">{{ currentEvaluation.score }}</el-descriptions-item>
        <el-descriptions-item label="评价时间">{{ currentEvaluation.createTime }}</el-descriptions-item>
        <el-descriptions-item label="举报原因" :span="2">
          <el-tag v-if="currentEvaluation.reportReason" type="danger">
            {{ currentEvaluation.reportReason }}
          </el-tag>
          <span v-else>-</span>
        </el-descriptions-item>
        <el-descriptions-item label="评价内容" :span="2">
          <div class="evaluation-content">
            {{ currentEvaluation.content || '无评价内容' }}
          </div>
        </el-descriptions-item>
      </el-descriptions>
      
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
        <el-button type="danger" @click="handleDelete(currentEvaluation)">删除评价</el-button>
        <el-button type="warning" @click="handleBanUser(currentEvaluation)">禁言用户</el-button>
        <el-button type="info" @click="handleRevokePermission(currentEvaluation)">取消权限</el-button>
      </template>
    </el-dialog>

    <!-- 处理操作对话框 -->
    <el-dialog v-model="actionDialogVisible" :title="actionDialogTitle" width="500px">
      <el-form :model="actionForm" label-width="100px">
        <el-form-item label="处理原因" required>
          <el-input 
            v-model="actionForm.reason" 
            type="textarea" 
            :rows="4"
            placeholder="请输入处理原因"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="actionForm.action === 'ban'" label="禁言时长">
          <el-select v-model="actionForm.banDuration" placeholder="请选择禁言时长">
            <el-option label="1天" value="1"></el-option>
            <el-option label="3天" value="3"></el-option>
            <el-option label="7天" value="7"></el-option>
            <el-option label="30天" value="30"></el-option>
            <el-option label="永久" value="-1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="actionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAction">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import request from '@/utils/request'

const userStore = useUserStore()

// 响应式数据
const loading = ref(false)
const evaluationList = ref([])
const detailDialogVisible = ref(false)
const actionDialogVisible = ref(false)
const currentEvaluation = ref({})
const actionDialogTitle = ref('')
const actionForm = reactive({
  action: '',
  reason: '',
  banDuration: '7'
})

// 搜索表单
const searchForm = reactive({
  evaluationType: '',
  status: '',
  keyword: ''
})

// 分页信息
const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0
})

// 获取评价列表
const getEvaluationList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.currentPage,
      size: pagination.pageSize,
      ...searchForm
    }
    
    const response = await request.get('/api/admin/evaluation-maintenance', { params })
    if (response.code === '200') {
      evaluationList.value = response.data.records
      pagination.total = response.data.total
    } else {
      ElMessage.error(response.message || '获取评价列表失败')
    }
  } catch (error) {
    console.error('获取评价列表失败:', error)
    ElMessage.error('获取评价列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.currentPage = 1
  getEvaluationList()
}

// 重置
const handleReset = () => {
  Object.assign(searchForm, {
    evaluationType: '',
    status: '',
    keyword: ''
  })
  pagination.currentPage = 1
  getEvaluationList()
}

// 查看评价详情
const handleView = (evaluation) => {
  currentEvaluation.value = evaluation
  detailDialogVisible.value = true
}

// 删除评价
const handleDelete = async (evaluation) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除这条评价吗？此操作不可恢复。`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const response = await request.delete(`/api/admin/evaluation-maintenance/${evaluation.id}`)
    if (response.code === '200') {
      ElMessage.success('删除成功')
      getEvaluationList()
      detailDialogVisible.value = false
    } else {
      ElMessage.error(response.message || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除评价失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 禁言用户
const handleBanUser = (evaluation) => {
  actionForm.action = 'ban'
  actionForm.reason = ''
  actionForm.banDuration = '7'
  actionDialogTitle.value = '禁言用户'
  actionDialogVisible.value = true
}

// 取消权限
const handleRevokePermission = (evaluation) => {
  actionForm.action = 'revoke'
  actionForm.reason = ''
  actionDialogTitle.value = '取消评价权限'
  actionDialogVisible.value = true
}

// 确认操作
const confirmAction = async () => {
  if (!actionForm.reason.trim()) {
    ElMessage.warning('请输入处理原因')
    return
  }
  
  try {
    const data = {
      evaluationId: currentEvaluation.value.id,
      action: actionForm.action,
      reason: actionForm.reason
    }
    
    if (actionForm.action === 'ban') {
      data.banDuration = actionForm.banDuration
    }
    
    const response = await request.post('/api/admin/evaluation-maintenance/action', data)
    if (response.code === '200') {
      ElMessage.success('操作成功')
      actionDialogVisible.value = false
      getEvaluationList()
      detailDialogVisible.value = false
    } else {
      ElMessage.error(response.message || '操作失败')
    }
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error('操作失败')
  }
}

// 分页处理
const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.currentPage = 1
  getEvaluationList()
}

const handleCurrentChange = (page) => {
  pagination.currentPage = page
  getEvaluationList()
}

// 获取评价类型标签样式
const getEvaluationTypeTag = (type) => {
  const tagMap = {
    student: 'primary',
    peer: 'success',
    supervisor: 'warning',
    leader: 'info',
    enterprise: 'danger'
  }
  return tagMap[type] || 'default'
}

// 获取评价类型文本
const getEvaluationTypeText = (type) => {
  const textMap = {
    student: '学生评价',
    peer: '同行评价',
    supervisor: '督导评价',
    leader: '领导评价',
    enterprise: '企业评价'
  }
  return textMap[type] || type
}

// 获取状态标签样式
const getStatusTag = (status) => {
  const tagMap = {
    pending: 'warning',
    processed: 'success',
    ignored: 'info'
  }
  return tagMap[status] || 'default'
}

// 获取状态文本
const getStatusText = (status) => {
  const textMap = {
    pending: '待处理',
    processed: '已处理',
    ignored: '已忽略'
  }
  return textMap[status] || status
}

// 页面加载时获取数据
onMounted(() => {
  getEvaluationList()
})
</script>

<style scoped>
.evaluation-maintenance {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0 0 10px 0;
  color: #303133;
}

.page-header p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.search-area {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table-area {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.pagination-area {
  margin-top: 20px;
  text-align: right;
}

.content-preview {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.evaluation-content {
  max-height: 200px;
  overflow-y: auto;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
