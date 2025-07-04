<script setup>
import { ref } from 'vue'

const formLabelWidth = '140px'

const form = ref({
  oldPassword: '',
  newPassword: '',
})

//对外暴露方法，给form赋值
const setForm = (newData) => {
  form.value = { ...form.value, ...newData }
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
      <el-form-item label="原密码" :label-width="formLabelWidth">
        <el-input v-model="form.oldPassword" autocomplete="off" />
      </el-form-item>
      <el-form-item label="新密码" :label-width="formLabelWidth">
        <el-input v-model="form.newPassword" autocomplete="off" />
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped></style>
