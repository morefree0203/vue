<template>
  <div class="evaluation-list">
    <div v-if="evaluations.length === 0" class="empty-state">
      <el-empty description="暂无评价数据" />
    </div>
    
    <div v-else>
      <el-card v-for="evaluation in evaluations" :key="evaluation.id" class="evaluation-item">
        <!-- 评价头部信息 -->
        <div class="evaluation-header">
          <div class="evaluator-info">
            <span class="evaluator-name">{{ evaluation.evaluatorName || '匿名用户' }}</span>
            <el-tag v-if="evaluation.isAnonymous" size="small" type="info">匿名</el-tag>
          </div>
          <div class="evaluation-time">{{ evaluation.createTime }}</div>
        </div>
        
        <!-- 评价分数 -->
        <div v-if="evaluation.scores && evaluation.scores.length > 0" class="evaluation-scores">
          <div v-for="score in evaluation.scores" :key="score.indicatorName" class="score-item">
            <span class="score-label">{{ score.indicatorName }}：</span>
            <el-rate :model-value="score.score" disabled show-score :max="5" class="score-rate" />
          </div>
        </div>
        
        <!-- 评价评论 -->
        <div v-if="evaluation.comment" class="evaluation-comment">
          <div class="comment-label">评价内容：</div>
          <div class="comment-content">{{ evaluation.comment }}</div>
        </div>
        
        <!-- 评价图片 -->
        <div v-if="evaluation.images && evaluation.images.length > 0" class="evaluation-images">
          <div class="images-label">相关图片：</div>
          <div class="images-grid">
            <el-image
              v-for="(image, index) in evaluation.images"
              :key="index"
              :src="image"
              :preview-src-list="evaluation.images"
              :initial-index="index"
              fit="cover"
              class="evaluation-image"
            />
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
defineProps({
  evaluations: {
    type: Array,
    default: () => []
  },
  type: {
    type: String,
    default: 'student'
  }
})
</script>

<style scoped>
.evaluation-list {
  padding: 16px 0;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
}

.evaluation-item {
  margin-bottom: 16px;
  border-radius: 8px;
}

.evaluation-item:last-child {
  margin-bottom: 0;
}

.evaluation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.evaluator-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.evaluator-name {
  font-weight: 500;
  color: #303133;
}

.evaluation-time {
  font-size: 12px;
  color: #909399;
}

.evaluation-scores {
  margin-bottom: 12px;
}

.score-item {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
}

.score-label {
  min-width: 120px;
  font-weight: 500;
  font-size: 14px;
  color: #333;
}

.score-rate {
  flex: 1;
}

.evaluation-comment {
  margin-bottom: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
}

.comment-label {
  font-weight: 500;
  color: #333;
  margin-bottom: 6px;
}

.comment-content {
  color: #666;
  line-height: 1.6;
}

.evaluation-images {
  margin-top: 12px;
}

.images-label {
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 8px;
}

.evaluation-image {
  width: 100%;
  height: 80px;
  border-radius: 4px;
  cursor: pointer;
}
</style> 