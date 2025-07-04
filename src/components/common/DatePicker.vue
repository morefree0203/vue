<template>
  <el-date-picker v-model="value" type="date" placeholder="Pick a day" :size="size" value-format="YYYY-MM-DD" />
</template>

<script setup>
import { ref  } from 'vue';

// 定义size响应式变量，初始值设为'default'
const size = ref('default');

// 定义value响应式变量，初始值为空字符串
const value = ref('');

//发现父组件绑定一个值后就可以直接拿到里面的值，我不懂，但是居然能跑那我就先不管了，所以就不用对外暴露方法了
// //向外暴露方法，getValue方法用于获取value值，供父组件调用
// defineExpose({
//   getValue() {
//     return value.value;
//   }
// });

// //向外暴露方法，setValue方法用于设置value值，供父组件调用
// defineExpose({
//   setValue(val) {
//     value.value = val;
//   }
// });

</script>

<style scoped lang="less">
.demo-date-picker {
  display: flex;
  width: 100%;
  padding: 0;
  flex-wrap: wrap;

 .block {
    padding: 30px 0;
    text-align: center;
    border-right: solid 1px var(--el-border-color);
    flex: 1;

    &:last-child {
      border-right: none;
    }
  }

 .demonstration {
    display: block;
    color: var(--el-text-color-secondary);
    font-size: 14px;
    margin-bottom: 20px;
  }
}
</style>
