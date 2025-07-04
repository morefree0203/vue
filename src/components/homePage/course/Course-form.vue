<script setup>
import DataPicker from '@/components/common/DatePicker.vue'
import { ref } from 'vue'

const formLabelWidth = '140px'

const form = ref({
  name: '',
  no: '',
  startTime: '',
  endTime: '',
})

//对外暴露方法，给form赋值
const setForm = (student) => {
  form.value = { ...form.value, ...student }
}
//对外暴露方法，获取表单数据
const getForm = () => {
  return form.value
}

defineExpose({
  setForm,
  getForm
})

</script>

<template>
  <div>
    <el-form :model="form">
      <el-form-item label="课程名" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="课程编号" :label-width="formLabelWidth">
        <el-input v-model="form.no" autocomplete="off" />
      </el-form-item>
      <el-form-item label="开课时间" :label-width="formLabelWidth">
        <DataPicker v-model="form.startTime" placeholder="请选择日期"></DataPicker>
      </el-form-item>
      <el-form-item label="结课时间" :label-width="formLabelWidth">
        <DataPicker v-model="form.endTime" placeholder="请选择日期"></DataPicker>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped></style>
