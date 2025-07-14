<template>
  <div class="enterprise-evaluation">
    <el-table :data="talentList" style="width: 100%">
      <el-table-column prop="id" label="人才ID" width="100" />
      <el-table-column prop="name" label="人才姓名" />
      <el-table-column prop="school" label="毕业院校" />
      <el-table-column prop="major" label="专业" />
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <el-button size="small" @click="openEvalDialog(scope.row)">评价</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 评价对话框 -->
    <el-dialog title="企业评价" v-model="dialogVisible">
      <el-form :model="evalForm" label-width="100px">
        <el-form-item label="人才姓名">
          <el-input v-model="evalForm.name" disabled />
        </el-form-item>
        <el-form-item label="毕业院校">
          <el-input v-model="evalForm.school" disabled />
        </el-form-item>
        <el-form-item label="专业">
          <el-input v-model="evalForm.major" disabled />
        </el-form-item>
        <el-form-item label="综合素质">
          <el-rate v-model="evalForm.quality" :max="5" />
        </el-form-item>
        <el-form-item label="专业能力">
          <el-rate v-model="evalForm.ability" :max="5" />
        </el-form-item>
        <el-form-item label="企业建议">
          <el-input v-model="evalForm.comment" type="textarea" placeholder="请输入企业建议或意见" />
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const talentList = ref([])
const dialogVisible = ref(false)
const evalForm = reactive({
  id: null,
  name: '',
  school: '',
  major: '',
  quality: 0,
  ability: 0,
  comment: ''
})

function fetchTalents() {
  axios.get('http://localhost:8080/api/evaluation/enterprise/talents', {
    params: { enterpriseId: userStore.userId }
  })
    .then(res => {
      talentList.value = res.data.data
    })
    .catch(() => {
      ElMessage.error('获取可评价人才失败')
    })
}

onMounted(fetchTalents)

function openEvalDialog(row) {
  Object.assign(evalForm, {
    id: row.id,
    name: row.name,
    school: row.school,
    major: row.major,
    quality: 0,
    ability: 0,
    comment: ''
  })
  dialogVisible.value = true
}

function submitEvaluation() {
  if (!evalForm.quality || !evalForm.ability) {
    ElMessage.warning('请完成所有打分项')
    return
  }
  axios.post('http://localhost:8080/api/evaluation/enterprise/submit', {
    enterpriseId: userStore.userId,
    talentId: evalForm.id,
    quality: evalForm.quality,
    ability: evalForm.ability,
    comment: evalForm.comment
  })
    .then(() => {
      ElMessage.success('评价提交成功')
      dialogVisible.value = false
      fetchTalents()
    })
    .catch(() => {
      ElMessage.error('提交失败')
    })
}
</script>

<style scoped>
.enterprise-evaluation {
  padding: 24px;
  background: #fff;
  min-height: 100vh;
}
</style> 