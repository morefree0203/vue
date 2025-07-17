<template>
    <div class="student-evaluation">
      <el-card class="evaluation-card">
        <template #header>
          <div class="card-header">
            <span>评价详情</span>
            <el-tag type="info">{{ courseInfo.courseName }}</el-tag>
          </div>
        </template>
        <el-form
          label-width="120px"
          class="evaluation-form"
        >
          <!-- 基本信息 -->
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="课程名称">
                <el-input v-model="courseInfo.courseName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="授课教师">
                <el-input v-model="courseInfo.teacherName" disabled />
              </el-form-item>
            </el-col>
          </el-row>
  
          <!-- 评分项 -->
          <el-divider content-position="left">评分详情</el-divider>
          <el-form-item
            v-for="item in scoreList"
            :key="item.indicatorId"
            :label="item.indicatorName"
          >
            <el-rate
              v-model="item.score"
              :max="item.maxScore || 10"
              disabled
              show-score
            />
          </el-form-item>
  
          <!-- 开放式评价 -->
          <el-form-item label="我的评价">
            <el-input
              v-model="openComment"
              type="textarea"
              :rows="4"
              disabled
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
  
          <!-- 教师反馈 -->
          <el-divider content-position="left">教师反馈</el-divider>
          <el-form-item>
            <el-input
              v-model="teacherReply"
              type="textarea"
              :rows="3"
              disabled
              placeholder="暂无教师反馈"
            />
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { getStudentEvaluationDetail } from '@/api/student' // 你需要实现这个API
  
  const route = useRoute()
  const assignmentId = route.params.assignmentId
  
  const courseInfo = ref({
    courseName: '',
    teacherName: ''
  })
  const scoreList = ref([]) // [{ indicatorId, indicatorName, score, maxScore }]
  const openComment = ref('')
  const teacherReply = ref('')
  
  const fetchDetail = async () => {
    const res = await getStudentEvaluationDetail(assignmentId)
    courseInfo.value = res.data.courseInfo || {}
    scoreList.value = res.data.scores || []
    openComment.value = res.data.openComment || ''
    teacherReply.value = res.data.teacherReply || ''
  }
  
  onMounted(() => {
    fetchDetail()
  })
  </script>
  
  <style scoped>
  /* 可复用你原有的样式 */
  .student-evaluation {
    width: 100%;
    min-height: 100%;
    box-sizing: border-box;
    padding: 0px 16px;
    background: #f5f6fa;
    overflow: auto;
  }
  .evaluation-card {
    width: 80%;
    max-width: 1800px;
    margin: 0 auto;
    background: #fafbfc;
    border-radius: 12px;
    padding: 48px 56px;
    font-size: 22px;
    box-sizing: border-box;
    box-shadow: none;
    border: none;
  }
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 24px;
    border-bottom: 1px solid #f0f0f0;
    font-size: 36px;
    font-weight: bold;
  }
  .evaluation-form {
    width: 100%;
    margin: 0 auto;
    padding: 0;
    display: flex;
    flex-direction: column;
    font-size: 22px;
  }
  </style>