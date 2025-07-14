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
              <el-table-column prop="indicatorCode" label="指标代码" width="120" />
              <el-table-column prop="indicatorName" label="指标名称" width="200" />
              <el-table-column prop="description" label="指标描述" />
              <el-table-column prop="weight" label="权重" width="80" />
              <el-table-column prop="maxScore" label="满分" width="80" />
              <el-table-column prop="category" label="分类" width="120" />
              <el-table-column prop="status" label="状态" width="80">
                <template #default="scope">
                  <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
                    {{ scope.row.status === 1 ? '启用' : '禁用' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200" fixed="right">
                <template #default="scope">
                  <el-button size="small" @click="editIndicator(scope.row)">编辑</el-button>
                  <el-button 
                    size="small" 
                    :type="scope.row.status === 1 ? 'danger' : 'success'"
                    @click="toggleStatus(scope.row)"
                  >
                    {{ scope.row.status === 1 ? '禁用' : '启用' }}
                  </el-button>
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
              <el-table-column prop="indicatorCode" label="指标代码" width="120" />
              <el-table-column prop="indicatorName" label="指标名称" width="200" />
              <el-table-column prop="description" label="指标描述" />
              <el-table-column prop="weight" label="权重" width="80" />
              <el-table-column prop="maxScore" label="满分" width="80" />
              <el-table-column prop="category" label="分类" width="120" />
              <el-table-column prop="status" label="状态" width="80">
                <template #default="scope">
                  <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
                    {{ scope.row.status === 1 ? '启用' : '禁用' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200" fixed="right">
                <template #default="scope">
                  <el-button size="small" @click="editIndicator(scope.row)">编辑</el-button>
                  <el-button 
                    size="small" 
                    :type="scope.row.status === 1 ? 'danger' : 'success'"
                    @click="toggleStatus(scope.row)"
                  >
                    {{ scope.row.status === 1 ? '禁用' : '启用' }}
                  </el-button>
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
              <el-table-column prop="indicatorCode" label="指标代码" width="120" />
              <el-table-column prop="indicatorName" label="指标名称" width="200" />
              <el-table-column prop="description" label="指标描述" />
              <el-table-column prop="weight" label="权重" width="80" />
              <el-table-column prop="maxScore" label="满分" width="80" />
              <el-table-column prop="category" label="分类" width="120" />
              <el-table-column prop="status" label="状态" width="80">
                <template #default="scope">
                  <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
                    {{ scope.row.status === 1 ? '启用' : '禁用' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200" fixed="right">
                <template #default="scope">
                  <el-button size="small" @click="editIndicator(scope.row)">编辑</el-button>
                  <el-button 
                    size="small" 
                    :type="scope.row.status === 1 ? 'danger' : 'success'"
                    @click="toggleStatus(scope.row)"
                  >
                    {{ scope.row.status === 1 ? '禁用' : '启用' }}
                  </el-button>
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
              <el-table-column prop="indicatorCode" label="指标代码" width="120" />
              <el-table-column prop="indicatorName" label="指标名称" width="200" />
              <el-table-column prop="description" label="指标描述" />
              <el-table-column prop="weight" label="权重" width="80" />
              <el-table-column prop="maxScore" label="满分" width="80" />
              <el-table-column prop="category" label="分类" width="120" />
              <el-table-column prop="status" label="状态" width="80">
                <template #default="scope">
                  <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
                    {{ scope.row.status === 1 ? '启用' : '禁用' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200" fixed="right">
                <template #default="scope">
                  <el-button size="small" @click="editIndicator(scope.row)">编辑</el-button>
                  <el-button 
                    size="small" 
                    :type="scope.row.status === 1 ? 'danger' : 'success'"
                    @click="toggleStatus(scope.row)"
                  >
                    {{ scope.row.status === 1 ? '禁用' : '启用' }}
                  </el-button>
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
      <el-form :model="indicatorForm" :rules="indicatorRules" ref="indicatorFormRef" label-width="100px">
        <el-form-item label="指标代码" prop="indicatorCode">
          <el-input v-model="indicatorForm.indicatorCode" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="指标名称" prop="indicatorName">
          <el-input v-model="indicatorForm.indicatorName" />
        </el-form-item>
        <el-form-item label="指标描述" prop="description">
          <el-input v-model="indicatorForm.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="权重" prop="weight">
          <el-input-number v-model="indicatorForm.weight" :min="0" :max="100" :precision="2" />
          <span style="margin-left: 10px; color: #909399;">%</span>
        </el-form-item>
        <el-form-item label="满分" prop="maxScore">
          <el-input-number v-model="indicatorForm.maxScore" :min="1" :max="100" :precision="1" />
          <span style="margin-left: 10px; color: #909399;">分</span>
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="indicatorForm.category" placeholder="请选择分类">
            <el-option label="教学态度" value="教学态度" />
            <el-option label="教学内容" value="教学内容" />
            <el-option label="教学方法" value="教学方法" />
            <el-option label="教学效果" value="教学效果" />
            <el-option label="教学管理" value="教学管理" />
          </el-select>
        </el-form-item>
        <el-form-item label="评价类型" prop="evaluationType">
          <el-select v-model="indicatorForm.evaluationType" placeholder="请选择评价类型">
            <el-option label="学生评价" value="student" />
            <el-option label="同行评价" value="peer" />
            <el-option label="督导评价" value="supervisor" />
            <el-option label="领导评价" value="leader" />
          </el-select>
        </el-form-item>
        <el-form-item label="指标状态" prop="status">
          <el-radio-group v-model="indicatorForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
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
  indicatorId: '',
  indicatorCode: '',
  indicatorName: '',
  description: '',
  weight: 10,
  maxScore: 10,
  category: '',
  evaluationType: 'student',
  status: 1
})

// 表单验证规则
const indicatorRules = {
  indicatorCode: [{ required: true, message: '请输入指标代码', trigger: 'blur' }],
  indicatorName: [{ required: true, message: '请输入指标名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入指标描述', trigger: 'blur' }],
  weight: [{ required: true, message: '请输入权重', trigger: 'blur' }],
  maxScore: [{ required: true, message: '请输入满分', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  evaluationType: [{ required: true, message: '请选择评价类型', trigger: 'change' }]
}

// 初始化
onMounted(() => {
  loadIndicators()
})

// 加载指标数据
const loadIndicators = async () => {
  loading.value = true
  try {
    // 模拟数据
    studentIndicators.value = [
      {
        indicatorId: '1',
        indicatorCode: 'ST001',
        indicatorName: '教学态度认真负责',
        description: '教师教学态度是否认真负责，是否关心学生学习情况',
        weight: 20,
        maxScore: 10,
        category: '教学态度',
        evaluationType: 'student',
        status: 1
      },
      {
        indicatorId: '2',
        indicatorCode: 'ST002',
        indicatorName: '教学内容充实',
        description: '教学内容是否充实，是否理论与实践相结合',
        weight: 25,
        maxScore: 10,
        category: '教学内容',
        evaluationType: 'student',
        status: 1
      }
    ]

    peerIndicators.value = [
      {
        indicatorId: '3',
        indicatorCode: 'PE001',
        indicatorName: '教学方法先进',
        description: '是否采用先进的教学方法和手段',
        weight: 30,
        maxScore: 10,
        category: '教学方法',
        evaluationType: 'peer',
        status: 1
      }
    ]

    supervisorIndicators.value = [
      {
        indicatorId: '4',
        indicatorCode: 'SU001',
        indicatorName: '教学管理规范',
        description: '教学管理是否规范，是否按时完成教学任务',
        weight: 25,
        maxScore: 10,
        category: '教学管理',
        evaluationType: 'supervisor',
        status: 1
      }
    ]

    leaderIndicators.value = [
      {
        indicatorId: '5',
        indicatorCode: 'LE001',
        indicatorName: '教学效果显著',
        description: '教学效果是否显著，学生掌握程度如何',
        weight: 35,
        maxScore: 10,
        category: '教学效果',
        evaluationType: 'leader',
        status: 1
      }
    ]
  } catch (error) {
    ElMessage.error('加载指标数据失败')
  } finally {
    loading.value = false
  }
}

// 显示添加对话框
const showAddIndicatorDialog = () => {
  isEdit.value = false
  Object.assign(indicatorForm, {
    indicatorId: '',
    indicatorCode: '',
    indicatorName: '',
    description: '',
    weight: 10,
    maxScore: 10,
    category: '',
    evaluationType: activeTab.value,
    status: 1
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
      ElMessage.success('指标更新成功')
    } else {
      ElMessage.success('指标添加成功')
    }
    dialogVisible.value = false
    loadIndicators()
  } catch (error) {
    if (error !== false) {
      ElMessage.error('保存失败')
    }
  }
}

// 删除指标
const deleteIndicator = async (indicator) => {
  try {
    await ElMessageBox.confirm(`确定要删除指标"${indicator.indicatorName}"吗？`, '提示', {
      type: 'warning'
    })
    ElMessage.success('指标删除成功')
    loadIndicators()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 切换状态
const toggleStatus = async (indicator) => {
  try {
    const action = indicator.status === 1 ? '禁用' : '启用'
    await ElMessageBox.confirm(`确定要${action}指标"${indicator.indicatorName}"吗？`, '提示', {
      type: 'warning'
    })
    
    indicator.status = indicator.status === 1 ? 0 : 1
    ElMessage.success(`${action}成功`)
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
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