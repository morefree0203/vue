<template>
    <div class="findpwd-page">
      <Header />
      <div class="findpwd-main">
        <FindPwdStep1 v-if="step === 1" @success="handleStep1Success" />
        <FindPwdStep2 v-if="step === 2" :userInfo="userInfo" @back="step=1" @success="handleStep2Success" />
      </div>
      <Footer />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import Header from '@/components/common/Header.vue'
  import Footer from '@/components/login/LoginFooter.vue'
  import FindPwdStep1 from '@/components/findpwd/FindPwdStep1.vue'
  import FindPwdStep2 from '@/components/findpwd/FindPwdStep2.vue'
  
  const step = ref(1)
  const userInfo = ref({})
  
  function handleStep1Success(data) {
    userInfo.value = data
    step.value = 2
  }
  function handleStep2Success() {
    // 可在此处弹窗或跳转
    window.location.href = '/login'
  }
  </script>
  
  <style scoped>
  .findpwd-page {
    min-height: 95vh;
    background: #fff;
    display: flex;
    flex-direction: column;
  }
  .findpwd-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    margin-top: 40px;
    min-height: 400px;
  }
  </style>