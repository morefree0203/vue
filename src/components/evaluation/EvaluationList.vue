<template>
  <div class="evaluation-list">
    <el-card
      v-for="evaluation in evaluations"
      :key="evaluation.id"
      class="evaluation-card"
      shadow="hover"
    >


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
        v-if="evaluation.images && evaluation.images.length > 0"
        class="evaluation-images"
      >
        <div class="images-title">相关图片</div>
        <div class="images-grid">
          <img
            v-for="(img, idx) in evaluation.images"
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
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  evaluations: {
    type: Array,
    default: () => []
  }
})

// 图片放大相关
const showImageModal = ref(false)
const currentImage = ref('')



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
  justify-content: flex-end;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
}

.evaluation-time {
  font-size: 12px;
  color: #909399;
  background: #f8f9fa;
  padding: 4px 8px;
  border-radius: 4px;
}

/* 评价分数 */
.evaluation-scores {
  margin-bottom: 20px;
}

.scores-title {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 16px;
  font-size: 14px;
  padding-left: 4px;
  border-left: 3px solid #409EFF;
}

.scores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.score-item {
  padding: 16px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 8px;
  border: 1px solid #e8eaec;
  transition: all 0.3s ease;
  position: relative;
}

.score-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #409EFF;
}

.score-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #409EFF, #67C23A);
  border-radius: 0 0 8px 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.score-item:hover::after {
  opacity: 1;
}

.score-label {
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 14px;
}

.score-value {
  display: flex;
  align-items: baseline;
  margin-bottom: 8px;
}

.score-number {
  font-size: 20px;
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
</style> 