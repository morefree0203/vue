<!-- 评价任务显示页面 可新增 -->
<template>
  <div class="evaluation-task-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <span>评价任务管理</span>
            <el-tag v-if="userStore.userInfo?.role === 'department_admin'" type="warning" style="margin-left: 10px;">
              系级管理员只能查看任务，不能发布任务
            </el-tag>
          </div>
          <el-button 
            v-if="userStore.userInfo?.role !== 'department_admin'"
            type="primary" 
            @click="showCreateDialog"
          >
            发布评价任务
          </el-button>
        </div>
      </template>

             <!-- 筛选条件 -->
       <div class="filter-section">
         <el-row :gutter="20">
           <el-col :span="8">
             <el-select v-model="filter.semester" placeholder="学期" clearable>
               <el-option label="第一学期" value="1" />
               <el-option label="第二学期" value="2" />
             </el-select>
           </el-col>
                       <el-col :span="8">
              <el-select v-model="filter.status" placeholder="状态" clearable>
                <el-option label="进行中" value="1" />
                <el-option label="已结束" value="0" />
              </el-select>
            </el-col>
           <el-col :span="8">
             <el-button type="primary" @click="fetchTasks">查询</el-button>
             <el-button @click="resetFilter">重置</el-button>
           </el-col>
         </el-row>
       </div>

             <!-- 任务列表 -->
       <el-table :data="taskList" v-loading="loading" style="margin-top: 20px;">
         <el-table-column prop="taskName" label="任务名称" />
         <el-table-column prop="courseName" label="课程名称" />
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
                         <el-table-column label="操作" width="280">
             <template #default="scope">
               <div style="display: flex; gap: 8px;">
                 <el-button size="small" @click="viewAssignments(scope.row)">查看分配</el-button>
                 <el-button size="small" type="primary" @click="showAssignDialog(scope.row)">分配</el-button>
                 <el-button size="small" type="danger" @click="deleteTask(scope.row)">删除</el-button>
               </div>
             </template>
           </el-table-column>
       </el-table>

       <!-- 分页组件 -->
       <div class="pagination-container" style="margin-top: 20px; text-align: right;">
         <el-pagination
           v-model:current-page="pagination.current"
           v-model:page-size="pagination.size"
           :page-sizes="[10, 20, 50, 100]"
           :total="pagination.total"
           layout="total, sizes, prev, pager, next, jumper"
           @size-change="handleSizeChange"
           @current-change="handleCurrentChange"
         />
       </div>
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
        <el-form-item label="目标学院" prop="targetCollegeId">
          <el-select v-model="taskForm.targetCollegeId" placeholder="选择学院（可选）" style="width: 100%" clearable @change="handleCollegeChange">
            <el-option 
              v-for="college in collegeList" 
              :key="college.id" 
              :label="college.name" 
              :value="college.id" 
            />
          </el-select>
        </el-form-item>
        <el-form-item label="目标系" prop="targetDepartmentId">
          <el-select v-model="taskForm.targetDepartmentId" placeholder="选择系（可选）" style="width: 100%" clearable>
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
      <el-dialog title="学生任务分配详情" v-model="assignmentDialogVisible" width="1000px">
        <el-table :data="assignmentList" v-loading="assignmentLoading">
          <el-table-column prop="studentName" label="学生姓名" />
          <el-table-column prop="studentId" label="学号" />
          <el-table-column prop="className" label="班级" />
          <el-table-column prop="departmentName" label="系" />
          <el-table-column prop="collegeName" label="学院" />
          <el-table-column prop="status" label="状态">
            <template #default="scope">
              <el-tag :type="scope.row.status === 1 ? 'success' : scope.row.status === 2 ? 'danger' : 'info'">
                {{ scope.row.status === 1 ? '已完成' : scope.row.status === 2 ? '已过期' : '未完成' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="分配时间" />
        </el-table>
      </el-dialog>

      <!-- 分配任务对话框 -->
      <el-dialog title="分配评价任务" v-model="assignDialogVisible" width="800px">
        <div class="assign-dialog-content">
          <div class="task-info">
            <h4>任务信息</h4>
            <p><strong>任务名称：</strong>{{ currentTask?.taskName }}</p>
            <p><strong>课程名称：</strong>{{ currentTask?.courseName }}</p>
            <p><strong>学期：</strong>{{ currentTask?.semester }}</p>
            <p><strong>学年：</strong>{{ currentTask?.academicYear }}</p>
          </div>
          
          <div class="filter-section" style="margin: 20px 0;">
            <!-- 权限提示 -->
            <div v-if="userStore.userInfo?.role === 'department_admin'" style="margin-bottom: 10px;">
              <el-alert 
                title="权限提示：系级管理员只能分配自己系的学生" 
                type="info" 
                :closable="false"
                show-icon
              />
            </div>
            <div v-else-if="userStore.userInfo?.role === 'college_admin'" style="margin-bottom: 10px;">
              <el-alert 
                title="权限提示：院级管理员只能分配自己院的学生" 
                type="info" 
                :closable="false"
                show-icon
              />
            </div>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-select 
                  v-model="studentFilter.collegeId" 
                  placeholder="选择学院" 
                  clearable 
                  @change="handleStudentFilterCollegeChange"
                  :disabled="userStore.userInfo?.role === 'department_admin'"
                >
                  <el-option 
                    v-for="college in collegeList" 
                    :key="college.id" 
                    :label="college.name" 
                    :value="college.id" 
                  />
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-select 
                  v-model="studentFilter.departmentId" 
                  placeholder="选择系" 
                  clearable 
                  @change="fetchAvailableStudents"
                  :disabled="userStore.userInfo?.role === 'college_admin' || userStore.userInfo?.role === 'department_admin'"
                >
                  <el-option 
                    v-for="dept in departmentList" 
                    :key="dept.id" 
                    :label="dept.name" 
                    :value="dept.id" 
                  />
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-input v-model="studentFilter.keyword" placeholder="搜索学生姓名或学号" @input="fetchAvailableStudents" />
              </el-col>
            </el-row>
          </div>

          <div class="student-selection">
            <div class="selection-header">
              <span>可分配学生 ({{ availableStudents.length }}人)</span>
            </div>
            
            <el-table 
              :data="availableStudents" 
              v-loading="studentsLoading"
              @selection-change="handleStudentSelectionChange"
              style="margin-top: 10px;"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column prop="studentName" label="学生姓名" />
              <el-table-column prop="studentId" label="学号" />
              <el-table-column prop="className" label="班级" />
              <el-table-column prop="departmentName" label="系" />
              <el-table-column prop="collegeName" label="学院" />
            </el-table>
          </div>
        </div>
        
        <template #footer>
          <el-button @click="assignDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="assignTaskToStudentsHandler" :loading="assigning" :disabled="selectedStudents.length === 0">
            分配任务 ({{ selectedStudents.length }}人)
          </el-button>
        </template>
      </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { getEvaluationTasks, createEvaluationTask, deleteEvaluationTask, getTaskAssignments, getCourseList, getCollegeList, getDepartmentList, getAvailableStudents, assignTaskToStudents } from '@/api/evaluationTask'

const userStore = useUserStore()
const loading = ref(false)
const creating = ref(false)
const assignmentLoading = ref(false)
const studentsLoading = ref(false)
const assigning = ref(false)
const createDialogVisible = ref(false)
const assignmentDialogVisible = ref(false)
const assignDialogVisible = ref(false)
const taskFormRef = ref()

   // 数据列表
  const taskList = ref([])
  const courseList = ref([])
  const collegeList = ref([])
  const departmentList = ref([])
  const assignmentList = ref([])
  const availableStudents = ref([])
  const selectedStudents = ref([])
  const currentTask = ref(null)

 // 分页信息
 const pagination = reactive({
   current: 1,
   size: 10,
   total: 0
 })

   // 筛选条件
  const filter = reactive({
    semester: '',
    status: ''
  })

  // 学生筛选条件
  const studentFilter = reactive({
    collegeId: '',
    departmentId: '',
    keyword: ''
  })

   // 任务表单
  const taskForm = reactive({
    taskName: '',
    courseId: '',
    semester: '',
    academicYear: '',
    evaluationTime: [],
    targetCollegeId: '',
    targetDepartmentId: ''
  })

 // 表单验证规则
 const taskRules = {
   taskName: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
   courseId: [{ required: true, message: '请选择课程', trigger: 'change' }],
   semester: [{ required: true, message: '请选择学期', trigger: 'change' }],
   academicYear: [{ required: true, message: '请输入学年', trigger: 'blur' }],
   evaluationTime: [{ required: true, message: '请选择评价时间', trigger: 'change' }]
 }

 // 获取任务列表
 const fetchTasks = async () => {
   loading.value = true
   try {
     // 构建请求参数，包含分页和筛选条件
     const params = {
       ...filter,
       pageNum: Number(pagination.current),
       pageSize: Number(pagination.size)
     }
     
     const res = await getEvaluationTasks(params, userStore.userInfo)
     if (res.code === '200') {
       // 处理分页数据
       if (res.data && res.data.records) {
         taskList.value = res.data.records
         pagination.total = res.data.total || 0
       } else {
         taskList.value = res.data || []
         pagination.total = 0
       }
     } else {
       ElMessage.error(res.message || '获取任务列表失败')
     }
   } catch (error) {
     console.error('获取任务列表失败:', error)
     ElMessage.error('获取任务列表失败')
   } finally {
     loading.value = false
   }
 }

// 获取课程列表
const fetchCourses = async () => {
  try {
    const res = await getCourseList(userStore.userInfo)
    if (res.code === '200') {
      courseList.value = res.data
    } else {
      ElMessage.error(res.message || '获取课程列表失败')
    }
  } catch (error) {
    console.error('获取课程列表失败:', error)
    ElMessage.error('获取课程列表失败')
  }
}

// 获取学院列表
const fetchColleges = async () => {
  try {
    const res = await getCollegeList(userStore.userInfo)
    if (res.code === '200') {
      collegeList.value = res.data
      
      // 如果是系级管理员，禁用学院选择
      if (userStore.userInfo?.role === 'department_admin') {
        // 系级管理员只能看到自己所在的学院
        const userCollege = collegeList.value.find(college => college.id == userStore.userInfo?.collegeId)
        if (userCollege) {
          studentFilter.collegeId = userCollege.id
        }
      }
    } else {
      ElMessage.error(res.message || '获取学院列表失败')
    }
  } catch (error) {
    console.error('获取学院列表失败:', error)
    ElMessage.error('获取学院列表失败')
  }
}

// 获取系列表
const fetchDepartments = async (collegeId) => {
  try {
    const res = await getDepartmentList(collegeId)
    if (res.code === '200') {
      departmentList.value = res.data
    } else {
      ElMessage.error(res.message || '获取系列表失败')
    }
  } catch (error) {
    console.error('获取系列表失败:', error)
    ElMessage.error('获取系列表失败')
  }
}

// 处理发布任务表单中学院变化
const handleCollegeChange = async (collegeId) => {
  // 清空系的选择
  taskForm.targetDepartmentId = ''
  // 清空系列表
  departmentList.value = []
  
  if (collegeId) {
    // 获取该学院的系列表
    await fetchDepartments(collegeId)
  }
}

// 处理分配任务对话框中学院变化
const handleStudentFilterCollegeChange = async (collegeId) => {
  // 清空系的选择
  studentFilter.departmentId = ''
  // 清空系列表
  departmentList.value = []
  
  if (collegeId) {
    // 获取该学院的系列表
    await fetchDepartments(collegeId)
    
    // 如果是系级管理员，自动设置系
    if (userStore.userInfo?.role === 'department_admin' && userStore.userInfo?.departmentId) {
      studentFilter.departmentId = userStore.userInfo.departmentId
    }
  }
  
  // 重新获取可分配的学生列表
  await fetchAvailableStudents()
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
      semester: '',
      academicYear: '',
      evaluationTime: [],
      targetCollegeId: '',
      targetDepartmentId: ''
    })
    // 清空系列表
    departmentList.value = []
  }

