<template>
  <div class="evaluation-list">
    <el-card
      v-for="evaluation in evaluations"
      :key="evaluation.id"
      class="evaluation-card"
      shadow="hover"
    >
      <!-- 评价头部信息 -->
      <div class="evaluation-header">
        <div class="evaluation-info">
          <span class="evaluator-name">{{ getEvaluatorName(evaluation) }}</span>
          <span class="evaluation-time">{{ formatTime(evaluation.createTime) }}</span>
        </div>
        <div class="management-actions">
          <el-dropdown @command="handleManagementAction" trigger="click">
            <el-button type="danger" size="small" plain>
              管理操作
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <!-- 匿名用户只能删除评价 -->
                <el-dropdown-item 
                  v-if="evaluation.isAnonymous"
                  :command="{ action: 'delete', evaluation: evaluation }"
                >
                  <el-icon><delete /></el-icon>
                  删除评价
                </el-dropdown-item>
                
                <!-- 非匿名用户的操作 -->
                <template v-else>
                  <el-dropdown-item 
                    :command="{ action: 'delete', evaluation: evaluation }"
                  >
                    <el-icon><delete /></el-icon>
                    删除评价
                  </el-dropdown-item>
                  <el-dropdown-item 
                    :command="{ action: 'deleteUser', evaluation: evaluation }"
                    divided
                  >
                    <el-icon><circle-close /></el-icon>
                    删除用户账号（同时删除所有评价）
                  </el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

  
      <!-- 评价分数 -->
      <div class="evaluation-scores" v-if="evaluation.scores && evaluation.scores.length > 0">
        <div class="scores-title">评价指标</div>
        <div class="scores-grid">
          <div 
            v-for="score in evaluation.scores" 
            :key="score.indicatorName"
            class="score-item"
          >
            <div class="score-label">{{ score.indicatorName }}</div>
            <div class="score-value">
              <span class="score-number">{{ score.score }}</span>
              <span class="score-max">/ {{ score.maxScore }}</span>
            </div>
            <el-progress 
              :percentage="(score.score / score.maxScore) * 100" 
              :color="getScoreColor(score.score / score.maxScore)"
              :show-text="false"
              :stroke-width="6"
            />
          </div>
        </div>
      </div>

      <!-- 评价内容 -->
      <div class="evaluation-comment" v-if="evaluation.comment">
        <div class="comment-title">评价内容</div>
        <div class="comment-content">{{ evaluation.comment }}</div>
      </div>

      <!-- 图片展示区 -->
      <div
        v-if="getEvaluationImages(evaluation).length > 0"
        class="evaluation-images"
      >
        <div class="images-title">相关图片</div>
        <div class="images-grid">
          <img
            v-for="(img, idx) in getEvaluationImages(evaluation)"
            :key="idx"
            :src="img"
            class="evaluation-image"
            @click="showImage(img)"
          />
        </div>
      </div>
    </el-card>

    <!-- 空状态 -->
    <el-empty 
      v-if="evaluations.length === 0" 
      description="暂无评价数据"
      :image-size="120"
    />
  </div>

  <!-- 图片放大遮罩层 -->
  <div v-if="showImageModal" class="image-modal" @click="closeImage">
    <div class="image-modal-content" @click.stop>
      <img :src="currentImage" class="modal-image" />
      <div class="close-btn" @click="closeImage">×</div>
    </div>
  </div>

  <!-- 确认对话框 -->
  <el-dialog v-model="confirmDialogVisible" :title="confirmDialogTitle" width="400px">
    <div class="confirm-content">
      <el-icon class="confirm-icon" :class="confirmIconClass">
        <component :is="confirmIcon" />
      </el-icon>
      <p>{{ confirmDialogMessage }}</p>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="confirmDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="confirmAction">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown, Delete, CircleClose } from '@element-plus/icons-vue'
import { deleteEvaluation, deleteUser } from '@/api/schooladmin'
import { useUserStore } from '@/stores/user'

const props = defineProps({
  evaluations: {
    type: Array,
    default: () => []
  },
  type: {
    type: String,
    default: ''
  }
})

const userStore = useUserStore()

// 图片放大相关
const showImageModal = ref(false)
const currentImage = ref('')

// 确认对话框相关
const confirmDialogVisible = ref(false)
const confirmDialogTitle = ref('')
const confirmDialogMessage = ref('')
const confirmIcon = ref('')
const confirmIconClass = ref('')
const pendingAction = ref(null)

// 处理评价图片数据
const getEvaluationImages = (evaluation) => {
  if (evaluation.imageUrls) {
    // 如果是逗号分隔的字符串，转换为数组
    if (typeof evaluation.imageUrls === 'string') {
      return evaluation.imageUrls.split(',').filter(url => url.trim() !== '')
    }
    // 如果已经是数组，直接返回
    if (Array.isArray(evaluation.imageUrls)) {
      return evaluation.imageUrls
    }
  }
  // 兼容旧的 images 字段
  if (evaluation.images && Array.isArray(evaluation.images)) {
    return evaluation.images
  }
  return []
}

