<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style>
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;

  }
  .main-content {
    height: 92%;
    box-sizing: border-box;
    background: #f5f6fa;
    overflow: auto;
    display: flex;
    flex-direction: column;
  }
  .student-evaluation {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    padding: 20px; /* 你想要的padding */
    min-height: 0; /* 关键，防止flex子项溢出 */
  }
  .evaluation-card {
    max-width: 900px;
    margin: 0 auto;
  }
</style>
