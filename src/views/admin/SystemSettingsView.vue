<template>
  <div class="system-settings-view">
    <el-card>
      <div class="header">
        <span class="title">系统设置</span>
        <el-button type="primary" @click="fetchSettings">刷新</el-button>
      </div>
      <el-table :data="settings" style="width: 100%" v-loading="loading">
        <el-table-column prop="key" label="参数名" />
        <el-table-column prop="value" label="参数值">
          <template #default="scope">
            <el-input v-model="scope.row.value" size="small" />
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" />
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button size="small" type="primary" @click="saveSetting(scope.row)">保存</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const settings = ref([])
const loading = ref(false)

// 获取系统参数
const fetchSettings = async () => {
  loading.value = true
  try {
    const res = await axios.get('/api/system/settings/list')
    settings.value = res.data.data || []
  } catch (e) {
    ElMessage.error('获取系统参数失败')
  } finally {
    loading.value = false
  }
}
// 保存单个参数
const saveSetting = async (row) => {
  try {
    await axios.post('/api/system/settings/update', row)
    ElMessage.success('保存成功')
    fetchSettings()
  } catch (e) {
    ElMessage.error('保存失败')
  }
}

onMounted(() => {
  fetchSettings()
})
</script>

<style scoped>
.system-settings-view {
  padding: 24px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.title {
  font-size: 20px;
  font-weight: bold;
}
</style> 