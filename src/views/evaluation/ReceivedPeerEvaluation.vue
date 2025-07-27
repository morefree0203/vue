<template>
  <div class="received-evaluation-page">
    <div class="page-title">收到的同行评价</div>
    <el-table
      :data="courseList"
      border
      stripe
      size="large"
      style="width: 100%"
    >
      <el-table-column type="index" label="序号" width="80" align="center" />
      <el-table-column prop="courseName" label="课程名称" min-width="120" align="center" />
      <el-table-column prop="academicYear" label="学年" width="110" align="center" />
      <el-table-column prop="semester" label="学期" width="80" align="center" />
      <el-table-column prop="evaluationCount" label="收到的评价" width="120" align="center"
        :formatter="row => `${row.evaluationCount} 条评价`" />
      <el-table-column label="操作" width="120" align="center">
        <template #default="scope">
          <el-button size="small" type="primary" @click="openDetailDialog(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 评价详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="同行评价详情" width="700px">
      <div v-if="evaluationList.length === 0" style="text-align:center;color:#999;">暂无评价</div>
      
      <el-card
        v-for="(evalItem, idx) in evaluationList"
        :key="evalItem.id"
        class="peer-eval-card"
      >
    <div class="eval-header">
    <span>
      <b>评价人：</b>
      <span>{{ evalItem.evaluatorName }}</span>
    </span>
    <span class="eval-time">{{ evalItem.createTime }}</span>
  </div>
  <div class="score-list">
    <div
      v-for="score in evalItem.scores"
      :key="score.indicatorName"
      class="score-item"
    >
    <!-- :model-value="score.score" 单向数据绑定 -->
      <span class="score-label">{{ score.indicatorName }}：</span>
      <el-rate
        :model-value="score.score"
        disabled
        show-score
        :max="score.maxScore"
        class="score-rate"
      />
    </div>
  </div>
  <div class="eval-comment">
    <b>评语：</b>
    <span>{{ evalItem.comment }}</span>
  </div>
  <div v-if="evalItem.images && evalItem.images.length > 0" class="eval-images">
    <b>评价图片：</b>
    <div class="image-list">
      <!-- :preview-src-list="evalItem.images"  点击可预览所有图片。 -->
      <!-- 图片裁剪方式，保持比例填满容器。 -->
      <el-image
        v-for="(img, i) in evalItem.images"
        :key="i"
        :src="img"
        class="eval-image"
        :preview-src-list="evalItem.images"
        :initial-index="i"
        fit="cover"
      />
    </div>
  </div>
</el-card>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getMyEvaluatedCourses, getEvaluationsForMyCourse } from '@/api/teacher'
import { ElMessage } from 'element-plus'

const courseList = ref([])
const evaluationList = ref([])
const detailDialogVisible = ref(false)
const currentCourse = ref(null)

const fetchCourses = async () => {
  const res = await getMyEvaluatedCourses()
  if (res.code === '200') {
    courseList.value = res.data
  } else {
    ElMessage.error(res.msg || '获取课程列表失败')
  }
}

const openDetailDialog = async (row) => {
  currentCourse.value = row
  const res = await getEvaluationsForMyCourse(row.courseId)
  if (res.code === '200') {
    evaluationList.value = res.data
  } else {
    evaluationList.value = []
    ElMessage.error(res.msg || '获取评价详情失败')
  }
  detailDialogVisible.value = true
}

onMounted(fetchCourses)
</script>

<style scoped>
.received-evaluation-page {
  padding: 24px;
  background: #fff;
  min-height: 100vh;
}
.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 20px;
}
.peer-eval-card {
  margin-bottom: 18px;
  padding: 18px 24px 16px 24px;
  border-radius: 10px;
  font-size: 16px;
  background: #fafbfc;
  box-shadow: 0 2px 8px #f0f1f2;
}

.eval-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 17px;
  font-weight: 500;
  margin-bottom: 12px;
}

.eval-time {
  color: #999;
  font-size: 14px;
}

.score-list {
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
  font-size: 15px;
  color: #333;
}

.score-rate {
  margin-left: 8px;
}

.eval-comment {
  margin-bottom: 10px;
  font-size: 15px;
}

.eval-images {
  margin-bottom: 6px;
}

.image-list {
  display: flex;
  gap: 12px;
  margin-top: 6px;
}

.eval-image {
  width: 80px;
  height: 80px;
  border-radius: 6px;
  border: 1px solid #eee;
}
</style>