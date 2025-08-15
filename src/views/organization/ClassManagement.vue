<template>
  <div class="class-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>班级管理</span>
          <el-button type="primary" @click="showAddDialog">添加班级</el-button>
        </div>
      </template>

      <div class="search-bar">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="班级名称">
            <el-input v-model="searchForm.className" placeholder="请输入班级名称" clearable />
          </el-form-item>
          <el-form-item label="班级代码">
            <el-input v-model="searchForm.classCode" placeholder="请输入班级代码" clearable />
          </el-form-item>
          <el-form-item label="年级">
            <el-input v-model="searchForm.grade" placeholder="请输入年级" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table :data="classList" style="width: 100%;" v-loading="loading">
        <el-table-column prop="classCode" label="班级代码" width="120" />
        <el-table-column prop="className" label="班级名称" width="200" />
        <el-table-column prop="departmentName" label="所属系" width="150" />
        <el-table-column prop="collegeName" label="所属学院" width="150" />
        <el-table-column prop="grade" label="年级" width="100" />
        <el-table-column prop="studentCount" label="学生数量" width="100" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <div style="display: flex; gap: 8px;">
              <el-button size="small" @click="editClass(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="deleteClassHandler(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 添加/编辑班级对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑班级' : '添加班级'" width="500px">
      <el-form :model="classForm" :rules="classRules" ref="classFormRef" label-width="100px">
        <el-form-item label="班级名称" prop="name">
          <el-input v-model="classForm.name" placeholder="请输入班级名称" />
        </el-form-item>
        <el-form-item label="班级代码" prop="code">
          <el-input v-model="classForm.code" :disabled="isEdit" placeholder="请输入班级代码" />
        </el-form-item>
        <el-form-item label="年级" prop="grade">
          <el-input v-model="classForm.grade" placeholder="请输入年级，如：2024" />
        </el-form-item>
        <el-form-item label="所属系" prop="departmentId">
          <el-select v-model="classForm.departmentId" placeholder="请选择所属系" @change="handleDepartmentChange">
            <el-option 
              v-for="department in departmentList" 
              :key="department.departmentId" 
              :label="department.departmentName" 
              :value="department.departmentId" 
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveClass">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import {
  getCollegeList,
  getAllDepartmentList,
  getAllClassList,
  addClass,
  updateClass,
  deleteClass
} from '@/api/organization'

const userStore = useUserStore()

// 响应式数据
const loading = ref(false)
const classList = ref([])
const departmentList = ref([])
const collegeList = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const classFormRef = ref()

// 搜索表单
const searchForm = reactive({
  className: '',
  classCode: '',
  grade: ''
})

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 班级表单
const classForm = reactive({
  classId: '',
  name: '',           // 班级名称
  code: '',           // 班级代码
  grade: '',          // 年级
  departmentId: ''    // 所属系ID
})

// 表单验证规则
const classRules = {
  name: [{ required: true, message: '请输入班级名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入班级代码', trigger: 'blur' }],
  departmentId: [{ required: true, message: '请选择所属系', trigger: 'change' }]
}

// 初始化
onMounted(() => {
  loadClassList()
  loadDepartmentList()
  loadCollegeList()
})

// 加载班级列表
const loadClassList = async () => {
  loading.value = true
  try {
    const params = {
      page: (pagination.currentPage - 1) * pagination.pageSize,
      size: pagination.pageSize,
      className: searchForm.className,
      classCode: searchForm.classCode,
      grade: searchForm.grade
    }

    const response = await getAllClassList(params, userStore.userInfo)
    if (response.code === '200') {
      classList.value = response.data.classes || []
      pagination.total = response.data.total || 0
    } else {
      ElMessage.error(response.msg || response.message || '加载班级列表失败')
    }
  } catch (error) {
    ElMessage.error('加载班级列表失败')
  } finally {
    loading.value = false
  }
}

// 加载系列表
const loadDepartmentList = async () => {
  try {
    // 如果是系级管理员，只加载自己管理的系
    if (userStore.userInfo?.role === 'department_admin') {
      // 系级管理员只能看到自己管理的系
      const response = await getAllDepartmentList({}, userStore.userInfo)
      if (response.code === '200') {
        departmentList.value = response.data.departments || []
      } else {
        ElMessage.error(response.msg || response.message || '加载系列表失败')
      }
    } else {
      // 校级和院级管理员可以看到所有系或本院系
      const response = await getAllDepartmentList({}, userStore.userInfo)
      if (response.code === '200') {
        departmentList.value = response.data.departments || []
      } else {
        ElMessage.error(response.msg || response.message || '加载系列表失败')
      }
    }
  } catch (error) {
    ElMessage.error('加载系列表失败')
  }
}

// 加载学院列表
const loadCollegeList = async () => {
  try {
    const response = await getCollegeList({}, userStore.userInfo)
    if (response.code === '200') {
      collegeList.value = response.data.colleges || []
    } else {
      ElMessage.error(response.msg || response.message || '加载学院列表失败')
    }
  } catch (error) {
    ElMessage.error('加载学院列表失败')
  }
}

// 搜索
const handleSearch = () => {
  pagination.currentPage = 1
  loadClassList()
}

// 重置搜索
const resetSearch = () => {
  Object.assign(searchForm, {
    className: '',
    classCode: '',
    grade: ''
  })
  handleSearch()
}

// 分页处理
const handleSizeChange = (val) => {
  pagination.pageSize = val
  pagination.currentPage = 1
  loadClassList()
}

const handleCurrentChange = (val) => {
  pagination.currentPage = val
  loadClassList()
}

// 显示添加对话框
const showAddDialog = () => {
  isEdit.value = false
  Object.assign(classForm, {
    classId: '',
    name: '',
    code: '',
    grade: '',
    departmentId: ''
  })
  dialogVisible.value = true
}

// 编辑班级
const editClass = (classItem) => {
  isEdit.value = true
  Object.assign(classForm, {
    classId: classItem.classId,
    name: classItem.className,
    code: classItem.classCode,
    grade: classItem.grade,
    departmentId: classItem.departmentId
  })
  dialogVisible.value = true
}

// 处理系选择变化
const handleDepartmentChange = (departmentId) => {
  // 可以在这里添加逻辑，比如根据系ID获取对应的学院信息
  console.log('选择的系ID:', departmentId)
}

// 保存班级
const saveClass = async () => {
  try {
    await classFormRef.value.validate()

    let response
    if (isEdit.value) {
      response = await updateClass(classForm)
    } else {
      response = await addClass(classForm)
    }

    if (response.code === '200') {
      ElMessage.success(response.message || (isEdit.value ? '班级更新成功' : '班级添加成功'))
      dialogVisible.value = false
      loadClassList()
    } else {
      ElMessage.error(response.msg || response.message || '保存失败')
    }
  } catch (error) {
    if (error !== false) {
      ElMessage.error('保存失败')
    }
  }
}

// 删除班级
const deleteClassHandler = async (classItem) => {
  try {
    await ElMessageBox.confirm(`确定要删除班级"${classItem.className}"吗？`, '提示', {
      type: 'warning'
    })

    const response = await deleteClass(classItem.classId)
    if (response.code === '200') {
      ElMessage.success(response.message || '班级删除成功')
      loadClassList()
    } else {
      ElMessage.error(response.msg || response.message || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      // 如果是API错误，显示错误信息
      if (error.response && error.response.data) {
        ElMessage.error(error.response.data.msg || error.response.data.message || '删除失败')
      } else {
        ElMessage.error('删除失败')
      }
    }
  }
}
</script>

<style scoped>
.class-management {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-bar {
  margin-bottom: 20px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style> 