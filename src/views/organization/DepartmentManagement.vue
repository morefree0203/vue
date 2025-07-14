<template>
  <div class="department-management">
    <el-card>
      <div class="header">
        <span class="title">系管理</span>
        <el-button type="primary" @click="openAddDialog">新增系</el-button>
      </div>
      <el-table :data="departmentList" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="系名称" />
        <el-table-column prop="collegeName" label="所属学院" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button size="small" @click="openEditDialog(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteDepartment(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 新增/编辑对话框 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="系名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入系名称" />
        </el-form-item>
        <el-form-item label="所属学院" prop="collegeId">
          <el-select v-model="form.collegeId" placeholder="请选择所属学院">
            <el-option v-for="college in collegeList" :key="college.id" :label="college.name" :value="college.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'

// 系列表
const departmentList = ref([])
const loading = ref(false)
// 学院列表
const collegeList = ref([])

// 对话框相关
const dialogVisible = ref(false)
const dialogTitle = ref('')
const form = reactive({
  id: null,
  name: '',
  collegeId: '',
  description: ''
})
const formRef = ref(null)
const rules = {
  name: [
    { required: true, message: '请输入系名称', trigger: 'blur' }
  ],
  collegeId: [
    { required: true, message: '请选择所属学院', trigger: 'change' }
  ]
}

// 获取系列表
const fetchDepartments = async () => {
  loading.value = true
  try {
    const res = await axios.get('/api/organization/department/list')
    departmentList.value = res.data.data || []
  } catch (e) {
    ElMessage.error('获取系列表失败')
  } finally {
    loading.value = false
  }
}
// 获取学院列表
const fetchColleges = async () => {
  try {
    const res = await axios.get('/api/organization/college/list')
    collegeList.value = res.data.data || []
  } catch (e) {
    ElMessage.error('获取学院列表失败')
  }
}

// 打开新增对话框
const openAddDialog = () => {
  dialogTitle.value = '新增系'
  Object.assign(form, { id: null, name: '', collegeId: '', description: '' })
  dialogVisible.value = true
}
// 打开编辑对话框
const openEditDialog = (row) => {
  dialogTitle.value = '编辑系'
  Object.assign(form, row)
  dialogVisible.value = true
}
// 提交表单
const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return
    try {
      if (form.id) {
        // 编辑
        await axios.post('/api/organization/department/update', form)
        ElMessage.success('编辑成功')
      } else {
        // 新增
        await axios.post('/api/organization/department/add', form)
        ElMessage.success('新增成功')
      }
      dialogVisible.value = false
      fetchDepartments()
    } catch (e) {
      ElMessage.error('操作失败')
    }
  })
}
// 删除系
const deleteDepartment = (id) => {
  ElMessageBox.confirm('确定删除该系吗？', '提示', { type: 'warning' })
    .then(async () => {
      await axios.post('/api/organization/department/delete', { id })
      ElMessage.success('删除成功')
      fetchDepartments()
    })
    .catch(() => {})
}

onMounted(() => {
  fetchDepartments()
  fetchColleges()
})
</script>

<style scoped>
.department-management {
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