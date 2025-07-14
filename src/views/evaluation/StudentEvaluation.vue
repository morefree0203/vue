<template>
  <div class="student-evaluation">
    <el-table :data="courseList" style="width: 100%">
      <el-table-column prop="id" label="课程ID" width="100" />
      <el-table-column prop="name" label="课程名称" />
      <el-table-column prop="teacherName" label="授课教师" />
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <el-button size="small" @click="openEvalDialog(scope.row)">评价</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 评价对话框 -->
    <el-dialog title="课程评价" v-model="dialogVisible">
      <el-form :model="evalForm" label-width="100px">
        <el-form-item label="课程名称">
          <el-input v-model="evalForm.courseName" disabled />
        </el-form-item>
        <el-form-item label="授课教师">
          <el-input v-model="evalForm.teacherName" disabled />
        </el-form-item>
        <el-form-item label="教学态度">
          <el-rate v-model="evalForm.attitude" :max="5" />
        </el-form-item>
        <el-form-item label="教学方法">
          <el-rate v-model="evalForm.method" :max="5" />
        </el-form-item>
        <el-form-item label="教学效果">
          <el-rate v-model="evalForm.effect" :max="5" />
        </el-form-item>
        <el-form-item label="开放式评价">
          <el-input v-model="evalForm.comment" type="textarea" placeholder="请输入您的建议或意见（可匿名）" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEvaluation">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const courseList = ref([])
const dialogVisible = ref(false)
const evalForm = reactive({
  courseId: null,
  courseName: '',
  teacherName: '',
  attitude: 0,
  method: 0,
  effect: 0,
  comment: ''
})

function fetchCourses() {
  axios.get('http://localhost:8080/api/evaluation/student/courses', {
    params: { studentId: userStore.userId }
  })
    .then(res => {
      courseList.value = res.data.data
    })
    .catch(() => {
      ElMessage.error('获取可评价课程失败')
    })
}

onMounted(fetchCourses)

function openEvalDialog(row) {
  Object.assign(evalForm, {
    courseId: row.id,
    courseName: row.name,
    teacherName: row.teacherName,
    attitude: 0,
    method: 0,
    effect: 0,
    comment: ''
  })
  dialogVisible.value = true
}

function submitEvaluation() {
  if (!evalForm.attitude || !evalForm.method || !evalForm.effect) {
    ElMessage.warning('请完成所有打分项')
    return
  }
  axios.post('http://localhost:8080/api/evaluation/student/submit', {
    studentId: userStore.userId,
    courseId: evalForm.courseId,
    attitude: evalForm.attitude,
    method: evalForm.method,
    effect: evalForm.effect,
    comment: evalForm.comment
  })
    .then(() => {
      ElMessage.success('评价提交成功')
      dialogVisible.value = false
      fetchCourses()
    })
    .catch(() => {
      ElMessage.error('提交失败')
    })
}
</script>

<style scoped>
.student-evaluation {
  padding: 24px;
  background: #fff;
  min-height: 100vh;
}
</style> 