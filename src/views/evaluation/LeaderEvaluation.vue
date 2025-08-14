<!-- 领导评价页面 -->
<template>
  <div class="leader-evaluation">
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
    <el-dialog title="领导评价" v-model="dialogVisible">
      <el-form :model="evalForm" label-width="100px">
        <el-form-item label="课程名称">
          <el-input v-model="evalForm.courseName" disabled />
        </el-form-item>
        <el-form-item label="授课教师">
          <el-input v-model="evalForm.teacherName" disabled />
        </el-form-item>
        <el-form-item label="教学组织">
          <el-rate v-model="evalForm.organization" :max="5" />
        </el-form-item>
        <el-form-item label="课堂管理">
          <el-rate v-model="evalForm.management" :max="5" />
        </el-form-item>
        <el-form-item label="教学内容">
          <el-rate v-model="evalForm.content" :max="5" />
        </el-form-item>
        <el-form-item label="教学技能">
          <el-rate v-model="evalForm.skill" :max="5" />
        </el-form-item>
        <el-form-item label="综合评价">
          <el-input v-model="evalForm.comment" type="textarea" placeholder="请输入综合评价及建议" />
        </el-form-item>
        <el-form-item label="上传照片">
          <el-upload
            action="http://localhost:8080/api/evaluation/leader/upload"
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
  organization: 0,
  management: 0,
  content: 0,
  skill: 0,
  comment: '',
  images: []
})

function fetchCourses() {
  axios.get('http://localhost:8080/api/evaluation/leader/courses', {
    params: { leaderId: userStore.userId }
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
    organization: 0,
    management: 0,
    content: 0,
    skill: 0,
    comment: '',
    images: []
  })
  dialogVisible.value = true
}

function handleUploadSuccess(response, file, fileList) {
  evalForm.images = fileList
}

function submitEvaluation() {
  if (!evalForm.organization || !evalForm.management || !evalForm.content || !evalForm.skill) {
    ElMessage.warning('请完成所有打分项')
    return
  }
  axios.post('http://localhost:8080/api/evaluation/leader/submit', {
    leaderId: userStore.userId,
    courseId: evalForm.courseId,
    organization: evalForm.organization,
    management: evalForm.management,
    content: evalForm.content,
    skill: evalForm.skill,
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
.leader-evaluation {
  padding: 24px;
  background: #fff;
  min-height: 100vh;
}
</style> 