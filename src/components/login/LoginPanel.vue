<template>
    <div class="panel">
      <div class="panel-tabs">
        <div :class="['tab', tab==='account' && 'active']" @click="tab='account'">{{ $t('form.login') }}</div>
        <!-- <div :class="['tab', tab==='phone' && 'active']" @click="tab='phone'">{{ $t('form.phoneLogin') }}</div> -->
      </div>
      <div class="panel-content">
        <LoginFormAccount v-if="tab==='account'" />
        <!-- <LoginFormPhone v-else /> -->
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import LoginFormAccount from './LoginFormAccount.vue'
  import LoginFormPhone from './LoginFormPhone.vue'
  const tab = ref('account')
  </script>
  
  <style scoped>
  .panel {
    width: 100vw;
    width: 300px; 
     min-width: 300px; 
     max-width: 400px; 
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 16px rgba(0,0,0,0.08);
    margin: 30px 0 0 0;
    padding: 32px 32px 24px 32px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    margin-right: 20px;
    margin-left: 20px ;
  }
  .panel-tabs {
    display: flex;
    border-bottom: 2px solid #f0f0f0;
    margin-bottom: 24px;
  }
  .tab {
    flex: 1;
    text-align: center;
    font-size: 1.3rem;
    font-weight: bold;
    color: #666;
    padding: 16px 0 12px 0;
    cursor: pointer;
    background: #f7f9fa;
    border-radius: 10px 10px 0 0;
    transition: color 0.2s, background 0.2s;
  }
  .tab.active {
    color: #085bb6;
    background: #fff;
    border-bottom: 2px solid #085bb6;
  }
  .panel-content {
    margin-top: 12px;
  }
  @media (max-width: 900px) {
    .panel {
      width: 90%;
      min-width: unset;
      max-width: unset;
      /* margin: 24px auto 0 auto;
      padding: 18px 4vw 18px 4vw;
      border-radius: 0;
      box-shadow: none; */
      margin: 12px 0 0 auto;
      padding: 12px 2vw 12px 2vw;
      border-radius: 0;
      box-shadow: none;
    }
  }
  </style>
  