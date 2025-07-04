<template>
    <form class="findpwd-form" @submit.prevent="onSubmit">
      <h2 class="title">{{ $t('findpwd.title') }}</h2>

      <div class="form-row">
        <span class="label">
          <span class="star">*</span> {{ $t('form.password') }}：
        </span>
        <input class="input-group" v-model="pwd" type="password" :placeholder="$t('form.password')" @blur="validatePwd" />
        <div class="form-error" v-if="pwdError">{{ pwdError }}</div>
      </div>

      <div class="form-row">
        <span class="label"><span class="star">*</span> {{ $t('form.confirmPassword') }}：</span>
        <input class="input-group" v-model="pwd2" type="password" :placeholder="$t('form.confirmPassword')" @blur="validatePwd2" />
        <div class="form-error" v-if="pwd2Error">{{ pwd2Error }}</div>
      </div>

      <div class="form-row">
        <span class="label">
          <span class="star">*</span> {{ $t('findpwd.type') }}：
        </span>
        <div  class="radio-group" >
          <label><input type="radio" v-model="type" value="phone" /> {{ $t('findpwd.phone') }}</label>
          <label><input type="radio" v-model="type" value="email" style="margin-left: 20px;" /> {{ $t('findpwd.email') }}</label>
        </div>
        
      </div>

      <div class="form-row">
        <span class="label">
          <span class="star">*</span> {{ $t('findpwd.phoneNum') }}：
        </span>
        <input class="input-group" v-model="phone" :placeholder="$t('findpwd.phoneNum')" />
        <!-- <span class="bind-info">{{ $t('findpwd.bindInfo') }}1****36</span> -->
      </div>


      <div class="form-row">
        <span class="label">
          <span class="star">*</span> {{ $t('form.code') }}：
        </span>
        <div class="radio-group">
          <input class="input-group" v-model="code" :placeholder="$t('form.code')" style="width: 120px;" />
           <button type="button" class="code-btn" @click="sendCode" :disabled="countdown>0">
              {{ countdown>0 ? countdown+'s' : $t('form.getCode') }}
          </button>
        </div>
     
        <div class="form-error" v-if="codeError">{{ codeError }}</div>
      </div>
      
      <div class="form-row btn-row">
        <button class="findpwd-btn gray" type="button" @click="emit('back')">{{ $t('form.prev') }}</button>
        <button class="findpwd-btn" type="submit">{{ $t('form.submit') }}</button>
      </div>
      <div class="form-tip">{{ $t('findpwd.pwdLen') }}</div>
    </form>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  const emit = defineEmits(['success', 'back'])
  const pwd = ref('')
  const pwd2 = ref('')
  const type = ref('phone')
  const phone = ref('')
  const code = ref('')
  const countdown = ref(0)
  const pwdError = ref('')
  const pwd2Error = ref('')
  const codeError = ref('')
  let timer = null
  
  function validatePwd() {
    pwdError.value = (pwd.value.length < 8 || pwd.value.length > 16) ? $t('form.errorPwdLen') : ''
  }
  function validatePwd2() {
    pwd2Error.value = (pwd.value !== pwd2.value) ? $t('form.errorPwd2') : ''
  }
  function validateCode() {
    codeError.value = (code.value !== '123456') ? $t('form.errorCode') : ''
  }
  function sendCode() {
    if (countdown.value > 0) return
    countdown.value = 60
    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) clearInterval(timer)
    }, 1000)
  }
  function onSubmit() {
    validatePwd()
    validatePwd2()
    validateCode()
    if (!pwdError.value && !pwd2Error.value && !codeError.value) {
      emit('success')
    }
  }
  </script>
  
  <style scoped>
.findpwd-form {
  width: 500px;
  margin: 50px auto 0 auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  font-family: 'Microsoft YaHei', Arial, sans-serif;
}
.title {
  text-align: left;
  margin-left: 0;
  margin-bottom: 32px;
  font-weight: 500;
  color: #222;
  font-size: 1.2rem;
  letter-spacing: 1px;
  margin-left: 15px;
}
.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 22px;
  position: relative;
}
.label {
  width: 116px;
  color: #333;
  font-size: 1rem;
  flex-shrink: 0;
  text-align: right;
  margin-right: 16px;
  font-family: inherit;
}
.star {
  color: #e53935;
  margin-right: 2px;
}
.input-group{
  flex: 1;
  width: 350px;
  padding: 10px 15px;
  border: 1px solid #e3e8f0;
  border-radius: 4px;
  font-size: 1rem;
  background: #fff;
  outline: none;
  transition: border 0.2s;
  font-family: inherit;
  background-color: #fcfcfc;
}
input:focus {
  border: 1px solid #085bb6;
  background: #fff;
}
.radio-group {
  display: flex;
  align-items: center;
  gap: 24px; /* 控制单选项间距 */
  white-space: nowrap; /* 防止换行 */
}
.radio-group label {
  font-size: 1.2em;
  margin-bottom: 0;
}

.code-btn {
  margin-left: 12px;
  background: none;
  border: none;
  color: #3493bc;
  cursor: pointer;
  font-size: 1rem;
  padding: 0 8px;
}
.code-btn:disabled {
  color: #aaa;
  cursor: not-allowed;
}
.findpwd-btn {
  width: 170px;
  background: #3493bc;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 10px 0;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 18px;
  margin-bottom: 8px;
  transition: background 0.2s;
  letter-spacing: 2px;
  margin:0 auto;
}
.findpwd-btn.gray {
  background: #f0f0f0;
  color: #666;
}
.findpwd-btn:hover:not(.gray) {
  background: #4a5edb;
}
.btn-row {
  display: flex;
  justify-content: space-between;
}
.form-tip {
  color: #888;
  font-size: 0.95rem;
  margin-top: 28px;
  text-align: center;
  letter-spacing: 1px;
}
.form-error {
  color: #e53935;
  font-size: 0.95rem;
  margin-left: 132px;
  margin-top: 4px;
  min-height: 18px;
  position: absolute;
  left: 0;
  bottom: -20px;
}
@media (max-width: 600px) {
  .findpwd-form {
    width: 98vw;
    padding: 0 2vw;
  }
  .form-row {
    flex-direction: column;
    align-items: flex-start;
  }
  .label, .form-error {
    margin-left: 0;
    position: static;
    text-align: left;
  }
  .findpwd-btn {
    width: 100%;
    margin: 8px 0;
  }
  .btn-row {
    flex-direction: column;
    align-items: stretch;
  }
  .input-group{
    margin-top: 5px;
  }
  .radio-group{
    margin-top:5px;
  }
}
</style>