<template>
  <div class="peer-evaluation">
    <div class="page-title">可评价课程列表</div>
    <el-table
        :data="courseList"
        style="width: 100%"
        border
        stripe
        size="large"
    >
      <el-table-column type="index" label="序号" width="100" align="center" />
      <el-table-column prop="courseName" label="课程名称" min-width="120" align="center"/>
      <el-table-column prop="teacherName" label="授课教师" min-width="100" align="center"/>
      <el-table-column prop="credits" label="学分" width="80" align="center" />
      <el-table-column prop="academicYear" label="学年" width="110" align="center" />
      <el-table-column prop="semester" label="学期" width="80" align="center" />
      <el-table-column prop="courseType" label="课程类型" width="100" align="center" />
      <el-table-column label="操作" width="120" align="center">
        <template #default="scope">
          <el-button
              size="small"
              type="primary"
              @click="openEvalDialog(scope.row)"
              :disabled="scope.row.isEvaluated"
          >
            {{ scope.row.isEvaluated ? '已评价' : '评价' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 评价表单对话框 -->
    <el-dialog title="同行评价" v-model="dialogVisible" width="600px">
      <el-form :model="evalForm" ref="formRef" label-width="100px">
        <el-form-item label="课程名称">
          <el-input v-model="evalForm.courseName" disabled />
        </el-form-item>
        <el-form-item label="授课教师">
          <el-input v-model="evalForm.teacherName" disabled />
        </el-form-item>
        <el-form-item
          v-for="indicator in indicatorList"
          :key="indicator.id"
          :label="indicator.name"
        >
          <el-rate v-model="evalForm.scores[indicator.id]" :max="indicator.maxScore" />
        </el-form-item>
        <el-form-item label="评语">
          <el-input v-model="evalForm.comment" type="textarea" />
        </el-form-item>

        <!-- <el-upload>组件的独立性：Element Plus的<el-upload>组件在选中文件后，会立即发起一个独立的HTTP POST请求到其action属性指定的URL。
          这个请求不会使用我们全局封装的axios实例（request.js），因此它不会自动携带baseURL或自定义的headers（如token）。
        绝对路径 vs 相对路径：
        如果action被设置为一个相对路径（如"/teacher/peer-image-upload"），浏览器会将其与当前页面的源（http://localhost:5173）拼接，导致请求被错误地发送到前端服务器，从而产生404 Not Found错误。
        解决方案：我们必须为action属性提供一个完整的、绝对的URL（如http://localhost:8080/teacher/peer-image-upload），明确告诉浏览器请求应该直接发往后端服务器。
        Token认证问题：由于<el-upload>不走全局axios，我们的请求拦截器也无法为其自动添加认证token。
        解决方案：必须使用<el-upload>组件提供的:headers属性，手动将从sessionStorage或localStorage中获取的token绑定到上传请求的请求头中，否则后端JWT拦截器会因“无token”而返回401 Unauthorized错误。 -->
                
        <el-form-item label="上传照片">
          <el-upload
            :action="uploadActionUrl"
            :headers="uploadHeaders"
            :on-success="handleUploadSuccess"
            :file-list="evalForm.images"
            list-type="picture-card"
            :limit="5"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="evalForm.isAnonymous">匿名发表</el-checkbox>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEvaluation">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getSupervisorLeaderCourses,
  getSupervisorLeaderIndicators,
  submitSupervisorLeaderEvaluation
} from '@/api/supervisor-leader'
import { useUserStore } from '@/stores/user'    
const userStore = useUserStore()

const courseList = ref([])
const dialogVisible = ref(false)
const indicatorList = ref([])
const formRef = ref()
const evalForm = reactive({
  courseId: null,
  courseName: '',
  teacherName: '',
  targetTeacherId: null,
  scores: {},
  comment: '',
  images: [],
  isAnonymous: false
})



const openEvalDialog = async (row) => {
  // 确保使用下划线命名从小写的 row 对象中取值
  evalForm.courseId = row.courseId;
  evalForm.courseName = row.courseName;
  evalForm.teacherName = row.teacherName;
  evalForm.targetTeacherId = row.teacherId;
  evalForm.comment = '';
  evalForm.images = [];
  evalForm.isAnonymous = false;
  
  try {
    // 获取评价指标
    console.log('获取评价指标')
    const res = await  getSupervisorLeaderIndicators()
    console.log(res)
    if (res.code === '200' && res.data) {
        indicatorList.value = res.data;
         // 初始化评分对象
        evalForm.scores = {};
        // 为每个指标设置初始分数0
        indicatorList.value.forEach(ind => {
            evalForm.scores[ind.id] = 0;
        });
    } else {
        indicatorList.value = []; // 清空以防旧数据残留
        ElMessage.error('获取评价指标失败');
    }
  } catch (error) {
    ElMessage.error('请求评价指标时出错');
  }

  dialogVisible.value = true;
};

/**
 * 处理图片上传成功
 * @param {Object} response - 上传接口响应
 * @param {Object} uploadFile - 上传的文件对象
 * @param {Array} uploadFiles - 当前所有上传文件列表
 */
const handleUploadSuccess = (response, uploadFile, uploadFiles) => {
  if (response.code === '200' && response.data) {
    // 关键修复：直接使用 uploadFile.raw 创建一个本地预览URL
    // 这个URL是浏览器在本地生成的，可以直接用于<img>标签的src，保证能显示
    
    // raw: File,             原始文件对象（最重要！）
    //     这是浏览器原生的 File 对象

    // 表示用户选择的实际文件

    // 包含文件的原始二进制数据
    // 将 File 对象转换为可在浏览器中使用的临时 URL

    // 格式如：blob:http://localhost:5173/550e8400-e29b-41d4-a716-446655440000

    // 允许 <img> 标签直接显示用户选择的图片
    uploadFile.url = URL.createObjectURL(uploadFile.raw);

    // 将后端返回的真实、可访问的URL存放在一个自定义属性上，供最终提交时使用
    uploadFile.realUrl = `${backendBaseUrl}${response.data}`;

    // 更新我们自己的响应式数据
    // 每个元素都是 uploadFile 类型的对象
    evalForm.images = uploadFiles;
    
    ElMessage.success('图片上传成功');
  } else {
    ElMessage.error(response.msg || '图片上传失败');
    // 从文件列表中移除失败的文件
    // 遍历 uploadFiles 数组中的每个文件对象 f
    // 检查当前文件 f 的 uid 是否等于目标文件 uploadFile 的 uid
    // 找到第一个匹配项后立即返回其索引
    // 如果找不到，返回 -1
    const index = uploadFiles.findIndex(f => f.uid === uploadFile.uid);
    if (index > -1) {
        uploadFiles.splice(index, 1);
    }
    // 更新表单中的图片列表
    evalForm.images = uploadFiles;
  }
};

const submitEvaluation = async () => {
  // 校验
// 假设所有指标都在 indicatorList 中
  const allScored = indicatorList.value.every(ind => evalForm.scores[ind.id] > 0);

  if (!allScored) {
    ElMessage.warning('请对所有指标评分');
    return;
  }
  await submitSupervisorLeaderEvaluation({
    courseId: evalForm.courseId,
    targetTeacherId: evalForm.targetTeacherId,
    scores: evalForm.scores,
    comment: evalForm.comment,
    // 提交时，使用我们之前保存的真实URL (realUrl)
    images: evalForm.images.map(f => f.realUrl),
    isAnonymous: evalForm.isAnonymous
  })
  ElMessage.success('评价提交成功')
  dialogVisible.value = false
  // 提交成功后，重新获取课程列表以更新状态
  await fetchCourses()
}

const fetchCourses = async () => {
  try{
    const res = await getSupervisorLeaderCourses(userStore.userId)
    if (res.code === '200' && res.data){
      courseList.value = res.data
    }
    else{
      ElMessage.error('获取课程列表失败')
    }
  }
  catch(error){
    ElMessage.error('获取课程列表时出错')
  }
 
 
}

// 定义后端服务器的基础URL
const backendBaseUrl = 'http://localhost:8080';

// 为 el-upload 的 action 属性创建一个完整的URL
const uploadActionUrl = computed(() => {
  return `${backendBaseUrl}/teacher/peer-image-upload`;
});

// 创建一个计算属性来动态获取token并设置请求头
const uploadHeaders = computed(() => {
  const token = sessionStorage.getItem('token');
  if (token) {
    return {
      'token': token
    };
  }
  return {};
});

onMounted(fetchCourses)
</script>

<style scoped>
.peer-evaluation {
  padding: 24px;
  background: #fff;
  min-height: 100vh;
}

.page-title {
  margin-left: 30px;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 20px;
}
</style> 