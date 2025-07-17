<template>
    <div class="course-evaluation-detail">
      <el-card class="evaluation-card">
        <template #header>
          <div class="card-header">
            <span>课程评价详情</span>
            <el-tag type="info">{{ courseInfo.courseName }}</el-tag>
          </div>
        </template>
  
        <!-- 课程基本信息 -->
        <el-row :gutter="20" class="info-row">
          <el-col :span="8">课程名称：{{ courseInfo.courseName }}</el-col>
          <el-col :span="8">学年：{{ courseInfo.academicYear }}</el-col>
          <el-col :span="8">学期：{{ courseInfo.semester }}</el-col>
        </el-row>
  
        <!-- 评价指标统计 -->
        <el-divider content-position="left">各项指标平均分</el-divider>
        <el-table :data="indicatorStats" border>
          <el-table-column prop="indicatorName" label="评价指标" />
          <el-table-column prop="avgScore" label="平均分" />
          <el-table-column prop="maxScore" label="满分" />
        </el-table>
  
        <!-- 匿名文本评价 -->
        <el-divider content-position="left">学生匿名评价</el-divider>
        <el-table :data="commentList" border>
          <el-table-column
            prop="openComment"
            label="学生评价"
            min-width="300"
          >
            <template #default="scope">
              <div class="comment-cell">{{ scope.row.commentContent }}</div>
            </template>
          </el-table-column>
          <el-table-column label="教师回复" min-width="300">
            <template #default="scope">
              <div v-if="scope.row.teacherReply" class="reply-cell">
                {{ scope.row.teacherReply }}
              </div>
              <div v-else style="display: flex; flex-direction: row; gap: 8px; align-items: flex-end;">
                <el-input
                  v-model="scope.row.replyInput"
                  type="textarea"
                  :rows="6"
                  placeholder="输入回复"
                  size="small"
                  style="flex: 1;"
                />
                <el-button
                  type="primary"
                  size="small"
                  @click="submitReply(scope.row)"
                  style="margin-bottom: 4px;"
                >回复</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { getCourseEvaluationDetail, submitTeacherReply } from '@/api/teacher'
  
  const route = useRoute()
  const courseId = route.params.courseId
  
  const courseInfo = ref({})
  const indicatorStats = ref([]) // [{ indicatorName, avgScore, maxScore }]
  const commentList = ref([])    // [{ openComment, teacherReply, replyInput, commentId }]
  
//   const fetchDetail = async () => {
//   // 模拟测试数据
//   const res = {
//     data: {
//       courseInfo: {
//         courseName: "人工智能",
//         academicYear: "2024-2025",
//         semester: "2",
//         // teacherName: "高红雷"
//       },
//       indicatorStats: [
//         { indicatorName: "教学态度", avgScore: 9.2, maxScore: 10 },
//         { indicatorName: "教学方法", avgScore: 8.8, maxScore: 10 },
//         { indicatorName: "教学效果", avgScore: 9.0, maxScore: 10 }
//       ],
//       commentList: [
//         {
//           commentId: 1,
//           openComment: "老师讲得很细致，收获很大！",
//           teacherReply: "谢谢你的认可，继续加油！"
//         },
//         {
//           commentId: 2,
//           openComment: "希望作业能再少一点。",
//           teacherReply: ""
//         },
//         {
//           commentId: 3,
//           openComment: "讲课很有激情，内容丰富。",
//           teacherReply: ""
//         }
//       ]
//     }
//   }
//   courseInfo.value = res.data.courseInfo || {}
//   indicatorStats.value = res.data.indicatorStats || []
//   commentList.value = (res.data.commentList || []).map(item => ({
//     ...item,
//     replyInput: ''
//   }))
// }
  const fetchDetail = async () => {
    const res = await getCourseEvaluationDetail(courseId)
    
    courseInfo.value = res.data.courseInfo || {}
    indicatorStats.value = res.data.avgScores || []
    // 给每条评论加一个 replyInput 字段用于输入回复
    commentList.value = (res.data.comments || []).map(item => ({
      ...item,
      replyInput: ''
    }))
  }
  
  const submitReply = async (row) => {
    if (!row.replyInput) return
    try {
      await submitTeacherReply({ commentId: row.commentId, replyContent: row.replyInput })
    //   提交成功后，显示为只读内容
      row.teacherReply = row.replyInput
      row.replyInput = ''
      ElMessage.success('回复提交成功！')
    } catch (e) {
      ElMessage.error('回复提交失败，请重试')
    }
  }
  
  onMounted(fetchDetail)
  </script>
  
  <style scoped>
  .course-evaluation-detail {
    width: 100%;
    min-height: 100%;
    box-sizing: border-box;
    padding: 0px 16px;
    background: #f5f6fa;
    overflow: auto;
  }
  .evaluation-card {
    width: 90%;
    max-width: 1800px;
    margin: 0 auto;
    background: #fafbfc;
    border-radius: 12px;
    padding: 36px 36px 24px 36px;
    font-size: 20px;
    box-sizing: border-box;
    box-shadow: none;
    border: none;
  }
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 32px;
    font-weight: bold;
    padding-bottom: 18px;
    border-bottom: 1px solid #f0f0f0;
  }
  .info-row {
    margin-bottom: 16px;
  }
  .comment-cell {
    white-space: pre-wrap;
    word-break: break-all;
    min-height: 40px;
    line-height: 1.6;
  }
  .reply-cell {
    white-space: pre-wrap;
    word-break: break-all;
    min-height: 40px;
    line-height: 1.6;
  }
  </style>