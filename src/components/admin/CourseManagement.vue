<template>
  <div class="course-management">
    <el-tabs v-model="activeTab" type="border-card">
      <!-- 课程基本信息管理 -->
      <el-tab-pane label="课程信息管理" name="courseInfo">
        <div class="tab-content">
          <div class="action-bar">
            <el-button type="primary" @click="showAddCourseDialog">添加课程</el-button>
            <el-input 
              v-model="courseSearchKeyword" 
              placeholder="搜索课程名称或代码" 
              style="width: 300px; margin-left: 10px;"
              @input="searchCourses"
            />
          </div>
          
          <el-table :data="courseList" style="width: 100%; margin-top: 20px;">
            <el-table-column prop="code" label="课程代码" width="120" />
            <el-table-column prop="name" label="课程名称" width="200" />
            <el-table-column prop="credits" label="学分" width="80" />
            <el-table-column prop="hours" label="学时" width="80" />
            <el-table-column prop="semester" label="学期" width="100" />
            <el-table-column prop="teacherName" label="授课教师" width="120" />
            <el-table-column prop="currentStudents" label="选课人数" width="100" />
            <el-table-column prop="maxStudents" label="容量" width="80" />
            <el-table-column label="操作" width="200">
              <template #default="scope">
                <el-button size="small" @click="editCourse(scope.row)">编辑</el-button>
                <el-button size="small" type="primary" @click="manageTeachers(scope.row)">分配教师</el-button>
                <el-button size="small" type="success" @click="manageStudents(scope.row)">管理学生</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>

      <!-- 教师分配管理 -->
      <el-tab-pane label="教师分配管理" name="teacherAssignment">
        <div class="tab-content">
          <el-form :inline="true" class="search-form">
            <el-form-item label="选择课程">
              <el-select v-model="selectedCourseId" placeholder="请选择课程" @change="loadCourseTeachers">
                <el-option 
                  v-for="course in courseList" 
                  :key="course.courseId" 
                  :label="course.name" 
                  :value="course.courseId" 
                />
              </el-select>
            </el-form-item>
          </el-form>
          
          <div v-if="selectedCourseId" class="teacher-assignment">
            <h3>当前课程：{{ getSelectedCourseName() }}</h3>
            <el-button type="primary" @click="showAssignTeacherDialog">分配教师</el-button>
            
            <el-table :data="courseTeachers" style="width: 100%; margin-top: 20px;">
              <el-table-column prop="teacherName" label="教师姓名" />
              <el-table-column prop="teacherNo" label="工号" />
              <el-table-column prop="title" label="职称" />
              <el-table-column prop="departmentName" label="所属院系" />
              <el-table-column label="操作">
                <template #default="scope">
                  <el-button size="small" type="danger" @click="removeTeacher(scope.row)">移除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-tab-pane>

      <!-- 学生选课管理 -->
      <el-tab-pane label="学生选课管理" name="studentSelection">
        <div class="tab-content">
          <el-form :inline="true" class="search-form">
            <el-form-item label="选择课程">
              <el-select v-model="selectedCourseForStudents" placeholder="请选择课程" @change="loadCourseStudents">
                <el-option 
                  v-for="course in courseList" 
                  :key="course.courseId" 
                  :label="course.name" 
                  :value="course.courseId" 
                />
              </el-select>
            </el-form-item>
          </el-form>
          
          <div v-if="selectedCourseForStudents" class="student-selection">
            <h3>当前课程：{{ getSelectedCourseForStudentsName() }}</h3>
            <div class="action-buttons">
              <el-button type="primary" @click="showAddStudentDialog">添加学生</el-button>
              <el-button type="success" @click="batchImportStudents">批量导入</el-button>
              <el-button type="warning" @click="exportStudentList">导出名单</el-button>
            </div>
            
            <el-table :data="courseStudents" style="width: 100%; margin-top: 20px;">
              <el-table-column prop="studentName" label="学生姓名" />
              <el-table-column prop="studentNo" label="学号" />
              <el-table-column prop="className" label="班级" />
              <el-table-column prop="selectTime" label="选课时间" />
              <el-table-column prop="evaluationStatus" label="评价状态">
                <template #default="scope">
                  <el-tag :type="scope.row.evaluationStatus === 1 ? 'success' : 'warning'">
                    {{ scope.row.evaluationStatus === 1 ? '已评价' : '未评价' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template #default="scope">
                  <el-button size="small" type="danger" @click="removeStudent(scope.row)">退课</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 添加/编辑课程对话框 -->
    <el-dialog v-model="courseDialogVisible" :title="isEditCourse ? '编辑课程' : '添加课程'" width="600px">
      <el-form :model="courseForm" :rules="courseRules" ref="courseFormRef" label-width="100px">
        <el-form-item label="课程代码" prop="code">
          <el-input v-model="courseForm.code" />
        </el-form-item>
        <el-form-item label="课程名称" prop="name">
          <el-input v-model="courseForm.name" />
        </el-form-item>
        <el-form-item label="学分" prop="credits">
          <el-input-number v-model="courseForm.credits" :min="0" :max="20" />
        </el-form-item>
        <el-form-item label="学时" prop="hours">
          <el-input-number v-model="courseForm.hours" :min="0" />
        </el-form-item>
        <el-form-item label="学期" prop="semester">
          <el-select v-model="courseForm.semester" placeholder="请选择学期">
            <el-option label="2024-1" value="2024-1" />
            <el-option label="2024-2" value="2024-2" />
            <el-option label="2025-1" value="2025-1" />
            <el-option label="2025-2" value="2025-2" />
          </el-select>
        </el-form-item>
        <el-form-item label="学年" prop="academicYear">
          <el-select v-model="courseForm.academicYear" placeholder="请选择学年">
            <el-option label="2024-2025" value="2024-2025" />
            <el-option label="2025-2026" value="2025-2026" />
          </el-select>
        </el-form-item>
        <el-form-item label="开课院系" prop="departmentId">
          <el-select v-model="courseForm.departmentId" placeholder="请选择院系">
            <el-option 
              v-for="dept in departmentList" 
              :key="dept.departmentId" 
              :label="dept.name" 
              :value="dept.departmentId" 
            />
          </el-select>
        </el-form-item>
        <el-form-item label="课程容量" prop="maxStudents">
          <el-input-number v-model="courseForm.maxStudents" :min="1" />
        </el-form-item>
        <el-form-item label="课程描述" prop="description">
          <el-input v-model="courseForm.description" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="courseDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveCourse">确定</el-button>
      </template>
    </el-dialog>

    <!-- 分配教师对话框 -->
    <el-dialog v-model="teacherDialogVisible" title="分配教师" width="500px">
      <el-form :model="teacherForm" ref="teacherFormRef" label-width="100px">
        <el-form-item label="选择教师" prop="teacherId">
          <el-select v-model="teacherForm.teacherId" placeholder="请选择教师" filterable>
            <el-option 
              v-for="teacher in availableTeachers" 
              :key="teacher.id" 
              :label="`${teacher.name} (${teacher.teacherNo})`" 
              :value="teacher.id" 
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="teacherDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="assignTeacher">确定</el-button>
      </template>
    </el-dialog>

    <!-- 添加学生对话框 -->
    <el-dialog v-model="studentDialogVisible" title="添加学生" width="500px">
      <el-form :model="studentForm" ref="studentFormRef" label-width="100px">
        <el-form-item label="选择学生" prop="studentId">
          <el-select v-model="studentForm.studentId" placeholder="请选择学生" filterable>
            <el-option 
              v-for="student in availableStudents" 
              :key="student.id" 
              :label="`${student.name} (${student.studentNo})`" 
              :value="student.id" 
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="studentDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addStudent">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  pageSearch, 
  add, 
  update, 
  remove,
  getCoursesByDepartment,
  getCourseStudentCount,
  selectCourse,
  dropCourse
} from '@/api/course'

// 响应式数据
const activeTab = ref('courseInfo')
const courseList = ref([])
const courseSearchKeyword = ref('')
const selectedCourseId = ref('')
const selectedCourseForStudents = ref('')
const courseTeachers = ref([])
const courseStudents = ref([])
const departmentList = ref([])
const availableTeachers = ref([])
const availableStudents = ref([])

// 对话框控制
const courseDialogVisible = ref(false)
const teacherDialogVisible = ref(false)
const studentDialogVisible = ref(false)
const isEditCourse = ref(false)

// 表单数据
const courseForm = reactive({
  courseId: '',
  code: '',
  name: '',
  credits: 0,
  hours: 0,
  semester: '',
  academicYear: '',
  departmentId: '',
  maxStudents: 50,
  description: ''
})

const teacherForm = reactive({
  teacherId: ''
})

const studentForm = reactive({
  studentId: ''
})

// 表单验证规则
const courseRules = {
  code: [{ required: true, message: '请输入课程代码', trigger: 'blur' }],
  name: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
  credits: [{ required: true, message: '请输入学分', trigger: 'blur' }],
  hours: [{ required: true, message: '请输入学时', trigger: 'blur' }],
  semester: [{ required: true, message: '请选择学期', trigger: 'change' }],
  academicYear: [{ required: true, message: '请选择学年', trigger: 'change' }],
  departmentId: [{ required: true, message: '请选择开课院系', trigger: 'change' }]
}

// 初始化
onMounted(() => {
  loadCourseList()
  loadDepartmentList()
})

// 加载课程列表
const loadCourseList = async () => {
  try {
    const response = await pageSearch({ pageNum: 1, pageSize: 1000, query: {} })
    courseList.value = response.records || []
  } catch (error) {
    ElMessage.error('加载课程列表失败')
  }
}

// 加载院系列表
const loadDepartmentList = async () => {
  // 这里应该调用院系API
  departmentList.value = [
    { departmentId: '1', name: '计算机学院' },
    { departmentId: '2', name: '数学学院' },
    { departmentId: '3', name: '物理学院' }
  ]
}

// 搜索课程
const searchCourses = () => {
  // 实现搜索逻辑
}

// 显示添加课程对话框
const showAddCourseDialog = () => {
  isEditCourse.value = false
  Object.assign(courseForm, {
    courseId: '',
    code: '',
    name: '',
    credits: 0,
    hours: 0,
    semester: '',
    academicYear: '',
    departmentId: '',
    maxStudents: 50,
    description: ''
  })
  courseDialogVisible.value = true
}

// 编辑课程
const editCourse = (course) => {
  isEditCourse.value = true
  Object.assign(courseForm, course)
  courseDialogVisible.value = true
}

// 保存课程
const saveCourse = async () => {
  try {
    if (isEditCourse.value) {
      await update(courseForm)
      ElMessage.success('课程更新成功')
    } else {
      await add(courseForm)
      ElMessage.success('课程添加成功')
    }
    courseDialogVisible.value = false
    loadCourseList()
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

// 管理教师
const manageTeachers = (course) => {
  selectedCourseId.value = course.courseId
  loadCourseTeachers()
  activeTab.value = 'teacherAssignment'
}

// 加载课程教师
const loadCourseTeachers = async () => {
  // 这里应该调用API获取课程的教师列表
  courseTeachers.value = [
    { teacherName: '张教授', teacherNo: 'T001', title: '教授', departmentName: '计算机学院' }
  ]
}

// 显示分配教师对话框
const showAssignTeacherDialog = () => {
  // 加载可用教师列表
  availableTeachers.value = [
    { id: '1', name: '张教授', teacherNo: 'T001' },
    { id: '2', name: '李副教授', teacherNo: 'T002' }
  ]
  teacherForm.teacherId = ''
  teacherDialogVisible.value = true
}

// 分配教师
const assignTeacher = async () => {
  try {
    // 这里应该调用API分配教师
    ElMessage.success('教师分配成功')
    teacherDialogVisible.value = false
    loadCourseTeachers()
  } catch (error) {
    ElMessage.error('分配失败')
  }
}

// 移除教师
const removeTeacher = async (teacher) => {
  try {
    await ElMessageBox.confirm('确定要移除该教师吗？', '提示', {
      type: 'warning'
    })
    // 这里应该调用API移除教师
    ElMessage.success('教师移除成功')
    loadCourseTeachers()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('移除失败')
    }
  }
}

// 管理学生
const manageStudents = (course) => {
  selectedCourseForStudents.value = course.courseId
  loadCourseStudents()
  activeTab.value = 'studentSelection'
}

// 加载课程学生
const loadCourseStudents = async () => {
  try {
    const response = await getCourseStudentCount(selectedCourseForStudents.value)
    // 这里应该调用API获取课程的学生列表
    courseStudents.value = [
      { studentName: '张三', studentNo: 'S001', className: '计算机2021-1', selectTime: '2024-09-01', evaluationStatus: 0 },
      { studentName: '李四', studentNo: 'S002', className: '计算机2021-1', selectTime: '2024-09-01', evaluationStatus: 1 }
    ]
  } catch (error) {
    ElMessage.error('加载学生列表失败')
  }
}

// 显示添加学生对话框
const showAddStudentDialog = () => {
  // 加载可用学生列表
  availableStudents.value = [
    { id: '1', name: '张三', studentNo: 'S001' },
    { id: '2', name: '李四', studentNo: 'S002' }
  ]
  studentForm.studentId = ''
  studentDialogVisible.value = true
}

// 添加学生
const addStudent = async () => {
  try {
    await selectCourse({
      studentId: studentForm.studentId,
      courseId: selectedCourseForStudents.value,
      semester: '2024-1',
      academicYear: '2024-2025'
    })
    ElMessage.success('学生添加成功')
    studentDialogVisible.value = false
    loadCourseStudents()
  } catch (error) {
    ElMessage.error('添加失败')
  }
}

// 移除学生
const removeStudent = async (student) => {
  try {
    await ElMessageBox.confirm('确定要让学生退课吗？', '提示', {
      type: 'warning'
    })
    await dropCourse({
      studentId: student.id,
      courseId: selectedCourseForStudents.value
    })
    ElMessage.success('学生退课成功')
    loadCourseStudents()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('退课失败')
    }
  }
}

// 批量导入学生
const batchImportStudents = () => {
  ElMessage.info('批量导入功能待实现')
}

// 导出学生名单
const exportStudentList = () => {
  ElMessage.info('导出功能待实现')
}

// 获取选中课程名称
const getSelectedCourseName = () => {
  const course = courseList.value.find(c => c.courseId === selectedCourseId.value)
  return course ? course.name : ''
}

const getSelectedCourseForStudentsName = () => {
  const course = courseList.value.find(c => c.courseId === selectedCourseForStudents.value)
  return course ? course.name : ''
}
</script>

<style scoped>
.course-management {
  padding: 20px;
}

.tab-content {
  padding: 20px 0;
}

.action-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.search-form {
  margin-bottom: 20px;
}

.teacher-assignment,
.student-selection {
  margin-top: 20px;
}

.action-buttons {
  margin: 20px 0;
}

.action-buttons .el-button {
  margin-right: 10px;
}
</style> 