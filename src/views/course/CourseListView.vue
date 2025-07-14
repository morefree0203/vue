<template>
  <div class="course-list">
    <!-- 查询表单 -->
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="课程名称">
        <el-input v-model="searchForm.courseName" placeholder="请输入课程名称" />
      </el-form-item>
      <el-form-item label="授课教师">
        <el-input v-model="searchForm.teacherName" placeholder="请输入教师姓名" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchCourses">查询</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 新增课程按钮（管理员可见） -->
    <el-button
      v-if="isAdmin"
      type="primary"
      icon="el-icon-plus"
      @click="openAddDialog"
      style="margin-bottom: 16px;"
    >新增课程</el-button>

    <!-- 课程表格 -->
    <el-table :data="courseList" style="width: 100%">
      <el-table-column prop="id" label="课程ID" width="100" />
      <el-table-column prop="name" label="课程名称" />
      <el-table-column prop="teacherName" label="授课教师" />
      <el-table-column prop="credit" label="学分" width="80" />
      <el-table-column prop="semester" label="学期" width="100" />
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button size="small" @click="viewDetail(scope.row)">详情</el-button>
          <el-button
            v-if="isAdmin"
            size="small"
            type="primary"
            @click="editCourse(scope.row)"
          >编辑</el-button>
          <el-button
            v-if="isAdmin"
            size="small"
            type="danger"
            @click="deleteCourse(scope.row.id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="pagination.page"
      :page-size="pagination.size"
      :total="pagination.total"
      @current-change="fetchCourses"
      layout="total, prev, pager, next"
      style="margin-top: 16px;"
    />

    <!-- 新增/编辑课程对话框 -->
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
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const isAdmin = computed(() =>
  ['school_admin', 'college_admin', 'department_admin'].includes(userStore.userRole)
)

// 查询表单
const searchForm = reactive({
  courseName: '',
  teacherName: ''
})

// 课程列表数据
const courseList = ref([])

// 分页信息
const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

// 对话框相关
const dialogVisible = ref(false)
const dialogTitle = ref('新增课程')
const editForm = reactive({
  id: null,
  name: '',
  teacherName: '',
  credit: 0,
  semester: ''
})

// 页面加载时获取课程列表
onMounted(() => {
  fetchCourses()
})

/**
 * 获取课程列表
 * 向后端发送GET请求，获取课程数据
 * 接口示例：GET http://localhost:8080/api/course/list?page=1&size=10&courseName=xxx&teacherName=xxx
 */
function fetchCourses() {
  axios
    .get('http://localhost:8080/api/course/list', {
      params: {
        page: pagination.page,
        size: pagination.size,
        courseName: searchForm.courseName,
        teacherName: searchForm.teacherName
      }
    })
    .then(res => {
      // 假设后端返回 { data: { records: [...], total: 100 } }
      courseList.value = res.data.data.records
      pagination.total = res.data.data.total
    })
    .catch(() => {
      ElMessage.error('获取课程列表失败')
    })
}

/**
 * 重置查询表单
 */
function resetSearch() {
  searchForm.courseName = ''
  searchForm.teacherName = ''
  fetchCourses()
}

/**
 * 打开新增课程对话框
 */
function openAddDialog() {
  dialogTitle.value = '新增课程'
  Object.assign(editForm, { id: null, name: '', teacherName: '', credit: 0, semester: '' })
  dialogVisible.value = true
}

/**
 * 打开编辑课程对话框
 * @param {Object} row 课程数据
 */
function editCourse(row) {
  dialogTitle.value = '编辑课程'
  Object.assign(editForm, row)
  dialogVisible.value = true
}

/**
 * 提交新增/编辑课程
 * 根据editForm.id判断是新增还是编辑
 * 新增：POST /api/course/add
 * 编辑：PUT /api/course/update
 */
function submitCourse() {
  if (!editForm.name || !editForm.teacherName) {
    ElMessage.warning('请填写完整信息')
    return
  }
  if (editForm.id) {
    // 编辑
    axios
      .put('http://localhost:8080/api/course/update', editForm)
      .then(() => {
        ElMessage.success('编辑成功')
        dialogVisible.value = false
        fetchCourses()
      })
      .catch(() => {
        ElMessage.error('编辑失败')
      })
  } else {
    // 新增
    axios
      .post('http://localhost:8080/api/course/add', editForm)
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

/**
 * 删除课程
 * @param {number} id 课程ID
 */
function deleteCourse(id) {
  ElMessageBox.confirm('确定要删除该课程吗？', '提示', { type: 'warning' })
    .then(() => {
      axios
        .delete(`http://localhost:8080/api/course/delete/${id}`)
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

/**
 * 查看课程详情
 * @param {Object} row 课程数据
 * 这里可以跳转到课程详情页，或弹窗展示详情
 */
function viewDetail(row) {
  // 例如：this.$router.push(`/course/detail/${row.id}`)
  ElMessage.info(`查看课程：${row.name}`)
}
</script>

<style scoped>
.course-list {
  padding: 24px;
  background: #fff;
  min-height: 100vh;
}
.search-form {
  margin-bottom: 16px;
}
</style> 