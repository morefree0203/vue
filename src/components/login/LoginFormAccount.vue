<template>
  <!-- 错误信息显示区域 -->
    <div  class="error-message">
      {{ errorMessage }}
    </div>
    <form class="form" @submit.prevent="onSubmit">
      
    
      <div class="input-group">
        <input v-model="account.id" type="text" :placeholder="$t('form.id')" required />
      </div>
      <div class="input-group">
        <input v-model="account.password" type="password" :placeholder="$t('form.password')" required />
      </div>
      <div class="input-group">
        <select v-model="account.role" class="login-select" required>
          <option value="student">{{ $t('form.UserLogin') }}</option>
          <option value="admin">{{ $t('form.AdminLogin') }}</option>
        </select>
      </div>
      <div class="form-options">
        <label>
          <input type="checkbox" v-model="remember" />
          {{ $t('form.remember') }}
        </label>
        <router-link to="/findpassword" class="forgot">{{ $t('form.forgot') }}</router-link>
      </div>
      <button type="submit" class="login-btn">{{ $t('form.loginBtn') }}</button>
      <div class="form-tip">
        {{ $t('form.loginTip') }}
      </div>  
    </form>
  </template>
  
  <script setup>
  import {ElMessage} from 'element-plus'
  import request from "@/utils/request.js";
  import { reactive, ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'

  const remember = ref(false)
  const errorMessage = ref('')
  const router = useRouter()
  const account = reactive({
    id: '',
    password: '',
    role: 'student' // 默认选择普通用户
  })

  // 页面加载时检查是否之前勾选了记住账号密码
  onMounted(() => {
    const rememberLogin = localStorage.getItem('rememberLogin')
    if (rememberLogin === 'true') {
      remember.value = true
      // 自动填入保存的账号密码
      const savedAccount = localStorage.getItem('savedAccount')
      if (savedAccount) {
        const accountData = JSON.parse(savedAccount)
        account.id = accountData.id || ''
        account.password = accountData.password || ''
        account.role = accountData.role || 'student'
      }
    }
  })

  const onSubmit = () => {
    // 清除之前的错误信息
    errorMessage.value = ''


    request.post('/api/login', account).then((res) => {
        if (res.code === '200') {
          // 根据是否勾选记住账号密码来决定存储方式
          if (remember.value) {
            // 勾选了记住账号密码，保存账号密码到localStorage
            localStorage.setItem('rememberLogin', 'true')
            localStorage.setItem('savedAccount', JSON.stringify({
              id: account.id,
              password: account.password,
              role: account.role
            }))
          } else {
            // 未勾选记住账号密码，清除保存的账号密码
            localStorage.removeItem('rememberLogin')
            localStorage.removeItem('savedAccount')
          }
          
          // 登录状态使用sessionStorage存储（会话存储，关闭浏览器后清除）
          sessionStorage.setItem('token', res.data.token)
          sessionStorage.setItem('account', JSON.stringify(res.data))
          
          if (res.data.role === 'admin') {
            router.push('/Home')
          } else {
            router.push('/Home')
          }
          ElMessage.success('登录成功')
        } else {
          ElMessage.error(res.msg || '出错啦')
        }
      })


  }
  </script>
  
  <style scoped>
  .form {
    display: flex;
    flex-direction: column;
    gap: 18px;
    width:100%;
  }
  .error-message {
    color: rgb(238, 75, 75);
    font-size: 0.85rem;
    text-align: center;
    width: 90%;
    height: 20px;
    line-height: 0px; /* 添加这行，让文字垂直居中 */
  }
  .input-group input {
    width: 90%;
    padding: 14px 16px;
    border: 1.5px solid #e3e8f0;
    border-radius: 6px;
    font-size: 1.1rem;
    background: #f7f9fa;
    outline: none;
    transition: border 0.2s;
    margin: 0 auto; /*上下边距 0，左右自动*/
  }
  .input-group input:focus {
    border: 1.5px solid #085bb6;
    background: #fff;
  }
  .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1rem;
    color: #666;
    width: 90%;
    margin: 0 auto; /* 上下边距 0，左右自动 */
  }
  .forgot {
    color: #085bb6;
    text-decoration: none;
    font-size: 1rem;
  }
  .forgot:hover {
    text-decoration: underline;
  }
  .login-btn {
    width: 90%;
    background: #085bb6;
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 14px 0;
    font-size: 1.2rem;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s;
    margin: 10px auto; /* 上下边距 0，左右自动 */
  }
  .login-btn:hover {
    background: #003e7e;
  }
 
  .form-tip {
    color: #888;
    font-size: 0.95rem;
    margin-top: 8px;
    width: 100%;
    margin: 10px auto; /* 上下边距 0，左右自动 */
  }
  @media (max-width: 900px) {
    .form {
      gap: 12px;
    }
    .input-group input {
      font-size: 1rem;
      padding: 25px 8px;
      width: 97%;
      margin: 5px auto;
    }
    .login-btn {
      width: 70%;
      font-size: 1rem;
      padding: 20px 30px;
      margin: 10px auto;
    }
  }
  .login-select {
    width: 90%;
    padding: 14px 16px;
    border: 1.5px solid #e3e8f0;
    border-radius: 6px;
    font-size: 1.1rem;
    background: #f7f9fa;
    outline: none;
    margin: 0 auto;
    box-sizing: border-box;
    appearance: none; /* 去除系统默认样式 */
    -webkit-appearance: none;
    -moz-appearance: none;
    color: #333;
    transition: border 0.2s, background 0.2s;
    position: relative;
    background-image: url("data:image/svg+xml;charset=UTF-8,<svg width='16' height='16' viewBox='0 0 16 16' fill='gray' xmlns='http://www.w3.org/2000/svg'><path d='M4 6l4 4 4-4' stroke='%23999' stroke-width='2' fill='none' stroke-linecap='round'/></svg>");
    background-repeat: no-repeat;
    background-position: right 16px center;
    background-size: 16px 16px;
  }

  .login-select:focus {
    border: 1.5px solid #085bb6;
    background: #fff;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 18px;
  }
  </style>
  