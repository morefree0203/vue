<template>
  <div class="department-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <span>系管理</span>
            <el-tag v-if="userStore.userInfo?.role === 'department_admin'" type="warning" style="margin-left: 10px;">
              系级管理员没有系管理权限
            </el-tag>
          </div>
          <el-button 
            v-if="userStore.userInfo?.role !== 'department_admin'"
            type="primary" 
            @click="showAddDialog"
          >
            添加系
          </el-button>
        </div>
      </template>

      <div class="search-bar">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="系名称">
            <el-input v-model="searchForm.departmentName" placeholder="请输入系名称" clearable />
          </el-form-item>
          <el-form-item label="系代码">
            <el-input v-model="searchForm.departmentCode" placeholder="请输入系代码" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table :data="departmentList" style="width: 100%;" v-loading="loading">
        <el-table-column prop="departmentCode" label="系代码" width="120" />
        <el-table-column prop="departmentName" label="系名称" width="200" />
        <el-table-column prop="collegeName" label="所属学院" width="150" />
        <el-table-column prop="teacherCount" label="教师数量" width="100" />
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
              <el-button size="small" @click="editDepartment(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="deleteDepartmentHandler(scope.row)">删除</el-button>
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

    <!-- 添加/编辑系对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑系' : '添加系'" width="500px">
      <el-form :model="departmentForm" :rules="departmentRules" ref="departmentFormRef" label-width="100px">
        <el-form-item label="系名称" prop="name">
          <el-input v-model="departmentForm.name" placeholder="请输入系中文名称" />
        </el-form-item>
        <el-form-item label="系代码" prop="code">
          <el-input v-model="departmentForm.code" :disabled="isEdit" placeholder="请输入系英文缩写" />
        </el-form-item>
        <el-form-item label="所属学院" prop="collegeId">
          <el-select v-model="departmentForm.collegeId" placeholder="请选择所属学院">
            <el-option 
              v-for="college in collegeList" 
              :key="college.collegeId" 
              :label="college.collegeName" 
              :value="college.collegeId" 
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveDepartment">确定</el-button>
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
  addDepartment,
  updateDepartment,
  deleteDepartment
} from '@/api/organization'

const userStore = useUserStore()

// 响应式数据
const loading = ref(false)
const departmentList = ref([])
const collegeList = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const departmentFormRef = ref()

// 搜索表单
const searchForm = reactive({
  departmentName: '',
  departmentCode: ''
})

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 系表单
const departmentForm = reactive({
  departmentId: '',
  name: '',           // 中文名称
  code: '',           // 英文缩写
  collegeId: ''       // 所属学院ID
})

// 表单验证规则
const departmentRules = {
  name: [{ required: true, message: '请输入系名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入系代码', trigger: 'blur' }],
  collegeId: [{ required: true, message: '请选择所属学院', trigger: 'change' }]
}

// 初始化
onMounted(() => {
  loadDepartmentList()
  loadCollegeList()
})

// 加载系列表
const loadDepartmentList = async () => {
  loading.value = true
  try {
    const params = {
      page: (pagination.currentPage - 1) * pagination.pageSize,
      size: pagination.pageSize,
      departmentName: searchForm.departmentName,
      departmentCode: searchForm.departmentCode
    }

    const response = await getAllDepartmentList(params, userStore.userInfo)
    if (response.code === '200') {
      departmentList.value = response.data.departments || []
      pagination.total = response.data.total || 0
    } else {
      ElMessage.error(response.msg || response.message || '加载系列表失败')
    }
  } catch (error) {
    ElMessage.error('加载系列表失败')
  } finally {
    loading.value = false
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
  loadDepartmentList()
}

// 重置搜索
const resetSearch = () => {
  Object.assign(searchForm, {
    departmentName: '',
    departmentCode: ''
  })
  handleSearch()
}

// 分页处理
const handleSizeChange = (val) => {
  pagination.pageSize = val
  pagination.currentPage = 1
  loadDepartmentList()
}

const handleCurrentChange = (val) => {
  pagination.currentPage = val
  loadDepartmentList()
}

// 显示添加对话框
const showAddDialog = () => {
  isEdit.value = false
  Object.assign(departmentForm, {
    departmentId: '',
    name: '',
    code: '',
    collegeId: ''
  })
  dialogVisible.value = true
}

// 编辑系
const editDepartment = (department) => {
  isEdit.value = true
  Object.assign(departmentForm, {
    departmentId: department.departmentId,
    name: department.departmentName,
    code: department.departmentCode,
    collegeId: department.collegeId
  })
  dialogVisible.value = true
}

// 保存系
const saveDepartment = async () => {
  try {
    await departmentFormRef.value.validate()

    let response
    if (isEdit.value) {
      response = await updateDepartment(departmentForm)
    } else {
      response = await addDepartment(departmentForm)
    }

    if (response.code === '200') {
      ElMessage.success(response.message || (isEdit.value ? '系更新成功' : '系添加成功'))
      dialogVisible.value = false
      loadDepartmentList()
    } else {
      ElMessage.error(response.msg || response.message || '保存失败')
    }
  } catch (error) {
    if (error !== false) {
      ElMessage.error('保存失败')
    }
  }
}

// 删除系
const deleteDepartmentHandler = async (department) => {
  try {
    await ElMessageBox.confirm(`确定要删除系"${department.departmentName}"吗？`, '提示', {
      type: 'warning'
    })

    const response = await deleteDepartment(department.departmentId)
    if (response.code === '200') {
      ElMessage.success(response.message || '系删除成功')
      loadDepartmentList()
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
.department-management {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
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