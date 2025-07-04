<script setup>
import { ref } from 'vue'

// //表格高亮列
// const tableRowClassName = ({ rowIndex }) => {
//   if (rowIndex === 1) {
//     return 'warning-row';
//   } else if (rowIndex === 3) {
//     return 'success-row';
//   }
//   return '';
// };

//控制表格数据
const tableList = ref([])

//给表格赋值
const setList = (list) => {
  tableList.value = list
}
//获取表格数据
const getList = () => {
  return tableList.value
}


//向外暴露方法，拿到表格数据
defineExpose({
  //对外暴露方法，给表格赋值
  setList,
  //对外暴露方法，获取表格数据
  getList
})

//获取表格实例
const table = ref([])

</script>

<template>
  <div>
    <el-table :data="tableList" ref="table" height="500" style="width: 100%" :row-class-name="tableRowClassName">
      <el-table-column prop="teacherName" label="教师名" min-width="180" />
      <el-table-column prop="teacherNo" label="教职工号" min-width="180" />
      <el-table-column prop="courseName" label="课程名" min-width="180" />
      <el-table-column prop="courseNo" label="课程号" min-width="180" />
      <el-table-column prop="avgScore" label="分数" min-width="180" />
    </el-table>
  </div>
</template>

<style lang="less">
.warning-row {
  --el-table-tr-bg-color: #32df14;
}

.success-row {
  --el-table-tr-bg-color: rgb(213, 104, 200);
}
</style>
