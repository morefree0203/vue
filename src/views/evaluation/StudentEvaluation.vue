<template>
  <div class="student-evaluation">
    <el-card class="evaluation-card">
      <template #header>
        <div class="card-header">
          <span>学生评价</span>
          <el-tag type="info">{{ courseInfo.courseName }}</el-tag>
        </div>
      </template>
      <el-form
        ref="formRef"
        :model="evaluationForm"
        :rules="rules"
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

        <!-- 动态评价指标 -->
        <el-divider content-position="left">评价指标</el-divider>
        <el-form-item
          v-for="indicator in indicatorList"
          :key="indicator.id"
          :label="indicator.name"
          :prop="'scores.' + indicator.id"
        >
          <el-rate
            v-model="evaluationForm.scores[indicator.id]"
            :max="indicator.maxScore"
            show-score
          />
        </el-form-item>

        <!-- 开放式匿名评价 -->
        <el-form-item label="开放式评价" prop="openComment">
          <el-input
            v-model="evaluationForm.openComment"
            type="textarea"
            :rows="4"
            placeholder="请提出您的问题、意见或建议"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>

        <!-- 提交按钮 -->
        <el-form-item>
          <el-button type="primary" @click="submitEvaluation" :loading="submitting">
            提交评价
          </el-button>
          <el-button @click="resetForm">重置表单</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const formRef = ref()
const submitting = ref(false)

// 课程信息（实际应由父组件或API传入）
const courseInfo = ref({
  courseName: '高等数学',
  teacherName: '张老师',
  courseId: '123'
})

// 动态评价指标（实际应从后端API获取）
const indicatorList = ref([])

// 评价表单
const evaluationForm = reactive({
  scores: {},         // { [indicatorId]: 分数 }
  openComment: '',    // 开放式评价
  isAnonymous: true // 默认匿名
})

// 表单验证规则
const rules = {
  openComment: [
    { required: false, message: '请填写开放式评价', trigger: 'blur' }
  ]
}

// 获取评价指标（模拟API）
const fetchIndicators = async () => {
  // 这里应调用后端API获取指标
  indicatorList.value = [
    { id: 1, name: '教学态度', maxScore: 10 },
    { id: 2, name: '教学方法', maxScore: 10 },
    { id: 3, name: '教学效果', maxScore: 10 },
    { id: 4, name: '普通话水平', maxScore: 10 },
    { id: 5, name: '作业评阅', maxScore: 10 },
    { id: 6, name: '师生交流', maxScore: 10 },
    { id: 7, name: '准时上下课', maxScore: 10 },
  ]
  // 初始化分数
  indicatorList.value.forEach(ind => {
    evaluationForm.scores[ind.id] = 0
  })
}

const submitEvaluation = async () => {
  // 校验所有指标都已评分
  for (const ind of indicatorList.value) {
    if (!evaluationForm.scores[ind.id]) {
      ElMessage.warning(`请对【${ind.name}】评分`)
      return
    }
  }
  submitting.value = true
  // 这里调用API提交评价
  // await submitStudentEvaluation({ ...evaluationForm, courseId: courseInfo.value.courseId })
  ElMessage.success('评价提交成功！')
  resetForm()
  submitting.value = false
}

const resetForm = () => {
  indicatorList.value.forEach(ind => {
    evaluationForm.scores[ind.id] = 0
  })
  evaluationForm.openComment = ''
  evaluationForm.isAnonymous = true
}

onMounted(() => {
  fetchIndicators()
})
</script>

<style scoped>

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

/* 深度选择器，确保样式穿透 element-plus 组件 */
.evaluation-form :deep(.el-form-item) {
  font-size: 22px;
  margin-bottom: 36px;
  align-items: center;
  width: 100%;
  display: flex;
  flex-direction: row;
}
.evaluation-form :deep(.el-form-item__label) {
  font-size: 24px;
  min-width: 220px;
  text-align: right;
  padding-right: 32px;
  flex: 0 0 220px;
}
.evaluation-form :deep(.el-form-item__content) {
  flex: 1 1 auto;
  display: flex;
  align-items: center;
}
.evaluation-form :deep(.el-rate__icon) {
  font-size: 32px;
}
.evaluation-form :deep(.el-rate) {
  margin-left: 16px;
}
.evaluation-form :deep(.el-textarea__inner) {
  font-size: 22px;
}
.card-header :deep(.el-tag) {
  font-size: 22px;
  height: 40px;
  line-height: 38px;
  padding: 0 20px;
  border-radius: 8px;
  font-weight: bold;
  background: #e6f0fa;
  color: #2d6196;
  border: none;
}
.evaluation-form :deep(.el-input__inner) {
  font-size: 22px !important;
  height: 40px;
  line-height: 40px;
}

/* 表单最后一个表单项（通常是按钮组），设置为左对齐，并与上方内容有间距 */
.evaluation-form :deep(.el-form-item:last-child .el-form-item__content) {
  display: flex !important;
  justify-content: center !important;
  align-items: center;
  gap: 60px; /* 按钮之间的间距 */
  width: 100%;
}

/* 所有表单内的按钮样式统一设置 */
.evaluation-form :deep(.el-button) {
  font-size: 20px;               /* 按钮文字大小 */
  height: 44px;                  /* 按钮高度，和输入框等控件保持一致 */
  min-width: 140px;              /* 按钮最小宽度，保证按钮不太窄 */
  border-radius: 8px;            /* 按钮圆角，风格更现代 */
  /* 不要再加 margin-right，否则会偏左 */
}
</style>