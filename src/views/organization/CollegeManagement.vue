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
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
              <el-option label="启用" :value="1" />
              <el-option label="禁用" :value="0" />
            </el-select>
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
        <el-table-column prop="englishName" label="英文名称" width="200" />
        <el-table-column prop="description" label="学院描述" />
        <el-table-column prop="departmentCount" label="系部数量" width="100" />
        <el-table-column prop="teacherCount" label="教师数量" width="100" />
        <el-table-column prop="studentCount" label="学生数量" width="100" />
        <el-table-column prop="createTime" label="创建时间" width="150" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="editCollege(scope.row)">编辑</el-button>
            <el-button size="small" type="primary" @click="manageDepartments(scope.row)">系部管理</el-button>
            <el-button 
              size="small" 
              :type="scope.row.status === 1 ? 'danger' : 'success'"
              @click="toggleStatus(scope.row)"
            >
              {{ scope.row.status === 1 ? '禁用' : '启用' }}
            </el-button>
            <el-button size="small" type="danger" @click="deleteCollege(scope.row)">删除</el-button>
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

    <!-- 添加/编辑学院对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑学院' : '添加学院'" width="600px">
      <el-form :model="collegeForm" :rules="collegeRules" ref="collegeFormRef" label-width="100px">
        <el-form-item label="学院代码" prop="collegeCode">
          <el-input v-model="collegeForm.collegeCode" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="学院名称" prop="collegeName">
          <el-input v-model="collegeForm.collegeName" />
        </el-form-item>
        <el-form-item label="英文名称" prop="englishName">
          <el-input v-model="collegeForm.englishName" />
        </el-form-item>
        <el-form-item label="学院描述" prop="description">
          <el-input v-model="collegeForm.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="collegeForm.phone" />
        </el-form-item>
        <el-form-item label="联系邮箱" prop="email">
          <el-input v-model="collegeForm.email" />
        </el-form-item>
        <el-form-item label="学院地址" prop="address">
          <el-input v-model="collegeForm.address" />
        </el-form-item>
        <el-form-item label="学院状态" prop="status">
          <el-radio-group v-model="collegeForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
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
        <el-table-column prop="description" label="系部描述" />
        <el-table-column prop="teacherCount" label="教师数量" width="100" />
        <el-table-column prop="studentCount" label="学生数量" width="100" />
        <el-table-column prop="createTime" label="创建时间" width="150" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="editDepartment(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteDepartment(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加/编辑系部对话框 -->
      <el-dialog v-model="departmentFormVisible" :title="isEditDepartment ? '编辑系部' : '添加系部'" width="500px" append-to-body>
        <el-form :model="departmentForm" :rules="departmentRules" ref="departmentFormRef" label-width="100px">
          <el-form-item label="系部代码" prop="departmentCode">
            <el-input v-model="departmentForm.departmentCode" :disabled="isEditDepartment" />
          </el-form-item>
          <el-form-item label="系部名称" prop="departmentName">
            <el-input v-model="departmentForm.departmentName" />
          </el-form-item>
          <el-form-item label="系部描述" prop="description">
            <el-input v-model="departmentForm.description" type="textarea" :rows="3" />
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="departmentForm.phone" />
          </el-form-item>
          <el-form-item label="联系邮箱" prop="email">
            <el-input v-model="departmentForm.email" />
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

// 响应式数据
const loading = ref(false)
const departmentLoading = ref(false)
const collegeList = ref([])
const departmentList = ref([])
const dialogVisible = ref(false)
const departmentDialogVisible = ref(false)
const departmentFormVisible = ref(false)
const isEdit = ref(false)
const isEditDepartment = ref(false)
const collegeFormRef = ref()
const departmentFormRef = ref()
const selectedCollege = ref(null)

// 搜索表单
const searchForm = reactive({
  collegeName: '',
  collegeCode: '',
  status: ''
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
  collegeCode: '',
  collegeName: '',
  englishName: '',
  description: '',
  phone: '',
  email: '',
  address: '',
  status: 1
})

// 系部表单
const departmentForm = reactive({
  departmentId: '',
  departmentCode: '',
  departmentName: '',
  description: '',
  phone: '',
  email: '',
  collegeId: ''
})

// 表单验证规则
const collegeRules = {
  collegeCode: [{ required: true, message: '请输入学院代码', trigger: 'blur' }],
  collegeName: [{ required: true, message: '请输入学院名称', trigger: 'blur' }],
  englishName: [{ required: true, message: '请输入英文名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入学院描述', trigger: 'blur' }]
}

const departmentRules = {
  departmentCode: [{ required: true, message: '请输入系部代码', trigger: 'blur' }],
  departmentName: [{ required: true, message: '请输入系部名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入系部描述', trigger: 'blur' }]
}

// 初始化
onMounted(() => {
  loadCollegeList()
})

