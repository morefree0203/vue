
<!-- 企业评价页面 -->
<template>
  <div class="enterprise-evaluation">
    <div class="page-header">
      <h2>企业评价</h2>
      <p class="page-desc">请对学校整体人才培养质量进行评价，为学校改进提供宝贵意见</p>
    </div>

    <!-- 评价表单 -->
    <el-card class="evaluation-form-card">
      <template #header>
        <div class="card-header">
          <span>提交评价</span>
        </div>
      </template>

      <el-form :model="evaluationForm" :rules="rules" ref="evaluationFormRef" label-width="120px">
        <el-form-item label="评价内容" prop="comment">
          <el-input
            v-model="evaluationForm.comment"
            type="textarea"
            :rows="8"
            placeholder="请详细描述您对学校整体人才培养质量的评价，包括：&#10;&#10;1. 贵企业招聘的我校毕业生整体表现情况&#10;2. 毕业生在专业技能、综合素质方面的优势与不足&#10;3. 对学校人才培养方案的建议&#10;4. 对校企合作、实习实训的建议&#10;5. 其他相关建议和意见&#10;&#10;您的评价将帮助学校持续改进人才培养质量，感谢您的宝贵意见！"
            maxlength="2000"
            show-word-limit
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitEvaluation" :loading="submitting">
            提交评价
          </el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 我的评价历史 -->
    <el-card class="history-card">
      <template #header>
        <div class="card-header">
          <span>我的评价历史</span>
        </div>
      </template>

      <el-table :data="evaluationHistory" v-loading="loading" stripe>
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
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { submitEnterpriseEvaluation, getEnterpriseEvaluationHistory } from '@/api/enterprise'

const userStore = useUserStore()
const evaluationFormRef = ref()
const loading = ref(false)
const submitting = ref(false)

// 表单数据
const evaluationForm = reactive({
  comment: ''
})

// 表单验证规则
const rules = {
  comment: [
    { required: true, message: '请填写评价内容', trigger: 'blur' },
    { min: 10, message: '评价内容至少10个字符', trigger: 'blur' }
  ]
}

// 评价历史
const evaluationHistory = ref([])

// 获取评价历史
const getEvaluationHistory = async () => {
  try {
    loading.value = true
    const response = await getEnterpriseEvaluationHistory(userStore.userInfo.id)
    evaluationHistory.value = response.data || []
  } catch (error) {
    ElMessage.error('获取评价历史失败')
  } finally {
    loading.value = false
  }
}

// 提交评价
const submitEvaluation = async () => {
  try {
    await evaluationFormRef.value.validate()
    submitting.value = true
    
    const params = {
      ...evaluationForm,
      enterpriseId: userStore.userInfo.id
    }
    
    await submitEnterpriseEvaluation(params)
    
    ElMessage.success('评价提交成功')
    resetForm()
    getEvaluationHistory()
  } catch (error) {
    ElMessage.error('评价提交失败')
  } finally {
    submitting.value = false
  }
}

// 重置表单
const resetForm = () => {
  evaluationFormRef.value.resetFields()
  evaluationForm.comment = ''
}

// 格式化时间
const formatTime = (time) => {
  if (!time) return ''
  const date = new Date(time)
  return date.toLocaleString('zh-CN')
}

onMounted(() => {
  getEvaluationHistory()
})
</script>

<style scoped>
.enterprise-evaluation {
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

.evaluation-form-card {
  margin-bottom: 24px;
}

.card-header {
  font-weight: bold;
  color: #303133;
}

.history-card {
  margin-top: 24px;
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

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #2c3e50;
}

:deep(.el-textarea__inner) {
  font-family: 'Microsoft YaHei', sans-serif;
  line-height: 1.6;
}

:deep(.el-table) {
  margin-top: 16px;
}

:deep(.el-table .cell) {
  padding: 8px 12px;
}
</style> 