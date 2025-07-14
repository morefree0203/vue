<template>
  <div class="permission-assignment">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>权限分配</span>
        </div>
      </template>

      <div class="search-bar">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="用户名">
            <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
          </el-form-item>
          <el-form-item label="真实姓名">
            <el-input v-model="searchForm.realName" placeholder="请输入真实姓名" clearable />
          </el-form-item>
          <el-form-item label="角色">
            <el-select v-model="searchForm.role" placeholder="请选择角色" clearable>
              <el-option label="督导" value="supervisor" />
              <el-option label="领导" value="leader" />
              <el-option label="企业" value="enterprise" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table :data="userList" style="width: 100%;" v-loading="loading">
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="realName" label="真实姓名" width="120" />
        <el-table-column prop="roleName" label="当前角色" width="100" />
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
            <el-button size="small" type="primary" @click="assignPermissions(scope.row)">权限分配</el-button>
            <el-button 
              size="small" 
              :type="scope.row.status === 1 ? 'danger' : 'success'"
              @click="toggleUserStatus(scope.row)"
            >
              {{ scope.row.status === 1 ? '禁用' : '启用' }}
            </el-button>
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

    <!-- 权限分配对话框 -->
    <el-dialog v-model="permissionDialogVisible" title="权限分配" width="600px">
      <div v-if="selectedUser">
        <h4>用户：{{ selectedUser.realName }} ({{ selectedUser.username }})</h4>
        
        <el-form :model="permissionForm" label-width="120px" style="margin-top: 20px;">
          <el-form-item label="查看权限范围">
            <el-radio-group v-model="permissionForm.viewScope">
              <el-radio label="all">全校</el-radio>
              <el-radio label="college">本院系</el-radio>
              <el-radio label="department">本专业</el-radio>
            </el-radio-group>
          </el-form-item>
          
          <el-form-item label="评价权限">
            <el-checkbox-group v-model="permissionForm.evaluationPermissions">
              <el-checkbox label="student">学生评价</el-checkbox>
              <el-checkbox label="peer">同行评价</el-checkbox>
              <el-checkbox label="supervisor">督导评价</el-checkbox>
              <el-checkbox label="leader">领导评价</el-checkbox>
              <el-checkbox label="enterprise">企业评价</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          
          <el-form-item label="管理权限">
            <el-checkbox-group v-model="permissionForm.managementPermissions">
              <el-checkbox label="course">课程管理</el-checkbox>
              <el-checkbox label="user">用户管理</el-checkbox>
              <el-checkbox label="evaluation">评价管理</el-checkbox>
              <el-checkbox label="statistics">统计分析</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          
          <el-form-item label="特殊权限">
            <el-checkbox-group v-model="permissionForm.specialPermissions">
              <el-checkbox label="anonymous">匿名评价</el-checkbox>
              <el-checkbox label="export">数据导出</el-checkbox>
              <el-checkbox label="import">数据导入</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          
          <el-form-item label="权限有效期">
            <el-date-picker
              v-model="permissionForm.validPeriod"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          
          <el-form-item label="备注">
            <el-input v-model="permissionForm.remark" type="textarea" :rows="3" />
          </el-form-item>
        </el-form>
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
const loading = ref(false)
const userList = ref([])
const permissionDialogVisible = ref(false)
const selectedUser = ref(null)

// 搜索表单
const searchForm = reactive({
  username: '',
  realName: '',
  role: ''
})

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 权限表单
const permissionForm = reactive({
  viewScope: 'college',
  evaluationPermissions: [],
  managementPermissions: [],
  specialPermissions: [],
  validPeriod: [],
  remark: ''
})

// 初始化
onMounted(() => {
  loadUserList()
})

// 加载用户列表
const loadUserList = async () => {
  loading.value = true
  try {
    // 模拟数据
    userList.value = [
      {
        id: '1',
        username: 'supervisor001',
        realName: '张督导',
        roleName: '督导',
        departmentName: '计算机科学与技术学院',
        email: 'supervisor001@university.edu',
        phone: '13800138001',
        lastLoginTime: '2024-01-15 10:30:00',
        status: 1
      },
      {
        id: '2',
        username: 'leader001',
        realName: '李领导',
        roleName: '领导',
        departmentName: '计算机科学与技术学院',
        email: 'leader001@university.edu',
        phone: '13800138002',
        lastLoginTime: '2024-01-15 09:15:00',
        status: 1
      },
      {
        id: '3',
        username: 'enterprise001',
        realName: '王企业',
        roleName: '企业',
        departmentName: '计算机科学与技术学院',
        email: 'enterprise001@company.com',
        phone: '13800138003',
        lastLoginTime: '2024-01-14 16:45:00',
        status: 1
      }
    ]
    pagination.total = userList.value.length
  } catch (error) {
    ElMessage.error('加载用户列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.currentPage = 1
  loadUserList()
}

// 重置搜索
const resetSearch = () => {
  Object.assign(searchForm, {
    username: '',
    realName: '',
    role: ''
  })
  handleSearch()
}

// 分页处理
const handleSizeChange = (val) => {
  pagination.pageSize = val
  loadUserList()
}

const handleCurrentChange = (val) => {
  pagination.currentPage = val
  loadUserList()
}

// 分配权限
const assignPermissions = (user) => {
  selectedUser.value = user
  // 重置权限表单
  Object.assign(permissionForm, {
    viewScope: 'college',
    evaluationPermissions: [],
    managementPermissions: [],
    specialPermissions: [],
    validPeriod: [],
    remark: ''
  })
  permissionDialogVisible.value = true
}

// 保存权限
const savePermissions = async () => {
  try {
    // 这里应该调用API保存权限
    ElMessage.success('权限分配成功')
    permissionDialogVisible.value = false
  } catch (error) {
    ElMessage.error('权限分配失败')
  }
}

// 切换用户状态
const toggleUserStatus = async (user) => {
  try {
    const action = user.status === 1 ? '禁用' : '启用'
    await ElMessageBox.confirm(`确定要${action}用户"${user.realName}"吗？`, '提示', {
      type: 'warning'
    })
    
    user.status = user.status === 1 ? 0 : 1
    ElMessage.success(`${action}成功`)
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}
</script>

<style scoped>
.permission-assignment {
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