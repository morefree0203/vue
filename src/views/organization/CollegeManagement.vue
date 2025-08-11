<template>
  <div class="college-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>学院管理</span>
          <el-button type="primary" @click="showAddDialog">添加学院</el-button>
        </div>
      </template>

      <div class="search-bar">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="学院名称">
            <el-input v-model="searchForm.collegeName" placeholder="请输入学院名称" clearable />
          </el-form-item>
          <el-form-item label="学院代码">
            <el-input v-model="searchForm.collegeCode" placeholder="请输入学院代码" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table :data="collegeList" style="width: 100%;" v-loading="loading">
        <el-table-column prop="collegeCode" label="学院代码" width="120" />
        <el-table-column prop="collegeName" label="学院名称" width="200" />
        <el-table-column prop="departmentCount" label="系部数量" width="100" />
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
              <el-button size="small" type="primary" @click="manageDepartments(scope.row)">系部管理</el-button>
              <el-button size="small" type="danger" @click="deleteCollegeHandler(scope.row)">删除</el-button>
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

    <!-- 添加学院对话框 -->
    <el-dialog v-model="dialogVisible" title="添加学院" width="500px">
      <el-form :model="collegeForm" :rules="collegeRules" ref="collegeFormRef" label-width="100px">
        <el-form-item label="学院名称" prop="name">
          <el-input v-model="collegeForm.name" placeholder="请输入学院中文名称" />
        </el-form-item>
        <el-form-item label="学院代码" prop="code">
          <el-input v-model="collegeForm.code" placeholder="请输入学院英文缩写" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveCollege">确定</el-button>
      </template>
    </el-dialog>

    <!-- 系部管理对话框 -->
    <el-dialog v-model="departmentDialogVisible" :title="`${selectedCollege?.collegeName} - 系部管理`" width="800px">
      <div class="department-header">
        <el-button type="primary" @click="showAddDepartmentDialog">添加系部</el-button>
      </div>
      
             <el-table :data="departmentList" style="width: 100%;" v-loading="departmentLoading">
         <el-table-column prop="departmentCode" label="系部代码" width="120" />
         <el-table-column prop="departmentName" label="系部名称" width="200" />
         <el-table-column prop="teacherCount" label="教师数量" width="100" />
         <el-table-column prop="studentCount" label="学生数量" width="100" />
         <el-table-column prop="status" label="状态" width="80">
           <template #default="scope">
             <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
               {{ scope.row.status === 1 ? '启用' : '禁用' }}
             </el-tag>
           </template>
         </el-table-column>
         <el-table-column label="操作" width="150" fixed="right">
           <template #default="scope">
             <div style="display: flex; gap: 8px;">
               <el-button size="small" @click="editDepartment(scope.row)">编辑</el-button>
               <el-button size="small" type="danger" @click="deleteDepartmentHandler(scope.row)">删除</el-button>
             </div>
           </template>
         </el-table-column>
       </el-table>

      <!-- 添加/编辑系部对话框 -->
      <el-dialog v-model="departmentFormVisible" :title="isEditDepartment ? '编辑系部' : '添加系部'" width="400px" append-to-body>
        <el-form :model="departmentForm" :rules="departmentRules" ref="departmentFormRef" label-width="100px">
          <el-form-item label="系部名称" prop="name">
            <el-input v-model="departmentForm.name" placeholder="请输入系部中文名称" />
          </el-form-item>
          <el-form-item label="系部代码" prop="code">
            <el-input v-model="departmentForm.code" :disabled="isEditDepartment" placeholder="请输入系部英文缩写" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="departmentFormVisible = false">取消</el-button>
          <el-button type="primary" @click="saveDepartment">确定</el-button>
        </template>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getCollegeList,
  addCollege,
  updateCollege,
  deleteCollege,
  getDepartmentList,
  addDepartment,
  updateDepartment,
  deleteDepartment
} from '@/api/organization'

// 响应式数据
const loading = ref(false)
const departmentLoading = ref(false)
const collegeList = ref([])
const departmentList = ref([])
const dialogVisible = ref(false)
const departmentDialogVisible = ref(false)
const departmentFormVisible = ref(false)
const isEditDepartment = ref(false)
const collegeFormRef = ref()
const departmentFormRef = ref()
const selectedCollege = ref(null)

// 搜索表单
const searchForm = reactive({
  collegeName: '',
  collegeCode: ''
})

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 学院表单
const collegeForm = reactive({
  collegeId: '',
  name: '',           // 中文名称
  code: ''            // 英文缩写
})

// 系部表单
const departmentForm = reactive({
  departmentId: '',
  name: '',           // 中文名称
  code: '',           // 英文缩写
  collegeId: ''
})

// 表单验证规则
const collegeRules = {
  name: [{ required: true, message: '请输入学院名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入学院代码', trigger: 'blur' }]
}

