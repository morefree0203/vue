import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import header from './i18n/header'
import footer  from './i18n/footer'
import form from './i18n/form'
import findpwd from './i18n/findpwd'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
// 引入 Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 引入 Element Plus 中文语言包
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { useUserStore } from '@/stores/user'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

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

const app = createApp(App)
export const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(i18n)
app.use(pinia)
app.use(router)

// 使用 Element Plus，配置中文语言包
app.use(ElementPlus, {
  locale: zhCn
})


app.mount('#app')