// 创建任务
const createTask = async () => {
  try {
    await taskFormRef.value.validate()
    creating.value = true
    
    // 处理时间范围
    const taskData = {
      ...taskForm,
      startTime: taskForm.evaluationTime[0],
      endTime: taskForm.evaluationTime[1],
      publisherId: userStore.userId, // 添加发布者ID
      publisherLevel: userStore.userInfo?.role
    }
    delete taskData.evaluationTime
    
    const res = await createEvaluationTask(taskData)
    if (res.code === '200') {
      ElMessage.success('任务发布成功')
      createDialogVisible.value = false
      fetchTasks()
    } else {
      ElMessage.error(res.message || '任务发布失败')
    }
  } catch (error) {
    console.error('任务发布失败:', error)
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
    const res = await getTaskAssignments(task.id)
    if (res.code === '200') {
      assignmentList.value = res.data
    } else {
      ElMessage.error(res.message || '获取分配详情失败')
    }
  } catch (error) {
    console.error('获取分配详情失败:', error)
    ElMessage.error('获取分配详情失败')
  } finally {
    assignmentLoading.value = false
  }
}



// 删除任务
const deleteTask = async (task) => {
  try {
    await ElMessageBox.confirm('确定要删除该任务吗？删除后不可恢复！', '警告', {
      type: 'warning'
    })
    
    const res = await deleteEvaluationTask(task.id)
    if (res.code === '200') {
      ElMessage.success('任务已删除')
      fetchTasks()
    } else {
      ElMessage.error(res.message || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除任务失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 显示分配对话框
const showAssignDialog = async (task) => {
  currentTask.value = task
  assignDialogVisible.value = true
  selectedStudents.value = []
  
  // 重置筛选条件
  Object.assign(studentFilter, {
    collegeId: '',
    departmentId: '',
    keyword: ''
  })
  
  // 清空系列表
  departmentList.value = []
  
  // 根据管理员角色设置权限限制
  if (userStore.userInfo?.role === 'department_admin') {
    // 系级管理员只能分配自己系的学生
    studentFilter.collegeId = userStore.userInfo.collegeId
    studentFilter.departmentId = userStore.userInfo.departmentId
  } else if (userStore.userInfo?.role === 'college_admin') {
    // 院级管理员只能分配自己院的学生
    studentFilter.collegeId = userStore.userInfo.collegeId
  }
  
  // 获取可分配的学生列表
  await fetchAvailableStudents()
}

// 获取可分配的学生列表
const fetchAvailableStudents = async () => {
  if (!currentTask.value) return
  
  studentsLoading.value = true
  try {
    const params = {
      taskId: currentTask.value.id,
      ...studentFilter
    }
    
    const res = await getAvailableStudents(params, userStore.userInfo)
    if (res.code === '200') {
      availableStudents.value = res.data || []
    } else {
      ElMessage.error(res.message || '获取学生列表失败')
    }
  } catch (error) {
    console.error('获取学生列表失败:', error)
    ElMessage.error('获取学生列表失败')
  } finally {
    studentsLoading.value = false
  }
}

// 处理学生选择变化
const handleStudentSelectionChange = (selection) => {
  selectedStudents.value = selection
}



// 分配任务给学生
const assignTaskToStudentsHandler = async () => {
  if (selectedStudents.value.length === 0) {
    ElMessage.warning('请选择要分配的学生')
    return
  }
  
  assigning.value = true
  try {
    const studentIds = selectedStudents.value.map(student => student.studentId)
    const res = await assignTaskToStudents(currentTask.value.id, studentIds)
    
    if (res.code === '200') {
      ElMessage.success(`成功分配任务给 ${selectedStudents.value.length} 名学生`)
      assignDialogVisible.value = false
      // 刷新任务列表
      fetchTasks()
    } else {
      ElMessage.error(res.message || '分配失败')
    }
  } catch (error) {
    console.error('分配任务失败:', error)
    ElMessage.error('分配失败')
  } finally {
    assigning.value = false
  }
}

 // 重置筛选条件
 const resetFilter = () => {
   Object.assign(filter, {
     semester: '',
     status: ''
   })
   // 重置分页到第一页
   pagination.current = 1
   fetchTasks()
 }

 // 处理每页显示数量变化
 const handleSizeChange = (size) => {
   pagination.size = size
   pagination.current = 1 // 重置到第一页
   fetchTasks()
 }

 // 处理当前页变化
 const handleCurrentChange = (current) => {
   pagination.current = current
   fetchTasks()
 }



// 获取状态标签样式
const getStatusTag = (status) => {
  const tagMap = {
    1: 'success',
    0: 'info'
  }
  return tagMap[status] || 'info'
}

// 获取状态名称
const getStatusName = (status) => {
  const nameMap = {
    1: '进行中',
    0: '已结束'
  }
  return nameMap[status] || '未知'
}



onMounted(() => {
  fetchTasks()
  fetchCourses()
  fetchColleges()
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

.header-left {
  display: flex;
  align-items: center;
}

.filter-section {
  margin-bottom: 20px;
}

.el-form-item {
  margin-bottom: 20px;
}

.assign-dialog-content {
  max-height: 600px;
  overflow-y: auto;
}

.task-info {
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.task-info h4 {
  margin: 0 0 10px 0;
  color: #303133;
}

.task-info p {
  margin: 5px 0;
  color: #606266;
}

.selection-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.selection-header span {
  font-weight: bold;
  color: #303133;
}
</style> 