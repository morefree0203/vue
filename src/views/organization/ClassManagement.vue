<template>
  <div class="class-management">
    <el-card>
      <div class="header">
        <span class="title">班级管理</span>
        <el-button type="primary" @click="openAddDialog">新增班级</el-button>
      </div>
      <el-table :data="classList" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="班级名称" />
        <el-table-column prop="departmentName" label="所属系" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button size="small" @click="openEditDialog(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteClass(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 新增/编辑对话框 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="班级名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入班级名称" />
        </el-form-item>
        <el-form-item label="所属系" prop="departmentId">
          <el-select v-model="form.departmentId" placeholder="请选择所属系">
            <el-option v-for="dep in departmentList" :key="dep.id" :label="dep.name" :value="dep.id" />
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

// 班级列表
const classList = ref([])
const loading = ref(false)
// 系列表
const departmentList = ref([])

// 对话框相关
const dialogVisible = ref(false)
const dialogTitle = ref('')
const form = reactive({
  id: null,
  name: '',
  departmentId: '',
  description: ''
})
const formRef = ref(null)
const rules = {
  name: [
    { required: true, message: '请输入班级名称', trigger: 'blur' }
  ],
  departmentId: [
    { required: true, message: '请选择所属系', trigger: 'change' }
  ]
}

// 获取班级列表
const fetchClasses = async () => {
  loading.value = true
  try {
    const res = await axios.get('/api/organization/class/list')
    classList.value = res.data.data || []
  } catch (e) {
    ElMessage.error('获取班级列表失败')
  } finally {
    loading.value = false
  }
}
// 获取系列表
const fetchDepartments = async () => {
  try {
    const res = await axios.get('/api/organization/department/list')
    departmentList.value = res.data.data || []
  } catch (e) {
    ElMessage.error('获取系列表失败')
  }
}

// 打开新增对话框
const openAddDialog = () => {
  dialogTitle.value = '新增班级'
  Object.assign(form, { id: null, name: '', departmentId: '', description: '' })
  dialogVisible.value = true
}
// 打开编辑对话框
const openEditDialog = (row) => {
  dialogTitle.value = '编辑班级'
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
        await axios.post('/api/organization/class/update', form)
        ElMessage.success('编辑成功')
      } else {
        // 新增
        await axios.post('/api/organization/class/add', form)
        ElMessage.success('新增成功')
      }
      dialogVisible.value = false
      fetchClasses()
    } catch (e) {
      ElMessage.error('操作失败')
    }
  })
}
// 删除班级
const deleteClass = (id) => {
  ElMessageBox.confirm('确定删除该班级吗？', '提示', { type: 'warning' })
    .then(async () => {
      await axios.post('/api/organization/class/delete', { id })
      ElMessage.success('删除成功')
      fetchClasses()
    })
    .catch(() => {})
}

onMounted(() => {
  fetchClasses()
  fetchDepartments()
})
</script>

<style scoped>
.class-management {
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