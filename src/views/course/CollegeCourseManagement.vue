<template>
  <div class="college-course-management">
    <el-button type="primary" @click="openAddDialog" style="margin-bottom: 16px;">新增课程</el-button>
    <el-table :data="courseList" style="width: 100%">
      <el-table-column prop="id" label="课程ID" width="100" />
      <el-table-column prop="name" label="课程名称" />
      <el-table-column prop="teacherName" label="授课教师" />
      <el-table-column prop="credit" label="学分" width="80" />
      <el-table-column prop="semester" label="学期" width="100" />
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button size="small" @click="editCourse(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteCourse(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增/编辑对话框 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="课程名称">
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item label="授课教师">
          <el-input v-model="editForm.teacherName" />
        </el-form-item>
        <el-form-item label="学分">
          <el-input-number v-model="editForm.credit" :min="0" />
        </el-form-item>
        <el-form-item label="学期">
          <el-input v-model="editForm.semester" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitCourse">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'

const courseList = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增课程')
const editForm = reactive({
  id: null,
  name: '',
  teacherName: '',
  credit: 0,
  semester: ''
})

function fetchCourses() {
  axios.get('http://localhost:8080/api/course/college-list')
    .then(res => {
      courseList.value = res.data.data.records
    })
    .catch(() => {
      ElMessage.error('获取课程列表失败')
    })
}

onMounted(fetchCourses)

function openAddDialog() {
  dialogTitle.value = '新增课程'
  Object.assign(editForm, { id: null, name: '', teacherName: '', credit: 0, semester: '' })
  dialogVisible.value = true
}

function editCourse(row) {
  dialogTitle.value = '编辑课程'
  Object.assign(editForm, row)
  dialogVisible.value = true
}

function submitCourse() {
  if (!editForm.name || !editForm.teacherName) {
    ElMessage.warning('请填写完整信息')
    return
  }
  if (editForm.id) {
    axios.put('http://localhost:8080/api/course/college-update', editForm)
      .then(() => {
        ElMessage.success('编辑成功')
        dialogVisible.value = false
        fetchCourses()
      })
      .catch(() => {
        ElMessage.error('编辑失败')
      })
  } else {
    axios.post('http://localhost:8080/api/course/college-add', editForm)
      .then(() => {
        ElMessage.success('新增成功')
        dialogVisible.value = false
        fetchCourses()
      })
      .catch(() => {
        ElMessage.error('新增失败')
      })
  }
}

function deleteCourse(id) {
  ElMessageBox.confirm('确定要删除该课程吗？', '提示', { type: 'warning' })
    .then(() => {
      axios.delete(`http://localhost:8080/api/course/college-delete/${id}`)
        .then(() => {
          ElMessage.success('删除成功')
          fetchCourses()
        })
        .catch(() => {
          ElMessage.error('删除失败')
        })
    })
    .catch(() => {})
}
</script>

<style scoped>
.college-course-management {
  padding: 24px;
  background: #fff;
  min-height: 100vh;
}
</style> 