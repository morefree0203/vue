<script setup>
import { ref,defineEmits } from 'vue'

const emit = defineEmits(['pageSearch'])

const tablePage = ref({
  pageNum: 1,
  pageSize: 10,
  total: 100
})

const pageSizes = ref([10, 20, 30, 40])

// 分页切换
const handlePageChange = (currentPage) => {
  tablePage.value.pageNum = currentPage
  // 在此刷新数据,告知父组件要刷新数据
  emit('pageSearch')
}

// 每页显示数量切换
const handleSizeChange = (pageSize) => {
  tablePage.value.pageSize = pageSize
  // 在此刷新数据,告知父组件要刷新数据
  emit('pageSearch')
}

// 提供暴露分页相关数据的方法
defineExpose({
  getTablePage:()=> tablePage.value,

  setPageTotal: (total) => {
    tablePage.value.total = total
  }

})
</script>

<template>
  <el-pagination background layout="total, sizes, prev, pager, next, jumper" :current-page="tablePage.pageNum"
    :page-size="tablePage.pageSize" :page-sizes="pageSizes" :total="tablePage.total" @size-change="handleSizeChange"
    @current-change="handlePageChange" />
</template>


<style scoped lang="less">
.el-pagination {
  position: absolute;
  top: 25px;
  left: 200px;
}
</style>
