<template>
  <div class="my-courses">
    <el-table
      :data="myCourses"
      style="width: 100%"
      border
      stripe
      header-cell-class-name="table-header"
      size="large"
      highlight-current-row
    >
    <!--  type=""index 这表示该列是序号列，会自动显示1、2、3、4……，不需要你在数据里加序号字段。 -->
      <el-table-column
        type="index"
        label="序号"
        width="100"
        align="center"
      />
      <el-table-column prop="courseName" label="课程名称" min-width="120" align="center"/>
      <el-table-column prop="teacherName" label="授课教师" min-width="100" align="center"/>
      <el-table-column prop="credits" label="学分" width="80" align="center" />
      <el-table-column prop="academicYear" label="学年" width="110" align="center" />
      <el-table-column prop="semester" label="学期" width="80" align="center" />
      <el-table-column prop="courseType" label="课程类型" width="100" align="center" />
      <el-table-column label="操作" width="120" align="center" v-if="userStore.userRole === 'teacher'">
      <template #default="scope">
        <el-button
          type="primary"
          size="small"
          @click="viewCourseEvaluation(scope.row)">
          查看评价</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getCurrentAcademicYear, getCurrentSemester } from '@/utils/date'
import { useUserStore } from '@/stores/user'
import { fetchStudentCourses} from '@/api/student'
import { fetchTeacherCourses } from '@/api/teacher'
import { useRouter } from 'vue-router'
const router = useRouter()
const userStore = useUserStore()
const myCourses = ref([])
// 当前学年学期
const academicYear = getCurrentAcademicYear()
const semester = getCurrentSemester()

function viewCourseEvaluation(row) {
  router.push({ path: `/course/evaluation/${row.courseId}` })
}


/**
 * 获取当前用户的课程列表
 * 学生：选修课程，教师：授课课程
 * 接口示例：GET /api/course/my-courses?userId=xxx
 */
 async function fetchMyCourses() {
  try {
    let res 
    if (userStore.userRole == 'student') {
      res = await fetchStudentCourses(userStore.userId,academicYear, semester)
    } else if (userStore.userRole == 'teacher') {
      res = await fetchTeacherCourses(userStore.userId,academicYear, semester)
    }
    console.log(res.data)

    if(res.code=='200')
      myCourses.value = res.data
    else
    ElMessage.error('获取课程失败')
  } catch (error) {
    ElMessage.error('获取我的课程失败')
  }
}

onMounted(fetchMyCourses)


</script>

<style scoped>
.my-courses {
  padding: 24px;
  background: #fff;
}
</style> 