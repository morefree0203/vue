<template>
  <div class="evaluation-indicators">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>评价指标管理</span>
          <el-button type="primary" @click="showAddIndicatorDialog">添加指标</el-button>
        </div>
      </template>

      <el-tabs v-model="activeTab" type="border-card">
        <!-- 学生评价指标 -->
        <el-tab-pane label="学生评价指标" name="student">
          <div class="tab-content">
                         <el-table :data="studentIndicators" style="width: 100%;" v-loading="loading">
               <el-table-column type="index" label="序号" width="60" />
               <el-table-column prop="name" label="指标名称" width="200" />
               <el-table-column prop="description" label="指标描述" />
               <el-table-column prop="weight" label="权重" width="120">
                 <template #default="scope">
                   {{ scope.row.weight }} ({{ getWeightPercentage(scope.row.weight, studentIndicators) }}%)
                 </template>
               </el-table-column>
               <el-table-column prop="maxScore" label="满分" width="80" />
               <el-table-column label="操作" width="150" fixed="right">
                 <template #default="scope">
                   <el-button size="small" @click="editIndicator(scope.row)">编辑</el-button>
                   <el-button size="small" type="danger" @click="deleteIndicator(scope.row)">删除</el-button>
                 </template>
               </el-table-column>
             </el-table>
          </div>
        </el-tab-pane>

        <!-- 同行评价指标 -->
        <el-tab-pane label="同行评价指标" name="peer">
          <div class="tab-content">
                         <el-table :data="peerIndicators" style="width: 100%;" v-loading="loading">
               <el-table-column type="index" label="序号" width="60" />
               <el-table-column prop="name" label="指标名称" width="200" />
               <el-table-column prop="description" label="指标描述" />
               <el-table-column prop="weight" label="权重" width="120">
                 <template #default="scope">
                   {{ scope.row.weight }} ({{ getWeightPercentage(scope.row.weight, peerIndicators) }}%)
                 </template>
               </el-table-column>
               <el-table-column prop="maxScore" label="满分" width="80" />
               <el-table-column label="操作" width="150" fixed="right">
                 <template #default="scope">
                   <el-button size="small" @click="editIndicator(scope.row)">编辑</el-button>
                   <el-button size="small" type="danger" @click="deleteIndicator(scope.row)">删除</el-button>
                 </template>
               </el-table-column>
             </el-table>
          </div>
        </el-tab-pane>

        <!-- 督导评价指标 -->
        <el-tab-pane label="督导评价指标" name="supervisor">
          <div class="tab-content">
                         <el-table :data="supervisorIndicators" style="width: 100%;" v-loading="loading">
               <el-table-column type="index" label="序号" width="60" />
               <el-table-column prop="name" label="指标名称" width="200" />
               <el-table-column prop="description" label="指标描述" />
               <el-table-column prop="weight" label="权重" width="120">
                 <template #default="scope">
                   {{ scope.row.weight }} ({{ getWeightPercentage(scope.row.weight, supervisorIndicators) }}%)
                 </template>
               </el-table-column>
               <el-table-column prop="maxScore" label="满分" width="80" />
               <el-table-column label="操作" width="150" fixed="right">
                 <template #default="scope">
                   <el-button size="small" @click="editIndicator(scope.row)">编辑</el-button>
                   <el-button size="small" type="danger" @click="deleteIndicator(scope.row)">删除</el-button>
                 </template>
               </el-table-column>
             </el-table>
          </div>
        </el-tab-pane>

        <!-- 领导评价指标 -->
        <el-tab-pane label="领导评价指标" name="leader">
          <div class="tab-content">
                         <el-table :data="leaderIndicators" style="width: 100%;" v-loading="loading">
               <el-table-column type="index" label="序号" width="60" />
               <el-table-column prop="name" label="指标名称" width="200" />
               <el-table-column prop="description" label="指标描述" />
               <el-table-column prop="weight" label="权重" width="120">
                 <template #default="scope">
                   {{ scope.row.weight }} ({{ getWeightPercentage(scope.row.weight, leaderIndicators) }}%)
                 </template>
               </el-table-column>
               <el-table-column prop="maxScore" label="满分" width="80" />
               <el-table-column label="操作" width="150" fixed="right">
                 <template #default="scope">
                   <el-button size="small" @click="editIndicator(scope.row)">编辑</el-button>
                   <el-button size="small" type="danger" @click="deleteIndicator(scope.row)">删除</el-button>
                 </template>
               </el-table-column>
             </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加/编辑指标对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑指标' : '添加指标'" width="600px">
             <el-form :model="indicatorForm" :rules="getIndicatorRules()" ref="indicatorFormRef" label-width="100px">
        <el-form-item label="指标名称" prop="name">
          <el-input v-model="indicatorForm.name" />
        </el-form-item>
        <el-form-item label="指标描述" prop="description">
          <el-input v-model="indicatorForm.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="权重" prop="weight">
          <el-input-number v-model="indicatorForm.weight" :min="0.1" :max="100" :precision="1" />
          <span style="margin-left: 10px; color: #909399;">相对权重</span>
        </el-form-item>
        <el-form-item label="满分" prop="maxScore">
          <el-input-number v-model="indicatorForm.maxScore" :min="1" :max="100" :precision="1" />
          <span style="margin-left: 10px; color: #909399;">分</span>
        </el-form-item>
                                   <el-form-item label="分类" prop="category" v-if="!isEdit">
            <el-select v-model="indicatorForm.category" placeholder="请选择分类">
              <el-option label="学生评价" value="Student" />
              <el-option label="同行评价" value="Peer" />
              <el-option label="督导评价" value="Supervisor" />
              <el-option label="领导评价" value="Leader" />
            </el-select>
          </el-form-item>
         <el-form-item label="分类" v-else>
           <el-input :value="getCategoryLabel(indicatorForm.category)" disabled />
         </el-form-item>
        
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveIndicator">确定</el-button> 
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getEvaluationIndicators, addEvaluationIndicator, updateEvaluationIndicator, deleteEvaluationIndicator } from '@/api/evaluation'

