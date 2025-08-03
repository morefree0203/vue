<template>
  <div class="evaluation-detail">
    <!-- 课程基本信息 -->
    <el-descriptions title="课程信息" column="3" border>
      <el-descriptions-item label="课程名称">{{ evaluationData.summary?.courseName }}</el-descriptions-item>
      <el-descriptions-item label="授课教师">{{ evaluationData.summary?.teacherName }}</el-descriptions-item>
      <el-descriptions-item label="课程类型">{{ evaluationData.summary?.courseType }}</el-descriptions-item>
      <el-descriptions-item label="学分">{{ evaluationData.summary?.credits }}</el-descriptions-item>
      <el-descriptions-item label="学年">{{ evaluationData.summary?.academicYear }}</el-descriptions-item>
      <el-descriptions-item label="学期">{{ evaluationData.summary?.semester }}</el-descriptions-item>
    </el-descriptions>

    <!-- 评价统计 -->
    <el-row class="stats-card" :gutter="16">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-item">
            <div class="stat-number">{{ evaluationData.summary?.studentCount || 0 }}</div>
            <div class="stat-label">学生评价</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-item">
            <div class="stat-number">{{ evaluationData.summary?.peerCount || 0 }}</div>
            <div class="stat-label">同行评价</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-item">
            <div class="stat-number">{{ evaluationData.summary?.supervisorCount || 0 }}</div>
            <div class="stat-label">督导评价</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">  
          <div class="stat-item">
            <div class="stat-number">{{ evaluationData.summary?.leaderCount || 0 }}</div>
            <div class="stat-label">领导评价</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 各角色平均分统计 -->
    <el-card class="avg-scores-card" v-if="hasAvgScores">
      <template #header>
        <div class="card-header">
          各角色评价平均分
        </div>
      </template>
      
      <!-- 角色选择按钮 -->
      <div class="role-buttons">
        <el-button 
          v-if="studentAvgScores.length > 0"
          :type="activeAvgRole === 'student' ? 'primary' : 'default'"
          @click="activeAvgRole = 'student'"
        >
          学生评价
        </el-button>
        <el-button 
          v-if="peerAvgScores.length > 0"
          :type="activeAvgRole === 'peer' ? 'primary' : 'default'"
          @click="activeAvgRole = 'peer'"
        >
          同行评价
        </el-button>
        <el-button 
          v-if="supervisorAvgScores.length > 0"
          :type="activeAvgRole === 'supervisor' ? 'primary' : 'default'"
          @click="activeAvgRole = 'supervisor'"
        >
          督导评价
        </el-button>
        <el-button 
          v-if="leaderAvgScores.length > 0"
          :type="activeAvgRole === 'leader' ? 'primary' : 'default'"
          @click="activeAvgRole = 'leader'"
        >
          领导评价
        </el-button>
       
      </div>

      <!-- 平均分显示区域 -->
      <div v-if="currentAvgScores.length > 0" class="avg-scores-display">
        <el-row :gutter="16">
          <el-col :span="8" v-for="score in currentAvgScores" :key="score.indicatorName">
            <div class="indicator-score">
              <div class="indicator-name">{{ score.indicatorName }}</div>
              <div class="score-display">
                <span class="score-value">{{ score.avgScore.toFixed(1) }}</span>
                <span class="score-max">/ {{ score.maxScore }}</span>
              </div>
              <el-progress 
                :percentage="(score.avgScore / score.maxScore) * 100" 
                :color="getScoreColor(score.avgScore / score.maxScore)"
                :show-text="false"
              />
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>

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
    default: () => ({ })
  }
})

const activeTab = ref('')
const activeAvgRole = ref('') // 初始为空，由watch自动设置

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

// 按角色分别计算平均分
const supervisorAvgScores = computed(() => {
  const avgScores = props.evaluationData.avgScores?.supervisor || {}
  return Object.keys(avgScores).map(indicatorName => ({
    indicatorName,
    avgScore: avgScores[indicatorName],
    maxScore: props.evaluationData.maxScores.Supervisor[indicatorName]
  }))
})

