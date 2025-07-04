<template>
  <div class="login-page">
    <Header />
      <div class="login-main">
        <LoginBanner/>
        <LoginPanel />
      </div>
    <LoginFooter />
  </div>
</template>

<script setup>
import LoginBanner from '@/components/login/LoginBanner.vue'
import LoginPanel from '@/components/login/LoginPanel.vue'
import LoginFooter from '@/components/login/LoginFooter.vue'
import Header from '@/components/common/Header.vue'

</script>

<style scoped>
.login-page {
  min-height: 98vh;
  background: #f5f8fd;
  display: flex;
  flex-direction: column;
}

.login-main {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: stretch;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
  /* min-height: 600px; */
  min-height: 0; /* 允许压缩 */
  overflow: auto;

}


@media (max-width: 900px) {
  .login-header {
    padding: 0 10px;
    height: 56px;
  }
  .logo {
    height: 32px;
  }
  .title {
    font-size: 1.1rem;
    margin-left: 6px;
  }
  .login-main {
    flex-direction: column;
    width: 90%;
    align-items: flex-start;
  }
  .login-main {
     flex: 1 1 auto;
     overflow: visible; /* 或hidden，避免滚动条 */
     min-height: 0;
     display: flex;
     justify-content: center;
     align-items: stretch;
     width: 100%;
     max-width: 100%;
     margin: 0 auto;
     box-sizing: border-box;
   }
  .login-page {
     height: 100%;
     min-height: 100vh;
     display: flex;
     flex-direction: column;
     background: #f5f8fd;
   }
}

</style>
