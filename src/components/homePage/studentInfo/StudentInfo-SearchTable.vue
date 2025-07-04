<script setup>
import { ref, defineEmits } from 'vue'
import Form from '@/components/homePage/studentInfo/StudentInfo-form.vue'

const emit = defineEmits(['delete', 'edit'])

//控制弹窗显示
const dialogFormVisible = ref(false)

//创建信息实例
const info = ref([])

info.value = {
  id: 1,
  name: '王小虎',
  no: 18,
  gender: 'true',
  enrolledTime: '2020-09-01'
}

//给表格赋值
const setInfo = (list) => {
  info.value = list
}
//获取表格数据
const getInfo = () => {
  return info.value
}


//向外暴露方法，拿到表格数据
defineExpose({
  //对外暴露方法，给表格赋值
  setInfo,
  //对外暴露方法，获取表格数据
  getInfo
})

//获取表单实例
const editForm = ref([])

//点击编辑按钮，给表单赋值
const clickEdit = () => {
  //显示弹窗
  dialogFormVisible.value = true
}

//编辑逻辑，直接提醒父组件处理
const editData = () => {
  emit('edit', editForm.value.getForm())
  //隐藏弹窗
  dialogFormVisible.value = false
}

</script>

<template>
  <div>
    <h1>我的信息</h1>
    <div>
      <span>姓名</span>
      <el-divider direction="vertical" />
      <span>{{ info.name }}</span>
    </div>
    <el-divider border-style="double" />
    <div>
      <span>学号</span>
      <el-divider direction="vertical" />
      <span>{{ info.no }}</span>
    </div>
    <el-divider border-style="double" />
    <div>
      <span>性别</span>
      <el-divider direction="vertical" />
      <span>{{ info.gender }}</span>
    </div>
    <el-divider border-style="double" />
    <div>
      <span>入学时间</span>
      <el-divider direction="vertical" />
      <span>{{ info.enrolledTime }}</span>
    </div>
    <el-divider border-style="double" />
    <div class="update-btn">
      <el-button type="primary" :icon="Search" @click="clickEdit">修改密码  </el-button>
    </div>
  </div>


  <el-dialog v-model="dialogFormVisible" title="修改密码" width="500">
    <Form ref="editForm"></Form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="editData">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="less" scoped>
h1 {
  display: block;
  background-color: #c6d6f4;
  width: 100%;
  height: 50px;
  font-size: 20px;
  font-weight: 200;
  text-align: center;
  line-height: 50px;
  margin-bottom: 20px;
}

span {
  // color: #409eff;
  width: 580px;
  display: inline-block;
  height: 30px;
  line-height: 30px;
  text-align: center
}

.update-btn{
  margin-left: 580px;
}

.warning-row {
  --el-table-tr-bg-color: #32df14;
}

.success-row {
  --el-table-tr-bg-color: rgb(213, 104, 200);
}
</style>