// 加载学院列表
const loadCollegeList = async () => {
  loading.value = true
  try {
    // 模拟数据
    collegeList.value = [
      {
        collegeId: '1',
        collegeCode: 'CS',
        collegeName: '计算机科学与技术学院',
        englishName: 'College of Computer Science and Technology',
        description: '培养计算机科学与技术领域的高素质人才',
        departmentCount: 3,
        teacherCount: 45,
        studentCount: 1200,
        createTime: '2024-01-01 10:00:00',
        status: 1
      },
      {
        collegeId: '2',
        collegeCode: 'EE',
        collegeName: '电子工程学院',
        englishName: 'College of Electronic Engineering',
        description: '培养电子工程领域的高素质人才',
        departmentCount: 2,
        teacherCount: 32,
        studentCount: 800,
        createTime: '2024-01-01 10:00:00',
        status: 1
      },
      {
        collegeId: '3',
        collegeCode: 'ME',
        collegeName: '机械工程学院',
        englishName: 'College of Mechanical Engineering',
        description: '培养机械工程领域的高素质人才',
        departmentCount: 4,
        teacherCount: 58,
        studentCount: 1500,
        createTime: '2024-01-01 10:00:00',
        status: 1
      }
    ]
    pagination.total = collegeList.value.length
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
    collegeCode: '',
    status: ''
  })
  handleSearch()
}

// 分页处理
const handleSizeChange = (val) => {
  pagination.pageSize = val
  loadCollegeList()
}

const handleCurrentChange = (val) => {
  pagination.currentPage = val
  loadCollegeList()
}

// 显示添加对话框
const showAddDialog = () => {
  isEdit.value = false
  Object.assign(collegeForm, {
    collegeId: '',
    collegeCode: '',
    collegeName: '',
    englishName: '',
    description: '',
    phone: '',
    email: '',
    address: '',
    status: 1
  })
  dialogVisible.value = true
}

// 编辑学院
const editCollege = (college) => {
  isEdit.value = true
  Object.assign(collegeForm, college)
  dialogVisible.value = true
}

// 保存学院
const saveCollege = async () => {
  try {
    await collegeFormRef.value.validate()
    
    if (isEdit.value) {
      ElMessage.success('学院更新成功')
    } else {
      ElMessage.success('学院添加成功')
    }
    dialogVisible.value = false
    loadCollegeList()
  } catch (error) {
    if (error !== false) {
      ElMessage.error('保存失败')
    }
  }
}

// 删除学院
const deleteCollege = async (college) => {
  try {
    await ElMessageBox.confirm(`确定要删除学院"${college.collegeName}"吗？`, '提示', {
      type: 'warning'
    })
    ElMessage.success('学院删除成功')
    loadCollegeList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 切换状态
const toggleStatus = async (college) => {
  try {
    const action = college.status === 1 ? '禁用' : '启用'
    await ElMessageBox.confirm(`确定要${action}学院"${college.collegeName}"吗？`, '提示', {
      type: 'warning'
    })
    
    college.status = college.status === 1 ? 0 : 1
    ElMessage.success(`${action}成功`)
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
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
    // 模拟数据
    departmentList.value = [
      {
        departmentId: '1',
        departmentCode: 'CS001',
        departmentName: '计算机科学与技术系',
        description: '计算机科学与技术专业',
        teacherCount: 15,
        studentCount: 400,
        createTime: '2024-01-01 10:00:00',
        status: 1
      },
      {
        departmentId: '2',
        departmentCode: 'CS002',
        departmentName: '软件工程系',
        description: '软件工程专业',
        teacherCount: 12,
        studentCount: 350,
        createTime: '2024-01-01 10:00:00',
        status: 1
      }
    ]
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
    departmentCode: '',
    departmentName: '',
    description: '',
    phone: '',
    email: '',
    collegeId: selectedCollege.value.collegeId
  })
  departmentFormVisible.value = true
}

// 编辑系部
const editDepartment = (department) => {
  isEditDepartment.value = true
  Object.assign(departmentForm, department)
  departmentFormVisible.value = true
}

// 保存系部
const saveDepartment = async () => {
  try {
    await departmentFormRef.value.validate()
    
    if (isEditDepartment.value) {
      ElMessage.success('系部更新成功')
    } else {
      ElMessage.success('系部添加成功')
    }
    departmentFormVisible.value = false
    loadDepartmentList(selectedCollege.value.collegeId)
  } catch (error) {
    if (error !== false) {
      ElMessage.error('保存失败')
    }
  }
}

// 删除系部
const deleteDepartment = async (department) => {
  try {
    await ElMessageBox.confirm(`确定要删除系部"${department.departmentName}"吗？`, '提示', {
      type: 'warning'
    })
    ElMessage.success('系部删除成功')
    loadDepartmentList(selectedCollege.value.collegeId)
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
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