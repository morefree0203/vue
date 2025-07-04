<script setup>
import DataPicker from '@/components/common/DatePicker.vue'
import { ref } from 'vue'

const formLabelWidth = '140px'

const form = ref({
  name: '',
  no: '',
  gender: '',
  enrolledTime: ''
})

//对外暴露方法，给form赋值
const setForm = (newData) => {
  form.value = { ...form.value, ...newData }
  if (form.value.gender === null || form.value.gender === '') {
    form.value.gender = ''
    return
  }
  form.value.gender = form.value.gender ? '男' : '女'
}
//对外暴露方法，获取表单数据
const getForm = () => {
  form.value.gender = form.value.gender === '男'
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
      <el-form-item label="姓名" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="学号" :label-width="formLabelWidth">
        <el-input v-model="form.no" autocomplete="off" />
      </el-form-item>
      <el-form-item label="性别" :label-width="formLabelWidth">
        <el-select v-model="form.gender" placeholder="请输入性别" :filterable="true">
          <el-option label="男" value='男' />
          <el-option label="女" value='女' />
        </el-select>
      </el-form-item>
      <el-form-item label="入学时间" :label-width="formLabelWidth">
        <!-- <el-input v-model="form.name" autocomplete="off" /> -->
        <DataPicker v-model="form.enrolledTime" placeholder="请选择日期"></DataPicker>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped></style>
