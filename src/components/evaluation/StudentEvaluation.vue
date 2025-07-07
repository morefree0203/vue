<template>
  <div class="student-evaluation">
    <el-card class="evaluation-card">
      <template #header>
        <div class="card-header">
          <span>学生评价表单</span>
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
        <el-divider content-position="left">基本信息</el-divider>
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
        
        <!-- 评价指标 -->
        <el-divider content-position="left">评价指标</el-divider>
        
        <el-form-item label="教学态度" prop="teachingAttitude">
          <el-rate
            v-model="evaluationForm.teachingAttitude"
            :max="5"
            show-score
            score-template="{value}分"
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
          />
        </el-form-item>
        
        <el-form-item label="教学方法" prop="teachingMethod">
          <el-rate
            v-model="evaluationForm.teachingMethod"
            :max="5"
            show-score
            score-template="{value}分"
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
          />
        </el-form-item>
        
        <el-form-item label="教学效果" prop="teachingEffect">
          <el-rate
            v-model="evaluationForm.teachingEffect"
            :max="5"
            show-score
            score-template="{value}分"
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
          />
        </el-form-item>
        
        <el-form-item label="普通话水平" prop="mandarinLevel">
          <el-rate
            v-model="evaluationForm.mandarinLevel"
            :max="5"
            show-score
            score-template="{value}分"
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
          />
        </el-form-item>
        
        <el-form-item label="作业评阅情况" prop="homeworkReview">
          <el-rate
            v-model="evaluationForm.homeworkReview"
            :max="5"
            show-score
            score-template="{value}分"
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
          />
        </el-form-item>
        
        <el-form-item label="师生交流情况" prop="teacherStudentCommunication">
          <el-rate
            v-model="evaluationForm.teacherStudentCommunication"
            :max="5"
            show-score
            score-template="{value}分"
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
          />
        </el-form-item>
        
        <el-form-item label="准时上下课" prop="punctuality">
          <el-rate
            v-model="evaluationForm.punctuality"
            :max="5"
            show-score
            score-template="{value}分"
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
          />
        </el-form-item>
        
        <!-- 建议和意见 -->
        <el-divider content-position="left">建议和意见</el-divider>
        
        <el-form-item label="建议和意见" prop="suggestions">
          <el-input
            v-model="evaluationForm.suggestions"
            type="textarea"
            :rows="4"
            placeholder="请提出您的建议和意见..."
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        
        <!-- 匿名选项 -->
        <el-form-item>
          <el-checkbox v-model="evaluationForm.isAnonymous">
            匿名提交评价
          </el-checkbox>
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute } from 'vue-router'

const route = useRoute()
const formRef = ref()
const submitting = ref(false)

// 课程信息
const courseInfo = ref({
  courseName: '',
  teacherName: '',
  courseId: ''
})

// 评价表单
const evaluationForm = reactive({
  teachingAttitude: 0,
  teachingMethod: 0,
  teachingEffect: 0,
  mandarinLevel: 0,
  homeworkReview: 0,
  teacherStudentCommunication: 0,
  punctuality: 0,
  suggestions: '',
  isAnonymous: false
})

// 表单验证规则
const rules = {
  teachingAttitude: [
    { required: true, message: '请评价教学态度', trigger: 'change' }
  ],
  teachingMethod: [
    { required: true, message: '请评价教学方法', trigger: 'change' }
  ],
  teachingEffect: [
    { required: true, message: '请评价教学效果', trigger: 'change' }
  ],
  mandarinLevel: [
    { required: true, message: '请评价普通话水平', trigger: 'change' }
  ],
  homeworkReview: [
    { required: true, message: '请评价作业评阅情况', trigger: 'change' }
  ],
  teacherStudentCommunication: [
    { required: true, message: '请评价师生交流情况', trigger: 'change' }
  ],
  punctuality: [
    { required: true, message: '请评价准时上下课', trigger: 'change' }
  ]
}

// 获取课程信息
const getCourseInfo = async () => {
  try {
    // 这里应该调用API获取课程信息
    // const response = await getCourseById(route.params.courseId)
    // courseInfo.value = response.data
    
    // 模拟数据
    courseInfo.value = {
      courseName: '高等数学',
      teacherName: '张教授',
      courseId: route.params.courseId || '1'
    }
  } catch (error) {
    ElMessage.error('获取课程信息失败')
  }
}

// 提交评价
const submitEvaluation = async () => {
  try {
    await formRef.value.validate()
    
    submitting.value = true
    
    // 计算总分
    const totalScore = (
      evaluationForm.teachingAttitude +
      evaluationForm.teachingMethod +
      evaluationForm.teachingEffect +
      evaluationForm.mandarinLevel +
      evaluationForm.homeworkReview +
      evaluationForm.teacherStudentCommunication +
      evaluationForm.punctuality
    ) / 7
    
    const evaluationData = {
      courseId: courseInfo.value.courseId,
      totalScore: totalScore.toFixed(2),
      ...evaluationForm
    }
    
    // 这里应该调用API提交评价
    // await submitStudentEvaluation(evaluationData)
    
    // 模拟提交
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('评价提交成功！')
    
    // 重置表单
    resetForm()
    
  } catch (error) {
    if (error.message) {
      ElMessage.error(error.message)
    }
  } finally {
    submitting.value = false
  }
}

// 重置表单
const resetForm = () => {
  formRef.value?.resetFields()
  Object.assign(evaluationForm, {
    teachingAttitude: 0,
    teachingMethod: 0,
    teachingEffect: 0,
    mandarinLevel: 0,
    homeworkReview: 0,
    teacherStudentCommunication: 0,
    punctuality: 0,
    suggestions: '',
    isAnonymous: false
  })
}

onMounted(() => {
  getCourseInfo()
})
</script>

<style scoped>
.student-evaluation {
  padding: 20px;
}

.evaluation-card {
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.evaluation-form {
  margin-top: 20px;
}

.el-divider {
  margin: 24px 0 16px 0;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-rate {
  margin-top: 8px;
}
</style> 