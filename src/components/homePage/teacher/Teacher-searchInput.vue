<script setup>
import { ref, defineEmits, nextTick } from 'vue';
import Form from '@/components/homePage/teacher/Teacher-form.vue'

//定义传给父组件的事件
const emit = defineEmits(['add','search'])

//控制弹窗表单的数据
const dialogFormVisible = ref(false)

//拿到表单
const form = ref([])

//点击新增按钮
const startAdd = () => {
  dialogFormVisible.value = true
  //等待弹出的表格渲染完再赋值
  nextTick(() => {
    //给表单赋值
    form.value.setForm({ name: '', no: '', gender: '', enrolledTime: '' })
  });
}

//新增学生，也就是提醒父组件新增，自己不做新增，为了让发请求集中在父组件

const add = async () => {
  const data = form.value.getForm();
  //提醒父组件
  emit('add', data)
  dialogFormVisible.value = false
}


//定义搜索框的数据
const input = ref('')
//搜索学生的函数
const search = () => {
  //提醒父组件
  emit('search')
}

//暴露搜索框的数据的方法
defineExpose({
  getInputValue:()=>input.value
})

</script>

<template>
  <div class="insert-btn"><el-button type="primary" @click="startAdd">insert</el-button></div>
  <div class="search-title">姓名:</div>
  <div class="query-input">
    <el-input v-model="input" placeholder="请输入教师姓名" clearable />
  </div>
  <div class="search-btn">
    <el-button type="primary" :icon="Search" @click="search">搜索</el-button>
  </div>

  <!-- 表单弹窗部分 -->
  <el-dialog v-model="dialogFormVisible" title="新增教师" width="500">

    <Form ref="form"></Form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="add">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>



<style scoped lang="less">
.insert-btn {
  position: absolute;
  top: 50px;
}

.search-title {
  position: absolute;
  top: 50px;
  left: 320px;
  font-size: 20px;
  color: #418dda;
}

.query-input {
  width: 320px;
  position: absolute;
  top: 50px;
  left: 400px;
}

.search-btn {
  position: absolute;
  top: 50px;
  left: 750px;
}
</style>