const departmentRules = {
  name: [{ required: true, message: '请输入系部名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入系部代码', trigger: 'blur' }]
}

// 初始化
onMounted(() => {
  loadCollegeList()
})

// 加载学院列表
const loadCollegeList = async () => {
  loading.value = true
  try {
    const params = {
      page: (pagination.currentPage - 1) * pagination.pageSize,
      size: pagination.pageSize,
      collegeName: searchForm.collegeName,
      collegeCode: searchForm.collegeCode
    }

    const response = await getCollegeList(params)
    if (response.code === '200') {
      collegeList.value = response.data.colleges || []
      pagination.total = response.data.total || 0
    } else {
      ElMessage.error(response.msg || response.message || '加载学院列表失败')
    }
  } catch (error) {
    ElMessage.error('加载学院列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.currentPage = 1
  loadCollegeList()
}

// 重置搜索
const resetSearch = () => {
  Object.assign(searchForm, {
    collegeName: '',
    collegeCode: ''
  })
  handleSearch()
}

// 分页处理
const handleSizeChange = (val) => {
  pagination.pageSize = val
  pagination.currentPage = 1
  loadCollegeList()
}

const handleCurrentChange = (val) => {
  pagination.currentPage = val
  loadCollegeList()
}

// 显示添加对话框
const showAddDialog = () => {
  Object.assign(collegeForm, {
    collegeId: '',
    name: '',
    code: ''
  })
  dialogVisible.value = true
}



// 保存学院
const saveCollege = async () => {
  try {
    await collegeFormRef.value.validate()

    const response = await addCollege(collegeForm)

    if (response.code === '200') {
      ElMessage.success(response.message || '学院添加成功')
      dialogVisible.value = false
      loadCollegeList()
    } else {
      ElMessage.error(response.msg || response.message || '保存失败')
    }
  } catch (error) {
    if (error !== false) {
      ElMessage.error('保存失败')
    }
  }
}

// 删除学院
const deleteCollegeHandler = async (college) => {
  try {
    await ElMessageBox.confirm(`确定要删除学院"${college.collegeName}"吗？`, '提示', {
      type: 'warning'
    })

    const response = await deleteCollege(college.collegeId)
    if (response.code === '200') {
      ElMessage.success(response.message || '学院删除成功')
      loadCollegeList()
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



// 管理系部
const manageDepartments = async (college) => {
  selectedCollege.value = college
  departmentDialogVisible.value = true
  await loadDepartmentList(college.collegeId)
}

// 加载系部列表
const loadDepartmentList = async (collegeId) => {
  departmentLoading.value = true
  try {
    const response = await getDepartmentList(collegeId, {})
    if (response.code === '200') {
      departmentList.value = response.data.departments || []
    } else {
      ElMessage.error(response.msg || response.message || '加载系部列表失败')
    }
  } catch (error) {
    ElMessage.error('加载系部列表失败')
  } finally {
    departmentLoading.value = false
  }
}

// 显示添加系部对话框
const showAddDepartmentDialog = () => {
  isEditDepartment.value = false
  Object.assign(departmentForm, {
    departmentId: '',
    name: '',
    code: '',
    collegeId: selectedCollege.value.collegeId
  })
  departmentFormVisible.value = true
}

// 编辑系部
const editDepartment = (department) => {
  isEditDepartment.value = true
  Object.assign(departmentForm, {
    departmentId: department.departmentId,
    name: department.departmentName,
    code: department.departmentCode,
    collegeId: selectedCollege.value.collegeId
  })
  departmentFormVisible.value = true
}

// 保存系部
const saveDepartment = async () => {
  try {
    await departmentFormRef.value.validate()

    let response
    if (isEditDepartment.value) {
      response = await updateDepartment(departmentForm)
    } else {
      response = await addDepartment(departmentForm)
    }

    if (response.code === '200') {
      ElMessage.success(response.message || (isEditDepartment.value ? '系部更新成功' : '系部添加成功'))
      departmentFormVisible.value = false
      loadDepartmentList(selectedCollege.value.collegeId)
    } else {
      ElMessage.error(response.msg || response.message || '保存失败')
    }
  } catch (error) {
    if (error !== false) {
      ElMessage.error('保存失败')
    }
  }
}

// 删除系部
const deleteDepartmentHandler = async (department) => {
  try {
    await ElMessageBox.confirm(`确定要删除系部"${department.departmentName}"吗？`, '提示', {
      type: 'warning'
    })

    const response = await deleteDepartment(department.departmentId)
    if (response.code === '200') {
      ElMessage.success(response.message || '系部删除成功')
      loadDepartmentList(selectedCollege.value.collegeId)
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
.college-management {
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

.department-header {
  margin-bottom: 20px;
}
</style> 