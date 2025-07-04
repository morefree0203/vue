import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToken = defineStore('token', () => {

  const token = ref('')

  const getToken = () => {
    return token.value
  }

  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  return { getToken, setToken }
},
{
  persist: true
}
)
