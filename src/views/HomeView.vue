<!-- 模块分布主页 -->
<template>
    <el-container class="container">
      <!-- 侧边栏 -->
      <el-aside width="200px" class="sidebar">
        <Sidebar />
      </el-aside>
      <el-container direction="vertical">
        <!-- 顶部栏 -->
        <el-header class="header">
          <HomeHeader />
        </el-header>
        <!-- 主内容区 -->
        <el-main class="main-content">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
</template>

<script setup>
import Sidebar from '@/components/common/Sidebar.vue'
import HomeHeader from '@/components/common/HomeHeader.vue'
</script>

<style scoped>

.container {
  height: 100vh;
}
.sidebar {
  background: #304156;
  color: #fff;
  height: 100%;
}
.header {
  height: 8%;
  background: #fff;
  box-shadow: 0 2px 8px #f0f1f2;
  /* padding: 0 24px; */
}
.main-content {
  /* height: calc(100vh - 8vh); */
  height: 92%;
  background: #fff;
  overflow: auto;
  padding: 0;
  background: #f5f6fa;        /* 浅灰色背景，提升层次感 */
  
}
</style>
