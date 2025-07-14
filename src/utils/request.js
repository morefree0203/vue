import axios from 'axios'
import { useToken } from '@/stores/token.js'
import { ElMessage } from 'element-plus'

const instance = axios.create({
  baseURL: 'http://localhost:8080/',
  // baseURL: '/api',
  timeout: 50000000,
})

// 获取token（只从sessionStorage获取）
const getToken = () => {
  return sessionStorage.getItem('token')
}

// request 拦截器
// 可以自请求发送前对请求做一些处理
// 比如统一加token，对请求参数统一加密
instance.interceptors.request.use(
    (config) => {
        config.headers['Content-Type'] = 'application/json;charset=utf-8'
        const token = getToken()
        if (token) {
            config.headers['token'] = token // 设置请求头
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
    console.log(222)
    let res = response.data
    console.log(res)
    // 如果是返回的文件
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
        // 清除无效的token
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('account')
        // 跳转到登录页面
        window.location.href = '/login'
    }
    return res
  },
  function (error) {
    console.log('error' + error) // for debug
    return Promise.reject(error)
  }
);

export default instance;

