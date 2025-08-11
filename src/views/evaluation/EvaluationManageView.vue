<template>
  <div class="evaluation-manage-view">
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h2>评价管理</h2>
          <p>{{ getAdminScopeText() }}</p>
        </div>
        <div class="action-buttons">
          <el-button 
            type="primary" 
            @click="goToEnterpriseEvaluation"
            :icon="OfficeBuilding"
          >
            企业评价管理
          </el-button>
        </div>
      </div>
    </div>

    <!-- 筛选条件 -->
    <el-form :inline="true" class="filter-form">
      <el-form-item label="课程名称">
        <el-input v-model="filters.courseName" placeholder="请输入课程名称" />
      </el-form-item>
      <el-form-item label="教师姓名">
        <el-input v-model="filters.teacherName" placeholder="请输入教师姓名" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchEvaluations">搜索</el-button>
        <el-button @click="resetFilters">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 课程列表 -->
    <el-table :data="evaluationList" border stripe v-loading="loading">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="courseName" label="课程名称" min-width="150" />
      <el-table-column prop="teacherName" label="授课教师" width="120" />
      <el-table-column prop="courseType" label="课程类型" width="120" />
      <el-table-column prop="credits" label="学分" width="80" />
      <el-table-column prop="academicYear" label="学年" width="100" />
      <el-table-column prop="semester" label="学期" width="80" />
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <el-button size="small" type="primary" @click="viewDetail(scope.row)">
            查看详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="pagination.current"
      v-model:page-size="pagination.size"
      :total="pagination.total"
      :page-sizes="[10, 20, 50]"
      layout="total, sizes, prev, pager, next"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 评价详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="评价详情" width="1000px">
      <evaluation-detail-with-management 
        :evaluation-data="currentEvaluation" 
        @refresh="refreshData"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { OfficeBuilding } from '@element-plus/icons-vue'
import { getCoursesByAdminLevel, getCourseEvaluationDetail } from '@/api/schooladmin'
import EvaluationDetailWithManagement from '@/components/evaluation/EvaluationDetailWithManagement.vue'

const userStore = useUserStore()
const router = useRouter()
const evaluationList = ref([])
const detailDialogVisible = ref(false)
const currentEvaluation = ref({})
const loading = ref(false)

// 筛选条件
const filters = reactive({
  courseName: '',
  teacherName: ''
})

// 分页
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

// 获取课程
const searchEvaluations = async () => {
  try {
    loading.value = true
    const params = {
      ...filters,
      page: pagination.current,
      size: pagination.size
    }
    
    // 根据管理员级别添加不同的查询参数
    const role = userStore.userInfo?.role
    if (role === 'school_admin') {
      // 校级管理员：查询全校课程
      params.role = 'school_admin'
    } else if (role === 'college_admin') {
      // 院级管理员：查询本院课程
      params.role = 'college_admin'
      params.collegeId = userStore.userInfo?.collegeId
    } else if (role === 'department_admin') {
      // 系级管理员：查询本系课程
      params.role = 'department_admin'
      params.departmentId = userStore.userInfo?.departmentId
    }
    
    const response = await getCoursesByAdminLevel(params, userStore.userInfo)
    if (response.code === '200') {
      evaluationList.value = response.data.records
      pagination.total = response.data.total
    } else {
      ElMessage.error(response.message || '获取课程数据失败')
    }
  } catch (error) {
    console.error('获取课程数据失败:', error)
    ElMessage.error('获取课程数据失败')
  } finally {
    loading.value = false
  }
}

// 重置筛选
const resetFilters = () => {
  filters.courseName = ''
  filters.teacherName = ''
  pagination.current = 1
  searchEvaluations()
}

// 查看详情
const viewDetail = async (row) => {
  try {
    loading.value = true
    const response = await getCourseEvaluationDetail(row.courseId, userStore.userInfo)
    if (response.code === '200') {
      currentEvaluation.value = {
        ...row,
        ...response.data
      }
      detailDialogVisible.value = true
    } else {
      ElMessage.error(response.message || '获取评价详情失败')
    }
  } catch (error) {
    console.error('获取评价详情失败:', error)
    ElMessage.error('获取评价详情失败')
  } finally {
    loading.value = false
  }
}

// 刷新数据
const refreshData = async () => {
  // 如果当前有打开的详情对话框，重新获取该课程的评价详情
  if (detailDialogVisible.value && currentEvaluation.value.courseId) {
    try {
      loading.value = true
      const response = await getCourseEvaluationDetail(currentEvaluation.value.courseId, userStore.userInfo)
      if (response.code === '200') {
        currentEvaluation.value = {
          ...currentEvaluation.value,
          ...response.data
        }
      } else {
        ElMessage.error(response.message || '获取评价详情失败')
      }
    } catch (error) {
      console.error('获取评价详情失败:', error)
      ElMessage.error('获取评价详情失败')
    } finally {
      loading.value = false
    }
  }
  
}

// 获取管理员权限范围文本
const getAdminScopeText = () => {
  const role = userStore.userInfo?.role
  const scopeMap = {
    'school_admin': '查看并管理全校所有课程的教学评价信息，处理恶意评价、不良评价',
    'college_admin': '查看并管理本院所有课程的教学评价信息，处理恶意评价、不良评价',
    'department_admin': '查看并管理本系所有课程的教学评价信息，处理恶意评价、不良评价'
  }
  return scopeMap[role] || '查看并管理课程的教学评价信息，处理恶意评价、不良评价'
}

// 跳转到企业评价管理页面
const goToEnterpriseEvaluation = () => {
  router.push('/evaluation/enterprise-manage')
}



// 分页处理
const handleSizeChange = (size) => {
  pagination.size = size
  pagination.current = 1
  searchEvaluations()
}

const handleCurrentChange = (current) => {
  pagination.current = current
  searchEvaluations()
}

onMounted(() => {
  searchEvaluations()
})
</script>

<style scoped>
.evaluation-manage-view {
  padding: 24px;
  background: #fff;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.title-section h2 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 24px;
}

.title-section p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.filter-form {
  margin-bottom: 24px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}
</style> 