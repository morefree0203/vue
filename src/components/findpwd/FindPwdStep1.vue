<template>
  <form class="findpwd-form" @submit.prevent="onSubmit">
    <h2 class="title">{{ $t('findpwd.title') }}</h2>
    <div class="form-row">
      <span class="label">
        <span class="star">*</span> {{ $t('findpwd.role') }}：
      </span>
      <div class="radio-group">
        <label><input type="radio" v-model="role" value="student" /> {{ $t('findpwd.student') }}</label>
        <label><input type="radio" v-model="role" value="teacher" style="margin-left: 20px"/> {{ $t('findpwd.teacher') }}</label>
      </div>
    </div>

    <div class="form-row">
      <span class="label">
        <span class="star">*</span> {{ $t('findpwd.name') }}：
      </span>
      <input class="input-group" v-model="name" :placeholder="$t('findpwd.name')" @blur="validateName" />
      <div class="form-error" v-if="nameError">{{ nameError }}</div>
    </div>

    <div class="form-row">
      <span class="label"><span class="star">*</span> {{ $t('findpwd.id') }}：</span>
      <input class="input-group" v-model="id" :placeholder="$t('findpwd.id')" @blur="validateId" />
      <div class="form-error" v-if="idError">{{ idError }}</div>
    </div>
    <button class="findpwd-btn" type="submit">{{ $t('form.next') }}</button>
    <div class="form-tip">{{ $t('findpwd.tip1') }}</div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const emit = defineEmits(['success'])
const role = ref('student')
const name = ref('')
const id = ref('')
const nameError = ref('')
const idError = ref('')

function validateName() {
  nameError.value = name.value.trim() ? '' : t('form.errorRequired')
}
function validateId() {
  idError.value = id.value.trim() ? '' : t('form.errorRequired')
}
function onSubmit() {
  validateName()
  validateId()
  if (!nameError.value && !idError.value) {
    emit('success', { role: role.value, name: name.value, id: id.value })
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
.findpwd-btn:hover {
  background: #4a5edb;
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
  .radio-group {
    margin-top: 5px;
  }

  .form-row {
    flex-direction: column;
    align-items: flex-start;
  }
  .input-group{
    margin-top: 5px;
  }
  .label, .form-error {
    margin-left: 0;
    position: static;
    text-align: left;
  }
}
</style>