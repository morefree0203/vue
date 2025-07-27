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
        <el-table :data="evaluationList" border stripe>
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column prop="courseName" label="课程名称" min-width="120" />
          <el-table-column prop="teacherName" label="授课教师" width="100" />
          <el-table-column prop="evaluationType" label="评价类型" width="100">
            <template #default="scope">
              <el-tag :type="getEvaluationTypeTag(scope.row.evaluationType)">
                {{ getEvaluationTypeText(scope.row.evaluationType) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="avgScore" label="平均分" width="80" />
          <el-table-column prop="evaluationCount" label="评价数量" width="100" />
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
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
  
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
  import { getEvaluationsByScope } from '@/api/supervisor-leader'
  import EvaluationDetail from '@/components/evaluation/EvaluationDetail.vue'
  
  const userStore = useUserStore()
  const evaluationList = ref([])
  const detailDialogVisible = ref(false)
  const currentEvaluation = ref({})
  



  const mockData = [
  {
    id: 1,
    courseName: '高等数学',
    teacherName: '张老师',
    evaluationType: 'supervisor',
    avgScore: 4.5,
    evaluationCount: 3,
    createTime: '2024-07-01 10:00',
    evaluations: [
      {
        id: 101,
        evaluatorName: '李督导',
        isAnonymous: false,
        createTime: '2024-07-01 10:00',
        scores: [
          { indicatorName: '教学组织', score: 5 },
          { indicatorName: '课堂管理', score: 4 }
        ],
        comment: '老师讲得很细致，课堂气氛好。',
        images: []
      }
    ]
  },
  {
    id: 2,
    courseName: '大学英语',
    teacherName: '王老师',
    evaluationType: 'leader',
    avgScore: 4.8,
    evaluationCount: 2,
    createTime: '2024-07-02 09:30',
    evaluations: [
      {
        id: 102,
        evaluatorName: '王院长',
        isAnonymous: true,
        createTime: '2024-07-02 09:30',
        scores: [
          { indicatorName: '教学内容', score: 5 },
          { indicatorName: '教学技能', score: 5 }
        ],
        comment: '内容充实，表达清晰。',
        images: [
          'https://img2.baidu.com/it/u=123456789,123456789&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
        ]
      }
    ]
  }
]



  // 筛选条件
  const filters = reactive({
    courseName: '',
    teacherName: ''
  })
  
  // 分页
  const pagination = reactive({
    current: 1,
    size: 20,
    total: 0
  })
  
  // 权限检查
  const hasViewPermission = computed(() => {
    console.log(userStore.userInfo)
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
      'NONE': 'danger',
      'DEPARTMENT': 'warning',
      'COLLEGE': 'success',
      'SCHOOL': 'primary'
    }
    return typeMap[scopeType] || 'danger'
  }
  
  // 获取评价类型标签
  const getEvaluationTypeTag = (type) => {
    const tagMap = {
      'student': 'success',
      'peer': 'primary',
      'supervisor': 'warning',
      'leader': 'info'
    }
    return tagMap[type] || 'default'
  }
  
  // 获取评价类型文本
  const getEvaluationTypeText = (type) => {
    const textMap = {
      'student': '学生评价',
      'peer': '同行评价',
      'supervisor': '督导评价',
      'leader': '领导评价'
    }
    return textMap[type] || '未知'
  }
  
  // 搜索评价
  const searchEvaluations = async () => {
    try {
      const params = {
        ...filters,
        page: pagination.current,
        size: pagination.size
      }
      const res = await getEvaluationsByScope(params)
      if (res.code === '200') {
        evaluationList.value = res.data.records
        pagination.total = res.data.total
      }
    } catch (error) {
      ElMessage.error('获取评价数据失败')
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
  const viewDetail = (row) => {
    currentEvaluation.value = row
    detailDialogVisible.value = true
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
  
  // onMounted(() => {
  //   if (hasViewPermission.value) {
  //     searchEvaluations()
  //   }
  // })
  onMounted(() => {
  if (hasViewPermission.value) {
    // searchEvaluations()
    evaluationList.value = mockData
    pagination.total = mockData.length
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