<script setup>
import { ref, defineEmits, nextTick } from 'vue'
import Form from '@/components/homePage/course/Course-form.vue'

const emit = defineEmits(['delete', 'edit'])

//控制弹窗显示
const dialogFormVisible = ref(false)

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

//删除数据
const deleteData = (data) => {
  //告知父组件，删除数据
  emit('delete', data)
}

//获取表单实例
const editForm = ref([])

//点击编辑按钮，给表单赋值
const clickEdit = (data) => {
  //显示弹窗
  dialogFormVisible.value = true
  //等待弹出的表格渲染完再赋值
  nextTick(() => {
    //给表单赋值
    editForm.value.setForm(data);
  });
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
    <el-table :data="tableList" ref="table" height="500" style="width: 100%" :row-class-name="tableRowClassName">
      <el-table-column prop="name" label="课程名" min-width="120" />
      <el-table-column prop="no" label="课程编号" min-width="120" />
      <el-table-column prop="startTime" label="开课时间" min-width="180" />
      <el-table-column prop="endTime" label="结课时间" min-width="180" />
      <el-table-column prop="updateTime" label="上次修改时间" min-width="180" />
      <el-table-column prop="updateTime" label="上次修改时间" min-width="180" />
      <el-table-column label="操作" min-width="100">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="clickEdit(scope.row)">Edit</el-button>
          <el-popconfirm title="Are you sure to delete this?" @confirm="deleteData(scope.row)">
            <template #reference>
              <el-button link type="primary" size="small">Delete</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>


  <el-dialog v-model="dialogFormVisible" title="编辑课程" width="500">
    <Form ref="editForm"></Form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="editData">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="less">
.warning-row {
  --el-table-tr-bg-color: #32df14;
}

.success-row {
  --el-table-tr-bg-color: rgb(213, 104, 200);
}
</style>
