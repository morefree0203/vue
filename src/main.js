  import { createApp } from 'vue'
  import { createI18n } from 'vue-i18n'
  import header from './i18n/header'
  import footer  from './i18n/footer'
  import form from './i18n/form'
  import findpwd from './i18n/findpwd'
  import App from './App.vue'
  import router from './router'
  import { createPinia } from 'pinia'


  const messages = {
    zh: {
      header:header.zh,
      footer:footer.zh,
      form:form.zh,
      findpwd: findpwd.zh,
    },
    en: {
      header:header.en,
      footer:footer.en,
      form:form.en,
      findpwd: findpwd.en,
    }
  }

  const i18n = createI18n({
    legacy: false, // 使用 Composition API 模式
    locale: 'zh',
    messages
  })

  const piana = createPinia(App)
  const app = createApp(App)
  app.use(i18n)
  app.use(router)
  app.use(piana)
  app.mount('#app')
