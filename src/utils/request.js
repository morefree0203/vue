import axios from 'axios'
import { useToken } from '@/stores/token.js'



const instance = axios.create({
  baseURL: 'http://localhost:8080/',
  // baseURL: '/api',
  timeout: 5000,
})
// request 拦截器
// 可以自请求发送前对请求做一些处理
// 比如统一加token，对请求参数统一加密
instance.interceptors.request.use(
    (config) => {
        config.headers['Content-Type'] = 'application/json;charset=utf-8'
        let account = localStorage.getItem('account') ? JSON.parse(localStorage.getItem('account')) : null
        if (account) {
            config.headers['token'] = account.token // 设置请求头
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
);

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    let res = response.data
    // 如果是返回的文件
    console.log(typeof(res))
    if (response.config.responseType === 'blob') {
        return res
    }
    // 兼容服务端返回的字符串数据
    if (typeof res === 'string') {
        res = res ? JSON.parse(res) : res
    }
    // 当权限验证不通过的时候给出提示
    if (res.code === '401') {
        ElMessage.error(res.msg)
        // 跳转到登录页面
        router.push('/login')
    }
    return res
  },
  function (error) {
    console.log('error' + error) // for debug
    return Promise.reject(error)
  }
);

export default instance;

