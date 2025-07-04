<template>
    <div class="login-header">
    <img class="logo" src="@/assets/logo.png" alt="logo" />
    <div class="title">{{ $t('header.title') }}</div>
      <button class="lang-btn" @click="toggleLang">{{ $t(currentLang === 'zh' ? 'header.english' : 'header.chinese') }}</button>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'
const { locale } = useI18n()
const currentLang = computed(()=>locale.value)
function toggleLang() {
  locale.value = locale.value === 'zh' ? 'en' : 'zh'
}
</script>

<style scoped>
.login-header {
  height: 76px;
  background: #085bb6;
  display: flex;
  align-items: center;
  padding: 0px 32px;
  color: #fff;
  justify-content: space-between;
}
.logo {
  height: 50px;
  margin-right: 18px;
}
.title {
  font-size: 1.6rem;
  font-weight: bold;
  flex: 1;
  margin-left: 12px;
}

.lang-btn {
  background: none;
  border: 1px solid #fff;
  color: #fff;
  border-radius: 6px;
  padding: 4px 16px;
  font-size: 1rem;
  cursor: pointer;
}
  </style>