// 根据分数比例获取颜色
const getScoreColor = (ratio) => {
  if (ratio >= 0.8) return '#67C23A' // 绿色 - 优秀
  if (ratio >= 0.6) return '#E6A23C' // 橙色 - 良好
  if (ratio >= 0.4) return '#F56C6C' // 红色 - 一般
  return '#F56C6C' // 红色 - 较差
}

// 显示图片
const showImage = (imgSrc) => {
  currentImage.value = imgSrc
  showImageModal.value = true
}

// 关闭图片
const closeImage = () => {
  showImageModal.value = false
  currentImage.value = ''
}

// 获取评价者姓名
const getEvaluatorName = (evaluation) => {
  if (evaluation.isAnonymous) {
    return '匿名用户'
  }
  return evaluation.evaluatorName || '未知用户'
}

// 格式化时间
const formatTime = (time) => {
  if (!time) return ''
  return new Date(time).toLocaleString('zh-CN')
}

// 处理管理操作
const handleManagementAction = (command) => {
  const { action, evaluation } = command
  
  switch (action) {
    case 'delete':
      showConfirmDialog('删除评价', '确定要删除这条评价吗？此操作不可恢复。', 'Delete', 'warning')
      break
    case 'deleteUser':
      showConfirmDialog('删除用户账号', '确定要删除该用户的账号吗？删除后将同时删除该用户的所有评价、图片和分数数据。此操作不可恢复。', 'CircleClose', 'error')
      break
  }
  
  pendingAction.value = { action, evaluation }
}

// 显示确认对话框
const showConfirmDialog = (title, message, icon, type) => {
  confirmDialogTitle.value = title
  confirmDialogMessage.value = message
  confirmIcon.value = icon
  confirmIconClass.value = type
  confirmDialogVisible.value = true
}

// 确认操作
const confirmAction = async () => {
  if (!pendingAction.value) return
  
  const { action, evaluation } = pendingAction.value
  
  try {
    let response
    const adminId = userStore.userInfo?.Id 
    
    switch (action) {
      case 'delete':
        response = await deleteEvaluation(evaluation.id, evaluation.type, userStore.userInfo)
        break
      case 'deleteUser':
        console.log(evaluation)
        response = await deleteUser(evaluation.evaluatorId, evaluation.type, userStore.userInfo)
        break
    }
    
    if (response.code === '200') {
      ElMessage.success('操作成功')
      // 触发父组件刷新数据
      emit('refresh')
    } else {
      ElMessage.error(response.message || '操作失败')
    }
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error('操作失败')
  } finally {
    confirmDialogVisible.value = false
    pendingAction.value = null
  }
}

// 定义emit
const emit = defineEmits(['refresh'])
</script>

<style scoped>
.evaluation-list {
  padding: 8px 0;
  background: #fafbfc;
  border-radius: 8px;
  padding: 16px;
}

.evaluation-card {
  margin-bottom: 24px;
  border-radius: 12px;
  border: 2px solid #e8eaec;
  background: #ffffff;
  transition: all 0.3s ease;
  position: relative;
}

.evaluation-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  border-color: #409EFF;
}

.evaluation-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #409EFF, #67C23A, #E6A23C, #F56C6C);
  border-radius: 12px 12px 0 0;
}

/* 评价头部 */
.evaluation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
}

.evaluation-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.evaluator-name {
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
}

.evaluation-time {
  font-size: 12px;
  color: #909399;
  background: #f8f9fa;
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
}

.management-actions {
  display: flex;
  gap: 8px;
}

/* 评价分数 */
.evaluation-scores {
  margin-bottom: 20px;
}

.scores-title {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 12px;
  font-size: 14px;
}

.scores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.score-item {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e8eaec;
}

.score-label {
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 6px;
  font-size: 13px;
}

.score-value {
  display: flex;
  align-items: baseline;
  margin-bottom: 6px;
}

.score-number {
  font-size: 16px;
  font-weight: bold;
  color: #409EFF;
  margin-right: 4px;
}

.score-max {
  font-size: 14px;
  color: #909399;
}

/* 评价内容 */
.evaluation-comment {
  margin-bottom: 20px;
  padding: 16px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 8px;
  border-left: 4px solid #409EFF;
  position: relative;
}

.comment-title {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 14px;
}

.comment-content {
  color: #606266;
  line-height: 1.6;
  font-size: 14px;
}

/* 图片展示 */
.evaluation-images {
  margin-top: 16px;
}

.images-title {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 12px;
  font-size: 14px;
}

.images-grid {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.evaluation-image {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  border: 2px solid #e8eaec;
  transition: all 0.3s ease;
  cursor: pointer;
  object-fit: cover;
}

.evaluation-image:hover {
  border-color: #409EFF;
  transform: scale(1.02);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
}

/* 图片放大遮罩层 */
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.image-modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
}

.modal-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.close-btn {
  position: absolute;
  top: -40px;
  right: 0;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 20px;
  color: #333;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #fff;
  transform: scale(1.1);
}

/* 确认对话框样式 */
.confirm-content {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 0;
}

.confirm-icon {
  font-size: 24px;
}

.confirm-icon.warning {
  color: #E6A23C;
}

.confirm-icon.error {
  color: #F56C6C;
}

.confirm-content p {
  margin: 0;
  color: #606266;
  line-height: 1.6;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
