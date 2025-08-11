  <!-- 管理员查看企业教学评价查看 -->
  <template>
      <div class="view-evaluations">
        <div class="page-header">
          <h2>教学评价查看</h2>
          <el-tag :type="getScopeTagType()">{{ getScopeText() }}</el-tag>
        </div>
    
        <!-- 无权限提示 -->
        <div v-if="!hasViewPermission" class="no-permission">
          <el-empty description="您暂无查看评价的权限">
            <el-button type="primary" @click="goBack">返回</el-button>
          </el-empty>
        </div>
    
        <!-- 有权限显示评价列表 -->
        <div v-else>
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
    
          <!-- 评价列表 -->
          <el-table :data="evaluationList" border stripe v-loading="loading">
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="courseName" label="课程名称" min-width="150" />
            <el-table-column prop="teacherName" label="授课教师" width="100" />
            <el-table-column prop="courseType" label="课程类型" width="100" />
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
        </div>
        <!-- :evaluation-data="currentEvaluation" -->
        <!-- 评价详情对话框 -->
        <el-dialog v-model="detailDialogVisible" title="评价详情" width="800px">
          <evaluation-detail :evaluation-data="currentEvaluation" />
        </el-dialog>
      </div>
    </template>
    
    <script setup>
    import { ref, reactive, onMounted, computed } from 'vue'
    import { useUserStore } from '@/stores/user'
    import { ElMessage } from 'element-plus'
    import { getEvaluationsByScope, getEvaluationDetail } from '@/api/supervisor-leader'
    import EvaluationDetail from '@/components/evaluation/EvaluationDetail.vue'
    
    const userStore = useUserStore()
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
    
    // 权限检查
    const hasViewPermission = computed(() => {
      const viewScopeType = userStore.userInfo?.viewScopeType
      return viewScopeType && viewScopeType !== 'NONE'
    })
    
    // 获取权限范围文本
    const getScopeText = () => {
      const scopeType = userStore.userInfo?.viewScopeType
      const scopeMap = {
        'NONE': '无权限',
        'DEPARTMENT': '系内权限',
        'COLLEGE': '院内权限',
        'SCHOOL': '全校权限'
      }
      return scopeMap[scopeType] || '无权限'
    }
    
    // 获取权限范围标签类型
    const getScopeTagType = () => {
      const scopeType = userStore.userInfo?.viewScopeType
      const typeMap = {
      'NONE': 'warning', // 没有权限，使用警告
      'DEPARTMENT': 'success', // 部门权限，使用成功提示
      'COLLEGE': 'success', // 学院权限，使用成功提示
      'SCHOOL': 'success' // 学校权限，使用成功提示
    };
      return typeMap[scopeType] || 'default'; // 如果没有匹配的类型，使用默认样式
    }
    

    
    // 搜索评价
    const searchEvaluations = async () => {
      try {
        loading.value = true
        const params = {
          ...filters,
          page: pagination.current,
          size: pagination.size,
          // 添加用户权限信息
          viewScopeType: userStore.userInfo?.viewScopeType,
          scopeEntityId: userStore.userInfo?.scopeEntityId,
          userRole: userStore.userInfo?.role
        }
        const res = await getEvaluationsByScope(params)
        if (res.code === '200') {
          evaluationList.value = res.data.records
          pagination.total = res.data.total
        } else {
          ElMessage.error(res.message || '获取评价数据失败')
        }
      } catch (error) {
        console.error('获取评价数据失败:', error)
        ElMessage.error('获取评价数据失败')
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
        const res = await getEvaluationDetail(row.courseId)
        if (res.code === '200') {
          currentEvaluation.value = {
            ...row,
            ...res.data
          }
        detailDialogVisible.value = true
        } else {
          ElMessage.error(res.message || '获取评价详情失败')
        }
      } catch (error) {
        console.error('获取评价详情失败:', error)
        ElMessage.error('获取评价详情失败')
      } finally {
        loading.value = false
      }
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
    
    // 返回
    const goBack = () => {
      window.history.back()
    }
    
    onMounted(() => {
      if (hasViewPermission.value) {
        searchEvaluations()
      }
    })

    
    </script>
    
    <style scoped>
    .view-evaluations {
      padding: 24px;
      background: #fff;
      min-height: 100vh;
    }
    
    .page-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }
    
    .page-header h2 {
      margin: 0;
      color: #303133;
    }
    
    .no-permission {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
    }
    
    .filter-form {
      margin-bottom: 24px;
      padding: 16px;
      background: #f5f7fa;
      border-radius: 8px;
    }
    </style>