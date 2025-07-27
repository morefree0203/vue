<template>
  <div class="evaluation-detail">
    <!-- 课程基本信息 -->
    <el-descriptions title="课程信息" :column="3" border>
      <el-descriptions-item label="课程名称">{{ evaluationData.courseName }}</el-descriptions-item>
      <el-descriptions-item label="授课教师">{{ evaluationData.teacherName }}</el-descriptions-item>
      <el-descriptions-item label="课程类型">{{ evaluationData.courseType }}</el-descriptions-item>
      <el-descriptions-item label="学分">{{ evaluationData.credits }}</el-descriptions-item>
      <el-descriptions-item label="学年">{{ evaluationData.academicYear }}</el-descriptions-item>
      <el-descriptions-item label="学期">{{ evaluationData.semester }}</el-descriptions-item>
    </el-descriptions>

    <!-- 评价统计 -->
    <el-row class="stats-card" :gutter="16">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-item">
            <div class="stat-number">{{ evaluationData.studentCount || 0 }}</div>
            <div class="stat-label">学生评价</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-item">
            <div class="stat-number">{{ evaluationData.peerCount || 0 }}</div>
            <div class="stat-label">同行评价</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-item">
            <div class="stat-number">{{ evaluationData.supervisorCount || 0 }}</div>
            <div class="stat-label">督导评价</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-item">
            <div class="stat-number">{{ evaluationData.leaderCount || 0 }}</div>
            <div class="stat-label">领导评价</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 评价详情标签页 -->
    <el-tabs v-model="activeTab" class="evaluation-tabs">
      <el-tab-pane label="学生评价" name="student">
        <evaluation-list :evaluations="studentEvaluations" type="student" />
      </el-tab-pane>
      <el-tab-pane label="同行评价" name="peer">
        <evaluation-list :evaluations="peerEvaluations" type="peer" />
      </el-tab-pane>
      <el-tab-pane label="督导评价" name="supervisor">
        <evaluation-list :evaluations="supervisorEvaluations" type="supervisor" />
      </el-tab-pane>
      <el-tab-pane label="领导评价" name="leader">
        <evaluation-list :evaluations="leaderEvaluations" type="leader" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import EvaluationList from './EvaluationList.vue'

const props = defineProps({
  evaluationData: {
    type: Object,
    default: () => ({})
  }
})

const activeTab = ref('student')

// 按类型过滤评价数据
const studentEvaluations = computed(() => 
  props.evaluationData.evaluations?.filter(e => e.type === 'student') || []
)

const peerEvaluations = computed(() => 
  props.evaluationData.evaluations?.filter(e => e.type === 'peer') || []
)

const supervisorEvaluations = computed(() => 
  props.evaluationData.evaluations?.filter(e => e.type === 'supervisor') || []
)

const leaderEvaluations = computed(() => 
  props.evaluationData.evaluations?.filter(e => e.type === 'leader') || []
)
</script>

<style scoped>
.evaluation-detail {
  padding: 20px;
}

.stats-card {
  margin: 20px 0;
}

.stat-item {
  text-align: center;
  padding: 10px;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

.evaluation-tabs {
  margin-top: 20px;
}
</style> 