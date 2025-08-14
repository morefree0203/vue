<template>
  <!-- 管理员权限管理主页面 -->
  <div class="admin-management">
    <!-- 管理员权限管理卡片 -->
    <el-card>
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <span>管理员权限管理</span>
            <el-tag type="info" style="margin-left: 10px;">
              当前权限：{{ getCurrentAdminLevelText() }}
            </el-tag>
          </div>
          <!-- 打开分配管理员权限对话框按钮 -->
          <el-button type="primary" @click="showAssignDialog" :disabled="!canAssignAdmin">分配管理员权限</el-button>
        </div>
      </template>

      <!-- 权限说明 -->
      <div class="permission-info">
        <el-alert
          :title="getPermissionInfoTitle()"
          :description="getPermissionInfoDescription()"
          type="info"
          :closable="false"
          show-icon
        />
      </div>

      <!-- 搜索区域：按姓名和管理员级别筛选管理员 -->
      <div class="search-area">
        <el-form :model="searchForm" inline>
          <el-form-item label="管理员姓名">
            <el-input v-model="searchForm.name" placeholder="请输入管理员姓名" clearable style="width: 200px;" />
          </el-form-item>
          <el-form-item label="管理员级别">
            <el-select v-model="searchForm.adminLevel" placeholder="请选择管理员级别" clearable style="width: 180px;">
              <el-option label="系统运维管理员" value="system_admin" />
              <el-option label="校级管理员" value="school_admin" />
              <el-option label="院级管理员" value="college_admin" /> 
              <el-option label="系级管理员" value="department_admin" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 管理员列表表格 -->
      <el-table :data="adminList" v-loading="loading" stripe>
        <el-table-column prop="adminId" label="用户ID" width="120" />
        <el-table-column prop="name" label="管理员姓名" width="120" />
        <el-table-column prop="adminLevel" label="管理员级别" width="150">
          <template #default="{ row }">
            <el-tag :type="getAdminLevelType(row.adminLevel)">
              {{ getAdminLevelText(row.adminLevel) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="phoneNumber" label="联系电话" width="120" />
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <!-- 编辑和撤销权限按钮 -->
            <el-button type="primary" size="small" @click="showEditDialog(row)" :disabled="!canEditAdmin(row)">编辑权限</el-button>
            <el-button type="warning" size="small" @click="handleRevoke(row)" :disabled="!canRevokeAdmin(row)">撤销权限</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.size"
          :page-sizes="[10, 20, 50]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 分配管理员权限对话框 -->
    <!--   :close-on-click-modal="false"  控制是否可以通过点击遮罩层（模态框）关闭对话框。 -->
    <el-dialog 
      title="分配管理员权限" 
      v-model="assignDialogVisible" 
      width="800px"
      :close-on-click-modal="false"
      @close="handleAssignDialogClose"
    >
      <div class="assign-dialog-content">
        <!-- 用户搜索区域 -->
        <div class="user-search">
          <el-form :model="userSearchForm" inline>
            <el-form-item label="用户角色">
              <el-select v-model="userSearchForm.role" placeholder="请选择用户角色" clearable style="width: 140px;">
                <el-option label="教师" value="teacher" />
                <el-option label="督导" value="supervisor" />
                <el-option label="领导" value="leader" />
              </el-select>
            </el-form-item>
            <el-form-item label="用户姓名">
              <el-input v-model="userSearchForm.name" placeholder="请输入用户姓名" clearable style="width: 200px;" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchUsers">搜索用户</el-button>
              <el-button @click="resetUserSearch">重置</el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 用户列表（可选择分配权限的用户） -->
        <div class="user-list">
          <el-table :data="userList" v-loading="userLoading" stripe max-height="300">
            <el-table-column prop="id" label="用户ID" width="120" />
            <el-table-column prop="name" label="姓名" width="120" />
            <el-table-column prop="role" label="当前角色" width="150">
              <template #default="{ row }">
                <div v-if="row.role && row.role.trim()" >
                  <el-tag 
                    v-for="role in getRoleList(row.role)" 
                    :key="role"
                    :type="getOriginalRoleType(role)"
                    size="small"
                    style="margin-right: 4px; margin-bottom: 2px;"
                  >
                    {{ getOriginalRoleText(role) }}
                  </el-tag>
                </div>
                <span v-else style="color: #c0c4cc;">-</span>
              </template>
            </el-table-column>
            <el-table-column prop="phoneNumber" label="联系电话" width="120" />
            <el-table-column prop="email" label="邮箱" width="180" />
            <el-table-column label="操作" width="120">
              <template #default="{ row }">
                <el-button type="primary" size="small" @click="selectUser(row)">选择</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 权限分配表单（选中用户后显示） -->
        <div class="permission-form" v-if="selectedUser">
          <el-divider>为 {{ selectedUser.name }} 分配管理员权限</el-divider>
          <el-form :model="assignForm" :rules="assignRules" ref="assignFormRef" label-width="120px">
            <el-form-item label="管理员级别" prop="adminLevel">
              <el-select v-model="assignForm.adminLevel" placeholder="请选择管理员级别" @change="handleAssignLevelChange" style="width: 100%;">
                <el-option v-for="level in getAssignableAdminLevels()" :key="level.value" :label="level.label" :value="level.value" />
              </el-select>
            </el-form-item>
            <!-- 院级管理员需要选择学院 -->
            <el-form-item v-if="assignForm.adminLevel === 'college_admin'" label="所属学院" prop="collegeId">
              <el-select v-model="assignForm.collegeId" placeholder="请选择学院" @change="handleAssignCollegeChange" style="width: 100%;">
                <el-option 
                  v-for="college in collegeList" 
                  :key="college.collegeId" 
                  :label="college.name" 
                  :value="college.collegeId" 
                />
              </el-select>
            </el-form-item>
            <!-- 系级管理员需要选择学院和系 -->
            <el-form-item v-if="assignForm.adminLevel === 'department_admin'" label="所属学院" prop="collegeId">
              <el-select v-model="assignForm.collegeId" placeholder="请选择学院" @change="handleAssignCollegeChange" style="width: 100%;">
                <el-option 
                  v-for="college in collegeList" 
                  :key="college.collegeId" 
                  :label="college.name" 
                  :value="college.collegeId" 
                />
              </el-select>
            </el-form-item>
            <el-form-item v-if="assignForm.adminLevel === 'department_admin'" label="所属系" prop="departmentId">
              <el-select v-model="assignForm.departmentId" placeholder="请选择系" :disabled="!assignForm.collegeId" style="width: 100%;">
                <el-option 
                  v-for="department in departmentList" 
                  :key="department.departmentId" 
                  :label="department.name" 
                  :value="department.departmentId" 
                />
              </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="assignForm.status">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <template #footer>
        <el-button @click="handleAssignDialogClose">取消</el-button>
        <el-button type="primary" @click="handleAssign" :disabled="!selectedUser">确定分配</el-button>
      </template>
    </el-dialog>

    <!-- 编辑管理员权限对话框 -->
    <el-dialog 
      title="编辑管理员权限" 
      v-model="editDialogVisible" 
      width="600px"
      :close-on-click-modal="false"
      @close="handleEditDialogClose"
    >
      <!-- 编辑表单 -->
      <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="120px">
        <el-form-item label="用户ID" prop="adminId">
          <el-input v-model="editForm.adminId" disabled />
        </el-form-item>
        <el-form-item label="管理员姓名" prop="name">
          <el-input v-model="editForm.name" disabled />
        </el-form-item>
        <el-form-item label="管理员级别" prop="adminLevel">
          <el-select v-model="editForm.adminLevel" placeholder="请选择管理员级别" @change="handleEditLevelChange" style="width: 100%;">
            <el-option v-for="level in getAssignableAdminLevels()" :key="level.value" :label="level.label" :value="level.value" />
          </el-select>
          <div style="font-size: 12px; color: #909399; margin-top: 5px;">
            注意：高级管理员包含低级管理员的所有权限，可以修改级别和状态
          </div>
        </el-form-item>
        <!-- 院级管理员需要选择学院 -->
        <el-form-item v-if="editForm.adminLevel === 'college_admin'" label="所属学院" prop="collegeId">
          <el-select v-model="editForm.collegeId" placeholder="请选择学院" @change="handleEditCollegeChange" style="width: 100%;">
            <el-option 
              v-for="college in collegeList" 
              :key="college.collegeId" 
              :label="college.name" 
              :value="college.collegeId" 
            />
          </el-select>
        </el-form-item>
        <!-- 系级管理员需要选择学院和系 -->
        <el-form-item v-if="editForm.adminLevel === 'department_admin'" label="所属学院" prop="collegeId">
          <el-select v-model="editForm.collegeId" placeholder="请选择学院" @change="handleEditCollegeChange" style="width: 100%;">
            <el-option 
              v-for="college in collegeList" 
              :key="college.collegeId" 
              :label="college.name" 
              :value="college.collegeId" 
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="editForm.adminLevel === 'department_admin'" label="所属系" prop="departmentId">
          <el-select v-model="editForm.departmentId" placeholder="请选择系" :disabled="!editForm.collegeId" style="width: 100%;">
            <el-option 
              v-for="department in departmentList" 
              :key="department.departmentId" 
              :label="department.name" 
              :value="department.departmentId" 
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="editForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleEditDialogClose">取消</el-button>
        <el-button type="primary" @click="handleEditSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
// 引入Vue响应式API和Element Plus组件
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAdminList, getUsersByRole, assignAdminRole, updateAdmin, revokeAdminRole, getCollegeList, getDepartmentList } from '@/api/admin'
import { useUserStore } from '@/stores/user'

// ========== 用户Store ==========
const userStore = useUserStore()

// ========== 计算属性 ==========
// 检查当前用户是否可以分配管理员权限
const canAssignAdmin = computed(() => {
  const currentLevel = getCurrentAdminLevel()
  return ['system_admin', 'school_admin', 'college_admin'].includes(currentLevel)
})

// ========== 权限控制相关方法 ==========
// 获取当前用户的管理员级别
const getCurrentAdminLevel = () => {
  return userStore.userInfo?.role || ''
}

// 检查是否有权限操作指定级别的管理员
const canOperateAdminLevel = (targetLevel) => {
  const currentLevel = getCurrentAdminLevel()
  
  // 系统管理员可以操作所有级别
  if (currentLevel === 'system_admin') {
    return true
  }
  
  // 校级管理员不能操作系统管理员和校级管理员
  if (currentLevel === 'school_admin') {
    return targetLevel !== 'system_admin' && targetLevel !== 'school_admin'
  }
  
  // 院级管理员只能操作系级管理员
  if (currentLevel === 'college_admin') {
    return targetLevel === 'department_admin'
  }
  
  // 系级管理员不能操作任何管理员
  if (currentLevel === 'department_admin') {
    return false
  }
  
  return false
}

// 获取当前用户可以分配的管理员级别选项
const getAssignableAdminLevels = () => {
  const currentLevel = getCurrentAdminLevel()
  
  const allLevels = [
    { label: '系统运维管理员', value: 'system_admin' },
    { label: '校级管理员', value: 'school_admin' },
    { label: '院级管理员', value: 'college_admin' },
    { label: '系级管理员', value: 'department_admin' }
  ]
  
  if (currentLevel === 'system_admin') {
    return allLevels
  }
  
  if (currentLevel === 'school_admin') {
    return allLevels.filter(level => level.value !== 'system_admin' && level.value !== 'school_admin')
  }
  
  if (currentLevel === 'college_admin') {
    return allLevels.filter(level => level.value === 'department_admin')
  }
  
  return []
}

// 检查是否可以编辑指定管理员
const canEditAdmin = (admin) => {
  return canOperateAdminLevel(admin.adminLevel)
}

// 检查是否可以撤销指定管理员权限
const canRevokeAdmin = (admin) => {
  return canOperateAdminLevel(admin.adminLevel)
}

// ========== 响应式数据定义 ==========
const loading = ref(false) // 管理员列表加载状态
const adminList = ref([]) // 管理员列表
const assignDialogVisible = ref(false) // 分配权限对话框显示状态
const editDialogVisible = ref(false) // 编辑权限对话框显示状态
const assignFormRef = ref() // 分配表单ref
const editFormRef = ref() // 编辑表单ref

// 用户搜索相关
const userLoading = ref(false) // 用户列表加载状态
const userList = ref([]) // 可分配权限的用户列表
const selectedUser = ref(null) // 当前选中的用户
const userSearchForm = reactive({
  role: '',
  name: ''
})

// 学院和系数据
const collegeList = ref([]) // 学院列表
const departmentList = ref([]) // 系列表

// 搜索表单
const searchForm = reactive({
  name: '',
  adminLevel: ''
})

// 分页
const pagination = reactive({
  current: 1,
  size: 20,
  total: 0
})

// 分配表单
const assignForm = reactive({
  adminLevel: '',
  status: 1,
  collegeId: '',
  departmentId: ''
})

// 编辑表单
const editForm = reactive({
  adminId: '',
  name: '',
  adminLevel: '',
  status: 1,
  collegeId: '',
  departmentId: ''
})

// ========== 表单验证规则 ==========
// 分配表单验证规则
const assignRules = {
  adminLevel: [{ required: true, message: '请选择管理员级别', trigger: 'change' }],
  collegeId: [
    { 
      required: true, 
      message: '请选择所属学院', 
      trigger: 'change',
      validator: (rule, value, callback) => {
        // 使用响应式数据确保验证器能正确获取当前值
        const currentLevel = assignForm.adminLevel
        if (currentLevel === 'college_admin' || currentLevel === 'department_admin') {
          if (!value) {
            callback(new Error('请选择所属学院'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
    }
  ],
  departmentId: [
    { 
      required: true, 
      message: '请选择所属系', 
      trigger: 'change',
      validator: (rule, value, callback) => {
        // 使用响应式数据确保验证器能正确获取当前值
        const currentLevel = assignForm.adminLevel
        if (currentLevel === 'department_admin') {
          if (!value) {
            callback(new Error('请选择所属系'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
    }
  ]
}

// 编辑表单验证规则
const editRules = {
  adminLevel: [{ required: true, message: '请选择管理员级别', trigger: 'change' }],
  collegeId: [
    { 
      required: true, 
      message: '请选择所属学院', 
      trigger: 'change',
      validator: (rule, value, callback) => {
        // 使用响应式数据确保验证器能正确获取当前值
        const currentLevel = editForm.adminLevel
        if (currentLevel === 'college_admin' || currentLevel === 'department_admin') {
          if (!value) {
            callback(new Error('请选择所属学院'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
    }
  ],
  departmentId: [
    { 
      required: true, 
      message: '请选择所属系', 
      trigger: 'change',
      validator: (rule, value, callback) => {
        // 使用响应式数据确保验证器能正确获取当前值
        const currentLevel = editForm.adminLevel
        if (currentLevel === 'department_admin') {
          if (!value) {
            callback(new Error('请选择所属系'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
    }
  ]
}

// ========== 管理员列表加载、搜索、分页等方法 ==========
const loadData = async () => {
  loading.value = true
  try {
    const params = {
      ...searchForm,
      page: (pagination.current - 1) * pagination.size,
      size: pagination.size
    }
    const res = await getAdminList(params)
    if (res.code === '200') {
      adminList.value = res.data.list || []
      pagination.total = res.data.total || 0
    } else {
      ElMessage.error(res.message || '获取管理员列表失败')
    }
  } catch (error) {
    console.error('获取管理员列表失败:', error)
    ElMessage.error('获取管理员列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.current = 1
  loadData()
}

const resetSearch = () => {
  searchForm.name = '';
  searchForm.adminLevel = '';
  handleSearch();
}

const handleSizeChange = (size) => {
  pagination.size = size
  pagination.current = 1
  loadData()
}

const handleCurrentChange = (current) => {
  pagination.current = current
  loadData()
}

// ========== 分配权限相关方法 ==========
const showAssignDialog = () => {
  assignDialogVisible.value = true
  selectedUser.value = null
  clearAssignForm()
  searchUsers()
}

const searchUsers = async () => {
  userLoading.value = true
  try {
    const res = await getUsersByRole(userSearchForm)
    if (res.code === '200') {
      userList.value = res.data.list || []
    } else {
      ElMessage.error(res.message || '获取用户列表失败')
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
    ElMessage.error('获取用户列表失败')
  } finally {
    userLoading.value = false
  }
}

const resetUserSearch = () => {
  Object.assign(userSearchForm, { role: '', name: '' })
  searchUsers()
}

const selectUser = (user) => {
  selectedUser.value = user
}

const handleAssign = async () => {
  if (!selectedUser.value) {
    ElMessage.warning('请先选择用户')
    return
  }
  
  // 检查是否有权限分配指定的管理员级别
  if (!canOperateAdminLevel(assignForm.adminLevel)) {
    ElMessage.warning('您没有权限分配该管理员级别')
    return
  }
  
  await assignFormRef.value.validate()
  try {
    const res = await assignAdminRole({
      userId: selectedUser.value.id,
      name: selectedUser.value.name,
      phoneNumber: selectedUser.value.phoneNumber,
      email: selectedUser.value.email,
      adminLevel: assignForm.adminLevel,
      status: assignForm.status,
      collegeId: assignForm.collegeId,
      departmentId: assignForm.departmentId
    })
    
    if (res.code === '200') {
      ElMessage.success('权限分配成功')
      assignDialogVisible.value = false
      loadData()
    } else {
      ElMessage.error(res.message || '权限分配失败')
    }
  } catch (error) {
    console.error('权限分配失败:', error)
    ElMessage.error('权限分配失败')
  }
}

// ========== 编辑权限相关方法 ==========
const showEditDialog = async (row) => {
  // 检查是否有权限编辑该管理员
  if (!canEditAdmin(row)) {
    ElMessage.warning('您没有权限编辑该管理员')
    return
  }
  
  Object.assign(editForm, row)
  editDialogVisible.value = true
  
  // 如果是系级管理员，需要加载对应的系列表
  // if (row.adminLevel === 'department_admin' && row.collegeId) {
  //   await loadDepartmentList(row.collegeId)
  // }
}

const handleEditSubmit = async () => {
  await editFormRef.value.validate()
  
  // 检查是否有权限修改为指定的管理员级别
  if (!canOperateAdminLevel(editForm.adminLevel)) {
    ElMessage.warning('您没有权限将该用户设置为该管理员级别')
    return
  }
  
  // 如果修改了管理员级别，需要确认
  const originalAdmin = adminList.value.find(admin => admin.adminId === editForm.adminId)
  if (originalAdmin && originalAdmin.adminLevel !== editForm.adminLevel) {
    try {
      await ElMessageBox.confirm(
        `确定要将 ${editForm.name} 的管理员级别从 ${getAdminLevelText(originalAdmin.adminLevel)} 调整为 ${getAdminLevelText(editForm.adminLevel)} 吗？`,
        '确认权限调整',
        { type: 'warning' }
      )
    } catch (error) {
      if (error === 'cancel') {
        return
      }
    }
  }
  
  // 如果修改了状态，显示状态变化提示
  if (originalAdmin && originalAdmin.status !== editForm.status) {
    const statusText = editForm.status === 1 ? '启用' : '禁用'
    try {
      await ElMessageBox.confirm(
        `确定要${statusText} ${editForm.name} 的管理员权限吗？`,
        '确认状态调整',
        { type: 'warning' }
      )
    } catch (error) {
      if (error === 'cancel') {
        return
      }
    }
  }
  
  try {
    const res = await updateAdmin(editForm)
    if (res.code === '200') {
      ElMessage.success('更新成功')
      editDialogVisible.value = false
      loadData()
    } else {
      ElMessage.error(res.message || '更新失败')
    }
  } catch (error) {
    console.error('更新失败:', error)
    ElMessage.error('更新失败')
  }
}

// ========== 撤销权限 ==========
const handleRevoke = async (row) => {
  // 检查是否有权限撤销该管理员
  if (!canRevokeAdmin(row)) {
    ElMessage.warning('您没有权限撤销该管理员')
    return
  }
  
  try {
    // ElMessageBox.confirm 会正常执行后面的代码。
    // 如果没有抛出异常，代码会继续执行 await revokeAdminRole(row.adminId)。
    // 用户点击"取消"：
    // ElMessageBox.confirm 会抛出一个错误，错误对象的值为 'cancel'。
    // 代码会进入 catch 块中
    await ElMessageBox.confirm(`确定要撤销 ${row.name} 的管理员权限吗？`, '提示', { type: 'warning' })
    const res = await revokeAdminRole(row.adminId)
    if (res.code === '200') {
      ElMessage.success('权限撤销成功')
      loadData()
    } else {
      ElMessage.error(res.message || '权限撤销失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('权限撤销失败')
    }
  }
}

// ========== 工具方法 ==========
// 获取当前用户的管理员级别显示文本
const getCurrentAdminLevelText = () => {
  const currentLevel = getCurrentAdminLevel()
  return getAdminLevelText(currentLevel)
}

// 获取权限信息标题
const getPermissionInfoTitle = () => {
  const currentLevel = getCurrentAdminLevel()
  const levelText = getAdminLevelText(currentLevel)
  return `权限说明 - ${levelText}`
}

// 获取权限信息描述
const getPermissionInfoDescription = () => {
  const currentLevel = getCurrentAdminLevel()
  
  switch (currentLevel) {
    case 'system_admin':
      return '您可以管理所有级别的管理员，包括分配、编辑和撤销权限。'
    case 'school_admin':
      return '您可以管理院级管理员和系级管理员，不能管理系统管理员和校级管理员。'
    case 'college_admin':
      return '您只能管理系级管理员，不能管理其他级别的管理员。'
    case 'department_admin':
      return '您没有管理员权限管理功能。'
    default:
      return '您没有管理员权限管理功能。'
  }
}

const getAdminLevelText = (level) => {
  const levelMap = {
    'system_admin': '系统运维管理员',
    'school_admin': '校级管理员',
    'college_admin': '院级管理员',
    'department_admin': '系级管理员'
  }
  return levelMap[level] || level
}

const getAdminLevelType = (level) => {
  const typeMap = {
    'system_admin': 'danger',
    'school_admin': 'warning',
    'college_admin': 'primary',
    'department_admin': 'success'
  }
  return typeMap[level] || 'info'
}

const getOriginalRoleText = (role) => {
  // 如果角色为null或空，返回空字符串
  if (!role || role.trim() === '') {
    return ''
  }
  
  const roleMap = {
    'teacher': '教师',
    'supervisor': '督导',
    'leader': '领导'
  }
  return roleMap[role] || role
}

const getOriginalRoleType = (role) => {
  // 如果角色为null或空，返回空字符串（不显示标签）
  if (!role || role.trim() === '') {
    return ''
  }
  
  const typeMap = {
    'teacher': 'primary',
    'supervisor': 'warning',
    'leader': 'success'
  }
  return typeMap[role] || 'info'
}

// 解析角色字符串为数组
const getRoleList = (roleString) => {
  if (!roleString || roleString.trim() === '') {
    return []
  }
  // .filter(role => role)：用于筛选出数组中非空的字符串，确保最终结果中没有空字符串。
  return roleString.split(',').map(role => role.trim()).filter(role => role)
}

// ========== 学院/系数据加载 ==========
const loadCollegeList = async () => {
  try {
    const res = await getCollegeList()
    if (res.code === '200') {
      collegeList.value = res.data || []
    }
  } catch (error) {
    console.error('获取学院列表失败:', error)
  }
}

// 获取系列表
const loadDepartmentList = async (collegeId) => {
  if (!collegeId) {
    departmentList.value = []
    return
  }
  try {
    const res = await getDepartmentList(collegeId)
    if (res.code === '200') {
      departmentList.value = res.data || []
    }
  } catch (error) {
    console.error('获取系列表失败:', error)
  }
}

// ========== 分配/编辑表单的级联事件处理 ==========
const handleAssignLevelChange = (adminLevel) => {
  // 清空学院和系的选择
  assignForm.collegeId = ''
  assignForm.departmentId = ''
  departmentList.value = []
  
  // 清除相关字段的验证错误
  if (assignFormRef.value) {
    assignFormRef.value.clearValidate(['collegeId', 'departmentId'])
  }
}

const handleAssignCollegeChange = (collegeId) => {
  assignForm.departmentId = ''
  loadDepartmentList(collegeId)
  
  // 清除系字段的验证错误
  if (assignFormRef.value) {
    assignFormRef.value.clearValidate(['departmentId'])
  }
}

// 编辑权限相关的事件处理
const handleEditLevelChange = (adminLevel) => {
  // 清空学院和系的选择
  editForm.collegeId = ''
  editForm.departmentId = ''
  departmentList.value = []
  
  // 清除相关字段的验证错误
  if (editFormRef.value) {
    editFormRef.value.clearValidate(['collegeId', 'departmentId'])
  }
}

const handleEditCollegeChange = (collegeId) => {
  editForm.departmentId = ''
  loadDepartmentList(collegeId)
  
  // 清除系字段的验证错误
  if (editFormRef.value) {
    editFormRef.value.clearValidate(['departmentId'])
  }
}

// ========== 表单清理和重置方法 ==========
// 清理分配表单
const clearAssignForm = () => {
  Object.assign(assignForm, {
    adminLevel: '',
    status: 1,
    collegeId: '',
    departmentId: ''
  })
  departmentList.value = []
  
  // 清除表单验证错误
  if (assignFormRef.value) {
    assignFormRef.value.clearValidate()
  }
}

// 清理编辑表单
const clearEditForm = () => {
  Object.assign(editForm, {
    adminId: '',
    name: '',
    adminLevel: '',
    status: 1,
    collegeId: '',
    departmentId: ''
  })
  departmentList.value = []
  
  // 清除表单验证错误
  if (editFormRef.value) {
    editFormRef.value.clearValidate()
  }
}

// ========== 对话框关闭处理 ==========
// 处理分配对话框关闭
const handleAssignDialogClose = () => {
  assignDialogVisible.value = false
  selectedUser.value = null
  clearAssignForm()
}

// 处理编辑对话框关闭
const handleEditDialogClose = () => {
  editDialogVisible.value = false
  clearEditForm()
}

// ========== 页面初始化 ==========
onMounted(() => {
  // 检查当前用户是否有管理员权限管理功能
  const currentLevel = getCurrentAdminLevel()
  if (currentLevel === 'department_admin' || !['system_admin', 'school_admin', 'college_admin'].includes(currentLevel)) {
    ElMessage.warning('您没有管理员权限管理功能')
    return
  }
  
  loadData()
  loadCollegeList()
})
</script>

<style scoped>
/* 页面整体布局 */
.admin-management { padding: 20px; }

/* 卡片头部样式 */
.card-header { display: flex; justify-content: space-between; align-items: center; }
.header-left { display: flex; align-items: center; }

/* 权限信息样式 */
.permission-info { margin-bottom: 20px; }

/* 搜索区域样式 */
.search-area { margin-bottom: 20px; padding: 20px; background-color: #f5f7fa; border-radius: 4px; }
.search-area .el-form { display: flex; flex-wrap: wrap; gap: 10px; align-items: flex-end; }
.search-area .el-form-item { margin-bottom: 0; margin-right: 0; }

/* 分页样式 */
.pagination { margin-top: 20px; text-align: right; }

/* 分配权限对话框内容样式 */
.assign-dialog-content { /* 移除固定高度和滚动条 */ }

/* 用户搜索区域样式 */
.user-search { margin-bottom: 20px; padding: 15px; background-color: #f5f7fa; border-radius: 4px; }
.user-search .el-form { display: flex; flex-wrap: wrap; gap: 10px; align-items: flex-end; }
.user-search .el-form-item { margin-bottom: 0; margin-right: 0; }

/* 用户列表样式 */
.user-list { margin-bottom: 20px; }

/* 权限分配/编辑表单样式 */
.permission-form { padding: 15px; background-color: #f0f9ff; border-radius: 4px; }
.permission-form .el-form-item { margin-bottom: 20px; }
.permission-form .el-select { width: 100%; }

/* 对话框内容自适应高度 */
.el-dialog__body { padding: 20px; max-height: 80vh; }
.el-dialog__footer { padding: 10px 20px 20px; }
.el-dialog { display: flex; flex-direction: column; }
.el-dialog__body { flex: 1; overflow: visible; }
</style> 