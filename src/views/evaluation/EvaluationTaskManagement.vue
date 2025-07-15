<template>
  <div class="evaluation-task-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>评价任务管理</span>
          <el-button type="primary" @click="showCreateDialog">发布评价任务</el-button>
        </div>
      </template>

      <!-- 筛选条件 -->
      <div class="filter-section">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-select v-model="filter.evaluationType" placeholder="评价类型" clearable>
              <el-option label="学生评价" value="STUDENT" />
              <el-option label="同行评价" value="PEER" />
              <el-option label="督导评价" value="SUPERVISOR" />
              <el-option label="领导评价" value="LEADER" />
              <el-option label="企业评价" value="ENTERPRISE" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select v-model="filter.semester" placeholder="学期" clearable>
              <el-option label="第一学期" value="1" />
              <el-option label="第二学期" value="2" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select v-model="filter.status" placeholder="状态" clearable>
              <el-option label="进行中" value="1" />
              <el-option label="已结束" value="0" />
              <el-option label="已暂停" value="2" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="fetchTasks">查询</el-button>
            <el-button @click="resetFilter">重置</el-button>
          </el-col>
        </el-row>
      </div>

      <!-- 任务列表 -->
      <el-table :data="taskList" v-loading="loading" style="margin-top: 20px;">
        <el-table-column prop="taskName" label="任务名称" />
        <el-table-column prop="courseName" label="课程名称" />
        <el-table-column prop="evaluationType" label="评价类型">
          <template #default="scope">
            <el-tag :type="getEvaluationTypeTag(scope.row.evaluationType)">
              {{ getEvaluationTypeName(scope.row.evaluationType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="semester" label="学期" />
        <el-table-column prop="academicYear" label="学年" />
        <el-table-column prop="startTime" label="开始时间" />
        <el-table-column prop="endTime" label="结束时间" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="getStatusTag(scope.row.status)">
              {{ getStatusName(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" @click="viewAssignments(scope.row)">查看分配</el-button>
            <el-button size="small" type="warning" @click="pauseTask(scope.row)" 
                       v-if="scope.row.status === 1">暂停</el-button>
            <el-button size="small" type="success" @click="resumeTask(scope.row)" 
                       v-if="scope.row.status === 2">恢复</el-button>
            <el-button size="small" type="danger" @click="deleteTask(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 创建任务对话框 -->
    <el-dialog title="发布评价任务" v-model="createDialogVisible" width="600px">
      <el-form :model="taskForm" :rules="taskRules" ref="taskFormRef" label-width="120px">
        <el-form-item label="任务名称" prop="taskName">
          <el-input v-model="taskForm.taskName" placeholder="请输入任务名称" />
        </el-form-item>
        <el-form-item label="课程" prop="courseId">
          <el-select v-model="taskForm.courseId" placeholder="选择课程" style="width: 100%">
            <el-option 
              v-for="course in courseList" 
              :key="course.id" 
              :label="course.courseName" 
              :value="course.id" 
            />
          </el-select>
        </el-form-item>
        <el-form-item label="评价类型" prop="evaluationType">
          <el-select v-model="taskForm.evaluationType" placeholder="选择评价类型" style="width: 100%">
            <el-option label="学生评价" value="STUDENT" />
            <el-option label="同行评价" value="PEER" />
            <el-option label="督导评价" value="SUPERVISOR" />
            <el-option label="领导评价" value="LEADER" />
            <el-option label="企业评价" value="ENTERPRISE" />
          </el-select>
        </el-form-item>
        <el-form-item label="学期" prop="semester">
          <el-select v-model="taskForm.semester" placeholder="选择学期" style="width: 100%">
            <el-option label="第一学期" value="1" />
            <el-option label="第二学期" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="学年" prop="academicYear">
          <el-input v-model="taskForm.academicYear" placeholder="如：2024-2025" />
        </el-form-item>
        <el-form-item label="评价时间" prop="evaluationTime">
          <el-date-picker
            v-model="taskForm.evaluationTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="目标范围" prop="targetScope">
          <el-radio-group v-model="taskForm.targetScope">
            <el-radio label="SCHOOL">全校</el-radio>
            <el-radio label="COLLEGE">指定学院</el-radio>
            <el-radio label="DEPARTMENT">指定系</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="目标学院" v-if="taskForm.targetScope === 'COLLEGE' || taskForm.targetScope === 'DEPARTMENT'">
          <el-select v-model="taskForm.targetCollegeId" placeholder="选择学院" style="width: 100%">
            <el-option 
              v-for="college in collegeList" 
              :key="college.id" 
              :label="college.name" 
              :value="college.id" 
            />
          </el-select>
        </el-form-item>
        <el-form-item label="目标系" v-if="taskForm.targetScope === 'DEPARTMENT'">
          <el-select v-model="taskForm.targetDepartmentId" placeholder="选择系" style="width: 100%">
            <el-option 
              v-for="dept in departmentList" 
              :key="dept.id" 
              :label="dept.name" 
              :value="dept.id" 
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="createTask" :loading="creating">发布任务</el-button>
      </template>
    </el-dialog>

    <!-- 任务分配对话框 -->
    <el-dialog title="任务分配详情" v-model="assignmentDialogVisible" width="800px">
      <el-table :data="assignmentList" v-loading="assignmentLoading">
        <el-table-column prop="evaluatorName" label="评价者" />
        <el-table-column prop="evaluatorType" label="评价者类型">
          <template #default="scope">
            {{ getEvaluatorTypeName(scope.row.evaluatorType) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : scope.row.status === 2 ? 'danger' : 'info'">
              {{ scope.row.status === 1 ? '已完成' : scope.row.status === 2 ? '已过期' : '未完成' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="submitTime" label="提交时间" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const loading = ref(false)
const creating = ref(false)
const assignmentLoading = ref(false)
const createDialogVisible = ref(false)
const assignmentDialogVisible = ref(false)
const taskFormRef = ref()

// 数据列表
const taskList = ref([])
const courseList = ref([])
const collegeList = ref([])
const departmentList = ref([])
const assignmentList = ref([])

// 筛选条件
const filter = reactive({
  evaluationType: '',
  semester: '',
  status: ''
})

// 任务表单
const taskForm = reactive({
  taskName: '',
  courseId: '',
  evaluationType: '',
  semester: '',
  academicYear: '',
  evaluationTime: [],
  targetScope: 'SCHOOL',
  targetCollegeId: '',
  targetDepartmentId: ''
})

// 表单验证规则
const taskRules = {
  taskName: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
  courseId: [{ required: true, message: '请选择课程', trigger: 'change' }],
  evaluationType: [{ required: true, message: '请选择评价类型', trigger: 'change' }],
  semester: [{ required: true, message: '请选择学期', trigger: 'change' }],
  academicYear: [{ required: true, message: '请输入学年', trigger: 'blur' }],
  evaluationTime: [{ required: true, message: '请选择评价时间', trigger: 'change' }],
  targetScope: [{ required: true, message: '请选择目标范围', trigger: 'change' }]
}

// 获取任务列表
const fetchTasks = async () => {
  loading.value = true
  try {
    // 这里应该调用API获取任务列表
    // const res = await getEvaluationTasks(filter)
    // taskList.value = res.data
    
    // 模拟数据
    taskList.value = [
      {
        id: '1',
        taskName: '2024年第一学期学生评价',
        courseName: '高等数学',
        evaluationType: 'STUDENT',
        semester: '1',
        academicYear: '2024-2025',
        startTime: '2024-12-01 00:00:00',
        endTime: '2024-12-31 23:59:59',
        status: 1
      }
    ]
  } catch (error) {
    ElMessage.error('获取任务列表失败')
  } finally {
    loading.value = false
  }
}

// 获取课程列表
const fetchCourses = async () => {
  try {
    // 这里应该调用API获取课程列表
    courseList.value = [
      { id: '1', courseName: '高等数学' },
      { id: '2', courseName: '线性代数' }
    ]
  } catch (error) {
    ElMessage.error('获取课程列表失败')
  }
}

// 获取学院列表
const fetchColleges = async () => {
  try {
    collegeList.value = [
      { id: '1', name: '计算机学院' },
      { id: '2', name: '数学学院' }
    ]
  } catch (error) {
    ElMessage.error('获取学院列表失败')
  }
}

// 获取系列表
const fetchDepartments = async () => {
  try {
    departmentList.value = [
      { id: '1', name: '计算机科学与技术系' },
      { id: '2', name: '软件工程系' }
    ]
  } catch (error) {
    ElMessage.error('获取系列表失败')
  }
}

// 显示创建对话框
const showCreateDialog = () => {
  createDialogVisible.value = true
  resetTaskForm()
}

// 重置任务表单
const resetTaskForm = () => {
  Object.assign(taskForm, {
    taskName: '',
    courseId: '',
    evaluationType: '',
    semester: '',
    academicYear: '',
    evaluationTime: [],
    targetScope: 'SCHOOL',
    targetCollegeId: '',
    targetDepartmentId: ''
  })
}

// 创建任务
const createTask = async () => {
  try {
    await taskFormRef.value.validate()
    creating.value = true
    
    // 这里应该调用API创建任务
    // await createEvaluationTask(taskForm)
    
    ElMessage.success('任务发布成功')
    createDialogVisible.value = false
    fetchTasks()
  } catch (error) {
    ElMessage.error('任务发布失败')
  } finally {
    creating.value = false
  }
}

// 查看任务分配
const viewAssignments = async (task) => {
  assignmentDialogVisible.value = true
  assignmentLoading.value = true
  
  try {
    // 这里应该调用API获取任务分配详情
    // const res = await getTaskAssignments(task.id)
    // assignmentList.value = res.data
    
    // 模拟数据
    assignmentList.value = [
      {
        evaluatorName: '张三',
        evaluatorType: 'STUDENT',
        status: 1,
        submitTime: '2024-12-15 10:30:00'
      }
    ]
  } catch (error) {
    ElMessage.error('获取分配详情失败')
  } finally {
    assignmentLoading.value = false
  }
}

// 暂停任务
const pauseTask = async (task) => {
  try {
    await ElMessageBox.confirm('确定要暂停该任务吗？', '提示', {
      type: 'warning'
    })
    
    // 这里应该调用API暂停任务
    // await pauseEvaluationTask(task.id)
    
    ElMessage.success('任务已暂停')
    fetchTasks()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}

// 恢复任务
const resumeTask = async (task) => {
  try {
    // 这里应该调用API恢复任务
    // await resumeEvaluationTask(task.id)
    
    ElMessage.success('任务已恢复')
    fetchTasks()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 删除任务
const deleteTask = async (task) => {
  try {
    await ElMessageBox.confirm('确定要删除该任务吗？删除后不可恢复！', '警告', {
      type: 'warning'
    })
    
    // 这里应该调用API删除任务
    // await deleteEvaluationTask(task.id)
    
    ElMessage.success('任务已删除')
    fetchTasks()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 重置筛选条件
const resetFilter = () => {
  Object.assign(filter, {
    evaluationType: '',
    semester: '',
    status: ''
  })
  fetchTasks()
}

// 获取评价类型标签样式
const getEvaluationTypeTag = (type) => {
  const tagMap = {
    'STUDENT': 'primary',
    'PEER': 'success',
    'SUPERVISOR': 'warning',
    'LEADER': 'danger',
    'ENTERPRISE': 'info'
  }
  return tagMap[type] || 'info'
}

// 获取评价类型名称
const getEvaluationTypeName = (type) => {
  const nameMap = {
    'STUDENT': '学生评价',
    'PEER': '同行评价',
    'SUPERVISOR': '督导评价',
    'LEADER': '领导评价',
    'ENTERPRISE': '企业评价'
  }
  return nameMap[type] || type
}

// 获取状态标签样式
const getStatusTag = (status) => {
  const tagMap = {
    1: 'success',
    0: 'info',
    2: 'warning'
  }
  return tagMap[status] || 'info'
}

// 获取状态名称
const getStatusName = (status) => {
  const nameMap = {
    1: '进行中',
    0: '已结束',
    2: '已暂停'
  }
  return nameMap[status] || '未知'
}

// 获取评价者类型名称
const getEvaluatorTypeName = (type) => {
  const nameMap = {
    'STUDENT': '学生',
    'TEACHER': '教师',
    'SUPERVISOR': '督导',
    'LEADER': '领导',
    'ENTERPRISE': '企业'
  }
  return nameMap[type] || type
}

onMounted(() => {
  fetchTasks()
  fetchCourses()
  fetchColleges()
  fetchDepartments()
})
</script>

<style scoped>
.evaluation-task-management {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-section {
  margin-bottom: 20px;
}

.el-form-item {
  margin-bottom: 20px;
}
</style> 