<template>
  <div class="home-header">
    <div class="left-section">
      <img class="logo" src="@/assets/logo.png" alt="logo" />
      <div class="title">{{ $t('header.title') }}</div>
    </div>
    <div class="right-section">
      <div class="user-info">
        <span class="welcome">欢迎，{{ userInfo?.id || userInfo?.username || '用户' }}</span>
        <span class="role">({{ userStore.getRoleDisplayName(userInfo?.role) }})</span>
      </div>
      <button class="logout-btn" @click="handleLogout">退出登录</button>
      <!-- <button class="lang-btn" @click="toggleLang">{{ $t(currentLang === 'zh' ? 'header.english' : 'header.chinese') }}</button> -->
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const { locale } = useI18n()
const router = useRouter()
const currentLang = computed(() => locale.value)
const userStore = useUserStore()
// 使用 computed 来响应式获取 userInfo
const userInfo = computed(() => userStore.userInfo)

// function toggleLang() {
//   locale.value = locale.value === 'zh' ? 'en' : 'zh'
// }

// 退出登录
const handleLogout = () => {
  // 只清除sessionStorage中的登录信息，保留localStorage中的账号密码
  sessionStorage.removeItem('token')
  sessionStorage.removeItem('account')
  
  ElMessage.success('退出登录成功')
  router.push('/login')
}

</script>

<style scoped>
.home-header {
  height: 8vh;
  background: #085bb6;
  display: flex;
  align-items: center;
  padding: 0px 32px;
  color: #fff;
  justify-content: space-between;
}

.left-section {
  display: flex;
  align-items: center;
}

.logo {
  height: 50px;
  margin-right: 18px;
}

.title {
  font-size: 1.6rem;
  font-weight: bold;
  margin-left: 12px;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.welcome {
  font-size: 1rem;
  font-weight: 500;
}

.role {
  font-size: 0.9rem;
  opacity: 0.8;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
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

@media (max-width: 900px) {
  .home-header {
    padding: 0px 16px;
  }
  
  .right-section {
    gap: 10px;
  }
  
  .user-info {
    display: none;
  }
  
  .title {
    font-size: 1.2rem;
  }
}
</style> 