// 响应式数据
const activeTab = ref('student')
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const indicatorFormRef = ref()

// 指标数据
const studentIndicators = ref([])
const peerIndicators = ref([])
const supervisorIndicators = ref([])
const leaderIndicators = ref([])

// 表单数据
const indicatorForm = reactive({
  id: '',
  name: '',
  description: '',
  category: '',
  weight: 1,
  maxScore: 10
})

// 表单验证规则
const indicatorRules = {
  name: [{ required: true, message: '请输入指标名称', trigger: 'blur' }],
  description: [{ required: false, message: '请输入指标描述', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  weight: [{ required: true, message: '请输入权重', trigger: 'blur' }],
  maxScore: [{ required: true, message: '请输入满分', trigger: 'blur' }]
}

// 动态验证规则（编辑时不验证分类）
const getIndicatorRules = () => {
  const rules = { ...indicatorRules }
  if (isEdit.value) {
    delete rules.category
  }
  return rules
}

// 初始化
onMounted(() => {
  loadIndicators()
})

// 加载指标数据
const loadIndicators = async () => {
  loading.value = true
  try {
    const response = await getEvaluationIndicators()
    if (response.code === '200' && response.data) {
      // 根据分类分配数据到不同的数组
      studentIndicators.value = response.data.Student || []
      peerIndicators.value = response.data.Peer || []
      supervisorIndicators.value = response.data.Supervisor || []
      leaderIndicators.value = response.data.Leader || []
    } else {
      ElMessage.error('获取指标数据失败')
    }
  } catch (error) {
    console.error('加载指标数据失败:', error)
    ElMessage.error('加载指标数据失败')
  } finally {
    loading.value = false
  }
}

// 显示添加对话框
const showAddIndicatorDialog = () => {
  isEdit.value = false
  Object.assign(indicatorForm, {
    id: '',
    name: '',
    description: '',
    category: getCategoryByTab(activeTab.value),
    weight: 1,
    maxScore: 10
  })
  dialogVisible.value = true
}

// 编辑指标
const editIndicator = (indicator) => {
  isEdit.value = true
  Object.assign(indicatorForm, indicator)
  dialogVisible.value = true
}

// 保存指标
const saveIndicator = async () => {
  try {
    await indicatorFormRef.value.validate()
    if (isEdit.value) {
      // 更新指标
      const response = await updateEvaluationIndicator(indicatorForm.id, indicatorForm)
   
      if (response.code === '200') {
        ElMessage.success('指标更新成功')
        dialogVisible.value = false
        loadIndicators()
      } else {
        ElMessage.error(response.message || '更新失败')
      }
    } else {
      // 添加指标
      const response = await addEvaluationIndicator(indicatorForm)
      if (response.code === '200') {
        ElMessage.success('指标添加成功')
        dialogVisible.value = false
        loadIndicators()
      } else {
        ElMessage.error(response.message || '添加失败')
      }
    }
  } catch (error) {
    console.error('保存指标失败:', error)
    ElMessage.error('保存失败')
  }
}

// 删除指标
const deleteIndicator = async (indicator) => {
  try {
    await ElMessageBox.confirm(`确定要删除指标"${indicator.name}"吗？`, '提示', {
      type: 'warning'
    })
    
    const response = await deleteEvaluationIndicator(indicator.id)
    if (response.code === '200') {
      ElMessage.success('指标删除成功')
      loadIndicators()
    } else {
      ElMessage.error(response.message || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除指标失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 计算权重百分比
const getWeightPercentage = (weight, indicators) => {
  if (!indicators || indicators.length === 0) return 0
  const totalWeight = indicators.reduce((sum, item) => sum + item.weight, 0)
  return totalWeight > 0 ? ((weight / totalWeight) * 100).toFixed(1) : 0
}

// 根据标签页获取分类
const getCategoryByTab = (tab) => {
  const tabMap = {
    'student': 'Student',
    'peer': 'Peer',
    'supervisor': 'Supervisor',
    'leader': 'Leader'
  }
  return tabMap[tab] || 'Student'
}

// 获取分类标签
const getCategoryLabel = (category) => {
  const categoryMap = {
    'Student': '学生评价',
    'Peer': '同行评价',
    'Supervisor': '督导评价',
    'Leader': '领导评价'
  }
  return categoryMap[category] || category
}
</script>

<style scoped>
.evaluation-indicators {
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
</style> 