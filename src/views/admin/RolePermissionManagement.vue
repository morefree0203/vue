<template>
  <div class="role-permission-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>角色权限管理</span>
          <el-button type="primary" @click="showAddRoleDialog">添加角色</el-button>
        </div>
      </template>
      
      <el-tabs v-model="activeTab" type="border-card">
        <!-- 角色管理 -->
        <el-tab-pane label="角色管理" name="roles">
          <div class="tab-content">
            <el-table :data="roleList" style="width: 100%;" v-loading="loading">
              <el-table-column prop="roleName" label="角色名称" width="150" />
              <el-table-column prop="roleCode" label="角色代码" width="120" />
              <el-table-column prop="description" label="角色描述" />
              <el-table-column prop="userCount" label="用户数量" width="100" />
              <el-table-column prop="createTime" label="创建时间" width="150" />
              <el-table-column prop="status" label="状态" width="80">
                <template #default="scope">
                  <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
                    {{ scope.row.status === 1 ? '启用' : '禁用' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200" fixed="right">
                <template #default="scope">
                  <el-button size="small" @click="editRole(scope.row)">编辑</el-button>
                  <el-button size="small" type="primary" @click="managePermissions(scope.row)">权限设置</el-button>
                  <el-button 
                    size="small" 
                    type="danger" 
                    @click="deleteRole(scope.row)"
                    :disabled="scope.row.isSystem"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>

        <!-- 权限管理 -->
        <el-tab-pane label="权限管理" name="permissions">
          <div class="tab-content">
            <el-table :data="permissionList" style="width: 100%;">
              <el-table-column prop="permissionName" label="权限名称" width="200" />
              <el-table-column prop="permissionCode" label="权限代码" width="150" />
              <el-table-column prop="module" label="所属模块" width="120" />
              <el-table-column prop="description" label="权限描述" />
              <el-table-column prop="createTime" label="创建时间" width="150" />
              <el-table-column label="操作" width="150" fixed="right">
                <template #default="scope">
                  <el-button size="small" @click="editPermission(scope.row)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deletePermission(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>

        <!-- 管理员设置 -->
        <el-tab-pane label="管理员设置" name="admins">
          <div class="tab-content">
            <div class="admin-stats">
              <el-row :gutter="20">
                <el-col :span="6">
                  <el-card class="stat-card">
                    <div class="stat-content">
                      <div class="stat-number">{{ adminStats.schoolAdminCount }}</div>
                      <div class="stat-label">校级管理员</div>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="6">
                  <el-card class="stat-card">
                    <div class="stat-content">
                      <div class="stat-number">{{ adminStats.collegeAdminCount }}</div>
                      <div class="stat-label">院级管理员</div>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="6">
                  <el-card class="stat-card">
                    <div class="stat-content">
                      <div class="stat-number">{{ adminStats.departmentAdminCount }}</div>
                      <div class="stat-label">系级管理员</div>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="6">
                  <el-card class="stat-card">
                    <div class="stat-content">
                      <div class="stat-number">{{ adminStats.systemAdminCount }}</div>
                      <div class="stat-label">系统管理员</div>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </div>

            <el-table :data="adminList" style="width: 100%; margin-top: 20px;" v-loading="adminLoading">
              <el-table-column prop="username" label="用户名" width="120" />
              <el-table-column prop="realName" label="真实姓名" width="120" />
              <el-table-column prop="roleName" label="角色" width="120" />
              <el-table-column prop="departmentName" label="所属院系" width="150" />
              <el-table-column prop="email" label="邮箱" width="180" />
              <el-table-column prop="phone" label="电话" width="120" />
              <el-table-column prop="lastLoginTime" label="最后登录" width="150" />
              <el-table-column prop="status" label="状态" width="80">
                <template #default="scope">
                  <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
                    {{ scope.row.status === 1 ? '正常' : '禁用' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200" fixed="right">
                <template #default="scope">
                  <el-button size="small" @click="editAdmin(scope.row)">编辑</el-button>
                  <el-button 
                    size="small" 
                    :type="scope.row.status === 1 ? 'danger' : 'success'"
                    @click="toggleAdminStatus(scope.row)"
                  >
                    {{ scope.row.status === 1 ? '禁用' : '启用' }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加/编辑角色对话框 -->
    <el-dialog v-model="roleDialogVisible" :title="isEditRole ? '编辑角色' : '添加角色'" width="500px">
      <el-form :model="roleForm" :rules="roleRules" ref="roleFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" />
        </el-form-item>
        <el-form-item label="角色代码" prop="roleCode">
          <el-input v-model="roleForm.roleCode" :disabled="isEditRole" />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="roleForm.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="角色状态" prop="status">
          <el-radio-group v-model="roleForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="roleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveRole">确定</el-button>
      </template>
    </el-dialog>

    <!-- 权限设置对话框 -->
    <el-dialog v-model="permissionDialogVisible" title="权限设置" width="600px">
      <div v-if="selectedRole">
        <h4>角色：{{ selectedRole.roleName }}</h4>
        <el-tree
          ref="permissionTree"
          :data="permissionTreeData"
          show-checkbox
          node-key="id"
          :default-checked-keys="selectedPermissions"
          :props="{
            children: 'children',
            label: 'label'
          }"
        />
      </div>
      <template #footer>
        <el-button @click="permissionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="savePermissions">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 响应式数据
const activeTab = ref('roles')
const loading = ref(false)
const adminLoading = ref(false)
const roleList = ref([])
const permissionList = ref([])
const adminList = ref([])
const adminStats = ref({
  schoolAdminCount: 0,
  collegeAdminCount: 0,
  departmentAdminCount: 0,
  systemAdminCount: 0
})

// 对话框控制
const roleDialogVisible = ref(false)
const permissionDialogVisible = ref(false)
const isEditRole = ref(false)
const roleFormRef = ref()
const selectedRole = ref(null)
const selectedPermissions = ref([])
const permissionTree = ref()

// 表单数据
const roleForm = reactive({
  roleId: '',
  roleName: '',
  roleCode: '',
  description: '',
  status: 1
})

// 表单验证规则
const roleRules = {
  roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  roleCode: [{ required: true, message: '请输入角色代码', trigger: 'blur' }],
  description: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
}

// 权限树数据
const permissionTreeData = ref([
  {
    id: 'course',
    label: '课程管理',
    children: [
      { id: 'course:view', label: '查看课程' },
      { id: 'course:add', label: '添加课程' },
      { id: 'course:edit', label: '编辑课程' },
      { id: 'course:delete', label: '删除课程' },
      { id: 'course:assign', label: '分配教师' },
      { id: 'course:select', label: '管理选课' }
    ]
  },
  {
    id: 'evaluation',
    label: '教学评价',
    children: [
      { id: 'evaluation:view', label: '查看评价' },
      { id: 'evaluation:manage', label: '管理评价' },
      { id: 'evaluation:indicators', label: '评价指标' },
      { id: 'evaluation:delete', label: '删除评价' }
    ]
  },
  {
    id: 'organization',
    label: '组织管理',
    children: [
      { id: 'organization:college', label: '学院管理' },
      { id: 'organization:department', label: '系管理' },
      { id: 'organization:major', label: '专业管理' },
      { id: 'organization:class', label: '班级管理' }
    ]
  },
  {
    id: 'user',
    label: '用户管理',
    children: [
      { id: 'user:view', label: '查看用户' },
      { id: 'user:add', label: '添加用户' },
      { id: 'user:edit', label: '编辑用户' },
      { id: 'user:delete', label: '删除用户' },
      { id: 'user:role', label: '角色分配' }
    ]
  },
  {
    id: 'system',
    label: '系统管理',
    children: [
      { id: 'system:role', label: '角色管理' },
      { id: 'system:permission', label: '权限管理' },
      { id: 'system:settings', label: '系统设置' },
      { id: 'system:logs', label: '系统日志' }
    ]
  }
])

// 初始化
onMounted(() => {
  loadRoleList()
  loadPermissionList()
  loadAdminList()
  loadAdminStats()
})

// 加载角色列表
const loadRoleList = async () => {
  loading.value = true
  try {
    // 模拟数据
    roleList.value = [
      {
        roleId: '1',
        roleName: '系统管理员',
        roleCode: 'system_admin',
        description: '系统最高权限管理员，负责技术维护',
        userCount: 1,
        createTime: '2024-01-01 10:00:00',
        status: 1,
        isSystem: true
      },
      {
        roleId: '2',
        roleName: '校级管理员',
        roleCode: 'school_admin',
        description: '校级教务管理员，管理全校教学事务',
        userCount: 3,
        createTime: '2024-01-01 10:00:00',
        status: 1,
        isSystem: false
      },
      {
        roleId: '3',
        roleName: '院级管理员',
        roleCode: 'college_admin',
        description: '院级教务管理员，管理本院系教学事务',
        userCount: 8,
        createTime: '2024-01-01 10:00:00',
        status: 1,
        isSystem: false
      },
      {
        roleId: '4',
        roleName: '系级管理员',
        roleCode: 'department_admin',
        description: '系级教务管理员，管理本专业教学事务',
        userCount: 15,
        createTime: '2024-01-01 10:00:00',
        status: 1,
        isSystem: false
      }
    ]
  } catch (error) {
    ElMessage.error('加载角色列表失败')
  } finally {
    loading.value = false
  }
}

// 加载权限列表
const loadPermissionList = async () => {
  try {
    // 模拟数据
    permissionList.value = [
      { permissionName: '查看课程', permissionCode: 'course:view', module: '课程管理', description: '查看课程列表和详情', createTime: '2024-01-01 10:00:00' },
      { permissionName: '添加课程', permissionCode: 'course:add', module: '课程管理', description: '添加新课程', createTime: '2024-01-01 10:00:00' },
      { permissionName: '编辑课程', permissionCode: 'course:edit', module: '课程管理', description: '编辑课程信息', createTime: '2024-01-01 10:00:00' },
      { permissionName: '删除课程', permissionCode: 'course:delete', module: '课程管理', description: '删除课程', createTime: '2024-01-01 10:00:00' }
    ]
  } catch (error) {
    ElMessage.error('加载权限列表失败')
  }
}

// 加载管理员列表
const loadAdminList = async () => {
  adminLoading.value = true
  try {
    // 模拟数据
    adminList.value = [
      {
        id: '1',
        username: 'admin',
        realName: '系统管理员',
        roleName: '系统管理员',
        departmentName: '信息技术部',
        email: 'admin@university.edu',
        phone: '13800138000',
        lastLoginTime: '2024-01-15 10:30:00',
        status: 1
      },
      {
        id: '2',
        username: 'school_admin1',
        realName: '张教务',
        roleName: '校级管理员',
        departmentName: '教务处',
        email: 'zhang@university.edu',
        phone: '13800138001',
        lastLoginTime: '2024-01-15 09:15:00',
        status: 1
      }
    ]
  } catch (error) {
    ElMessage.error('加载管理员列表失败')
  } finally {
    adminLoading.value = false
  }
}

// 加载管理员统计
const loadAdminStats = async () => {
  try {
    adminStats.value = {
      schoolAdminCount: 3,
      collegeAdminCount: 8,
      departmentAdminCount: 15,
      systemAdminCount: 1
    }
  } catch (error) {
    ElMessage.error('加载统计数据失败')
  }
}

// 显示添加角色对话框
const showAddRoleDialog = () => {
  isEditRole.value = false
  Object.assign(roleForm, {
    roleId: '',
    roleName: '',
    roleCode: '',
    description: '',
    status: 1
  })
  roleDialogVisible.value = true
}

// 编辑角色
const editRole = (role) => {
  isEditRole.value = true
  Object.assign(roleForm, role)
  roleDialogVisible.value = true
}

// 保存角色
const saveRole = async () => {
  try {
    await roleFormRef.value.validate()
    
    if (isEditRole.value) {
      ElMessage.success('角色更新成功')
    } else {
      ElMessage.success('角色添加成功')
    }
    roleDialogVisible.value = false
    loadRoleList()
  } catch (error) {
    if (error !== false) {
      ElMessage.error('保存失败')
    }
  }
}

// 删除角色
const deleteRole = async (role) => {
  try {
    await ElMessageBox.confirm(`确定要删除角色"${role.roleName}"吗？`, '提示', {
      type: 'warning'
    })
    ElMessage.success('角色删除成功')
    loadRoleList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 管理权限
const managePermissions = (role) => {
  selectedRole.value = role
  // 模拟获取角色权限
  selectedPermissions.value = ['course:view', 'course:add', 'evaluation:view']
  permissionDialogVisible.value = true
}

// 保存权限
const savePermissions = async () => {
  try {
    const checkedKeys = permissionTree.value.getCheckedKeys()
    const halfCheckedKeys = permissionTree.value.getHalfCheckedKeys()
    
    // 这里应该调用API保存权限
    ElMessage.success('权限设置成功')
    permissionDialogVisible.value = false
  } catch (error) {
    ElMessage.error('权限设置失败')
  }
}

// 编辑权限
const editPermission = (permission) => {
  ElMessage.info('编辑权限功能待实现')
}

// 删除权限
const deletePermission = async (permission) => {
  try {
    await ElMessageBox.confirm(`确定要删除权限"${permission.permissionName}"吗？`, '提示', {
      type: 'warning'
    })
    ElMessage.success('权限删除成功')
    loadPermissionList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 编辑管理员
const editAdmin = (admin) => {
  ElMessage.info('编辑管理员功能待实现')
}

// 切换管理员状态
const toggleAdminStatus = async (admin) => {
  try {
    const action = admin.status === 1 ? '禁用' : '启用'
    await ElMessageBox.confirm(`确定要${action}管理员"${admin.realName}"吗？`, '提示', {
      type: 'warning'
    })
    
    admin.status = admin.status === 1 ? 0 : 1
    ElMessage.success(`${action}成功`)
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}
</script>

<style scoped>
.role-permission-management {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tab-content {
  padding: 20px 0;
}

.admin-stats {
  margin-bottom: 20px;
}

.stat-card {
  height: 100px;
}

.stat-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 8px;
}
</style> 