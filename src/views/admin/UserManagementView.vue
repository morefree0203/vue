<template>
  <div class="user-management-view">
    <el-card>
      <div class="header">
        <span class="title">用户管理</span>
        <el-button type="primary" @click="openAddDialog">新增用户</el-button>
      </div>
      <el-table :data="userList" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="realName" label="姓名" />
        <el-table-column prop="role" label="角色">
          <template #default="scope">
            <el-tag>{{ getRoleDisplayName(scope.row.role) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button size="small" @click="openEditDialog(scope.row)">编辑</el-button>
            <el-button size="small" @click="openRoleDialog(scope.row)">分配角色</el-button>
            <el-button size="small" type="danger" @click="deleteUser(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 新增/编辑用户对话框 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="姓名" prop="realName">
          <el-input v-model="form.realName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item v-if="!form.id" label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" v-model="roleDialogVisible">
      <el-select v-model="selectedRole" placeholder="请选择角色" style="width: 200px;">
        <el-option v-for="role in roleList" :key="role.value" :label="role.label" :value="role.value" />
      </el-select>
      <template #footer>
        <el-button @click="roleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="assignRole">分配</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'

const userList = ref([])
const loading = ref(false)

const dialogVisible = ref(false)
const dialogTitle = ref('')
const form = reactive({
  id: null,
  username: '',
  realName: '',
  email: '',
  phone: '',
  password: ''
})
const formRef = ref(null)
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  realName: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

const roleDialogVisible = ref(false)
const selectedUserId = ref(null)
const selectedRole = ref('')
const roleList = [
  { value: 'system_admin', label: '系统管理员' },
  { value: 'college_admin', label: '学院管理员' },
  { value: 'department_admin', label: '系管理员' },
  { value: 'teacher', label: '教师' },
  { value: 'student', label: '学生' },
  { value: 'enterprise', label: '企业导师' },
  { value: 'leader', label: '校领导' },
  { value: 'supervisor', label: '督导员' }
]

function getRoleDisplayName(role) {
  const found = roleList.find(r => r.value === role)
  return found ? found.label : role
}

// 获取用户列表
const fetchUsers = async () => {
  loading.value = true
  try {
    const res = await axios.get('/api/admin/user/list')
    userList.value = res.data.data || []
  } catch (e) {
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 打开新增对话框
const openAddDialog = () => {
  dialogTitle.value = '新增用户'
  Object.assign(form, { id: null, username: '', realName: '', email: '', phone: '', password: '' })
  dialogVisible.value = true
}
// 打开编辑对话框
const openEditDialog = (row) => {
  dialogTitle.value = '编辑用户'
  Object.assign(form, { ...row, password: '' })
  dialogVisible.value = true
}
// 提交表单
const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return
    try {
      if (form.id) {
        // 编辑
        await axios.post('/api/admin/user/update', form)
        ElMessage.success('编辑成功')
      } else {
        // 新增
        await axios.post('/api/admin/user/add', form)
        ElMessage.success('新增成功')
      }
      dialogVisible.value = false
      fetchUsers()
    } catch (e) {
      ElMessage.error('操作失败')
    }
  })
}
// 删除用户
const deleteUser = (id) => {
  ElMessageBox.confirm('确定删除该用户吗？', '提示', { type: 'warning' })
    .then(async () => {
      await axios.post('/api/admin/user/delete', { id })
      ElMessage.success('删除成功')
      fetchUsers()
    })
    .catch(() => {})
}
// 打开分配角色对话框
const openRoleDialog = (row) => {
  selectedUserId.value = row.id
  selectedRole.value = row.role
  roleDialogVisible.value = true
}
// 分配角色
const assignRole = async () => {
  try {
    await axios.post('/api/admin/user/assignRole', { id: selectedUserId.value, role: selectedRole.value })
    ElMessage.success('分配成功')
    roleDialogVisible.value = false
    fetchUsers()
  } catch (e) {
    ElMessage.error('分配失败')
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.user-management-view {
  padding: 24px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.title {
  font-size: 20px;
  font-weight: bold;
}
</style> 