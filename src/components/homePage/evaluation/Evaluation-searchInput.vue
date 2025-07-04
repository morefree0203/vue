<script setup>
import { ref, defineEmits } from 'vue';


//定义传给父组件的事件
const emit = defineEmits(['add','search'])

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

  <div class="search-title">姓名:</div>
  <div class="query-input">
    <el-input v-model="input" placeholder="请输入教师姓名" clearable />
  </div>
  <div class="search-btn">
    <el-button type="primary" :icon="Search" @click="search">搜索</el-button>
  </div>
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