const peerAvgScores = computed(() => {
  const avgScores = props.evaluationData.avgScores?.peer || {}
  return Object.keys(avgScores).map(indicatorName => ({
    indicatorName,
    avgScore: avgScores[indicatorName],
    maxScore: props.evaluationData.maxScores.Peer[indicatorName]
  }))
})

const leaderAvgScores = computed(() => {
  const avgScores = props.evaluationData.avgScores?.leader || {}
  return Object.keys(avgScores).map(indicatorName => ({
    indicatorName,
    avgScore: avgScores[indicatorName],
    maxScore: props.evaluationData.maxScores.Leader[indicatorName]
  }))
})

const studentAvgScores = computed(() => {
  const avgScores = props.evaluationData.avgScores?.student || {}
  return Object.keys(avgScores).map(indicatorName => ({
    indicatorName,
    avgScore: avgScores[indicatorName],
    maxScore: props.evaluationData.maxScores.Student[indicatorName]
  }))
})

// 当前显示的平均分数据
const currentAvgScores = computed(() => {
  switch (activeAvgRole.value) {
    case 'supervisor':
      return supervisorAvgScores.value
    case 'peer':
      return peerAvgScores.value
    case 'leader':
      return leaderAvgScores.value
    case 'student':
      return studentAvgScores.value
    default:
      return []
  }
})

// 判断是否有平均分数据
const hasAvgScores = computed(() => {
  return supervisorAvgScores.value.length > 0 || 
         peerAvgScores.value.length > 0 || 
         leaderAvgScores.value.length > 0 || 
         studentAvgScores.value.length > 0
})

// 根据分数比例获取颜色
const getScoreColor = (ratio) => {
  if (ratio >= 0.8) return '#67C23A' // 绿色 - 优秀
  if (ratio >= 0.6) return '#E6A23C' // 橙色 - 良好
  if (ratio >= 0.4) return '#F56C6C' // 红色 - 一般
  return '#F56C6C' // 红色 - 较差
}

// 自动切换到有数据的第一个标签页
import { watch } from 'vue'
watch([studentEvaluations, peerEvaluations, supervisorEvaluations, leaderEvaluations], () => {
  if (studentEvaluations.value.length > 0) {
    activeTab.value = 'student'
  } else if (peerEvaluations.value.length > 0) {
    activeTab.value = 'peer'
  } else if (supervisorEvaluations.value.length > 0) {
    activeTab.value = 'supervisor'
  } else if (leaderEvaluations.value.length > 0) {
    activeTab.value = 'leader'
  }
}, { immediate: true })

// 自动设置第一个有数据的平均分角色
watch([supervisorAvgScores, peerAvgScores, leaderAvgScores, studentAvgScores], () => {
  if (studentAvgScores.value.length > 0) {
    activeAvgRole.value = 'student'
  } else if (peerAvgScores.value.length > 0) {
    activeAvgRole.value = 'peer'
  } else if (supervisorAvgScores.value.length > 0) {
    activeAvgRole.value = 'supervisor'
  } else if (leaderAvgScores.value.length > 0) {
    activeAvgRole.value = 'leader'
  }
}, { immediate: true })

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

.avg-scores-card {
  margin: 20px 0;
  border: 1px solid #e4e7ed;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.card-header {
  font-weight: bold;
  color: #303133;
}

.indicator-score {
  margin-bottom: 16px;
  padding: 12px;
  border-radius: 6px;
  background: #f8f9fa;
}

.indicator-name {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 14px;
}

.score-display {
  display: flex;
  align-items: baseline;
  margin-bottom: 8px;
}

.score-value {
  font-size: 20px;
  font-weight: bold;
  color: #409EFF;
  text-shadow: 0 1px 2px rgba(64, 158, 255, 0.1);
}

.score-max {
  font-size: 14px;
  color: #909399;
  margin-left: 4px;
}

.evaluation-tabs {
  margin-top: 20px;
}
.role-buttons .el-button {
  border-radius: 20px;
  padding: 8px 20px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.role-buttons .el-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.role-buttons {
  margin-bottom: 16px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.avg-scores-display {
  margin-top: 16px;
}
</style> 