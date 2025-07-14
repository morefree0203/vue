<template>
  <div class="peer-evaluation">
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
    <el-dialog title="同行评价" v-model="dialogVisible">
      <el-form :model="evalForm" label-width="100px">
        <el-form-item label="课程名称">
          <el-input v-model="evalForm.courseName" disabled />
        </el-form-item>
        <el-form-item label="授课教师">
          <el-input v-model="evalForm.teacherName" disabled />
        </el-form-item>
        <el-form-item label="教学创新">
          <el-rate v-model="evalForm.innovation" :max="5" />
        </el-form-item>
        <el-form-item label="课堂互动">
          <el-rate v-model="evalForm.interaction" :max="5" />
        </el-form-item>
        <el-form-item label="资源利用">
          <el-rate v-model="evalForm.resource" :max="5" />
        </el-form-item>
        <el-form-item label="教学特色">
          <el-rate v-model="evalForm.feature" :max="5" />
        </el-form-item>
        <el-form-item label="同行评语">
          <el-input v-model="evalForm.comment" type="textarea" placeholder="请输入同行评语" />
        </el-form-item>
        <el-form-item label="上传照片">
          <el-upload
            action="http://localhost:8080/api/evaluation/peer/upload"
            :on-success="handleUploadSuccess"
            :file-list="evalForm.images"
            list-type="picture-card"
            :limit="3"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
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
  innovation: 0,
  interaction: 0,
  resource: 0,
  feature: 0,
  comment: '',
  images: []
})

function fetchCourses() {
  axios.get('http://localhost:8080/api/evaluation/peer/courses', {
    params: { teacherId: userStore.userId }
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
    innovation: 0,
    interaction: 0,
    resource: 0,
    feature: 0,
    comment: '',
    images: []
  })
  dialogVisible.value = true
}

function handleUploadSuccess(response, file, fileList) {
  evalForm.images = fileList
}

function submitEvaluation() {
  if (!evalForm.innovation || !evalForm.interaction || !evalForm.resource || !evalForm.feature) {
    ElMessage.warning('请完成所有打分项')
    return
  }
  axios.post('http://localhost:8080/api/evaluation/peer/submit', {
    teacherId: userStore.userId,
    courseId: evalForm.courseId,
    innovation: evalForm.innovation,
    interaction: evalForm.interaction,
    resource: evalForm.resource,
    feature: evalForm.feature,
    comment: evalForm.comment,
    images: evalForm.images.map(f => f.response?.url || f.url)
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
.peer-evaluation {
  padding: 24px;
  background: #fff;
  min-height: 100vh;
}
</style> 