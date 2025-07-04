<script setup>
import { ref, onMounted } from 'vue';
import { pageSearch, add, remove, update } from '@/api/student.js'
import AutocompleteSearch from '@/components/homePage/student/Student-searchInput.vue';


//声明搜索数据
const search = ref('')
//声明表格数据
const tableList = ref([]);
//声明分页数据
const pagination = ref({});


//创建时发请求，拿到表格数据
onMounted(
  async () => {
    const res = await pageSearch({ pageNum: 1,pageSize:10, query: { name: '' } })
    tableList.value.setList(res.records);
    pagination.value.setPageTotal(res.total)
  }
)

//新增学生
const addStudent = async (data) => {
  if (data.name === '' || data.no === '') {
    return alert('请输入姓名和学号')
  }
  await add(data)
  //刷新数据
  await searchStudent()
}

//删除学生
const deleteStudent = async (data) => {
  await remove(data.id)
  //刷新数据
  await searchStudent()
}

//编辑学生
const editStudent = async (data) => {
  console.log("StudentManage里面",data);
  await update(data)
  //刷新数据
  await searchStudent()
}

//条件搜索学生
const searchStudent = async () => {
  const queryName = search.value.getInputValue()
  const queryPage = pagination.value.getTablePage()
  const res = await pageSearch({ pageNum: queryPage.pageNum, pageSize:queryPage.pageSize,query: { name: queryName } })
  tableList.value.setList(res.records);
  pagination.value.setPageTotal(res.total)
}

</script>

<template>
  <div class="search-container">
    <AutocompleteSearch ref="search" @add="addStudent" @search="searchStudent"/>
  </div>
  <div class="table-container">
    <SearchTable ref="tableList" @delete="deleteStudent" @edit="editStudent" />
  </div>
  <div class="pagination-container">
    <SearchPagination ref="pagination" @page-search="searchStudent"/>
  </div>
</template>

<style scoped lang="less">
.search-container {
  position: absolute;
  top: 40px;
  left: 120px;
  width: 1200px;
  height: 120px;
  // border: 1px solid #17bedf;
}

.table-container {
  position: absolute;
  top: 200px;
  left: 120px;
  width: 1200px;
  height: 500px;
  // border: 1px solid #17bedf;
}

.pagination-container {
  position: absolute;
  top: 720px;
  left: 120px;
  width: 1200px;
  height: 80px;
  // border: 1px solid #17bedf;
}
</style>
