import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useHomeRouters = defineStore('homeRouters', () => {

  const homeRouters = ref([
    {
      id: 0,
      component: '',
      path: '',
      menuName:'',
    }
  ])

  const getHomeRouters = () => {
    return homeRouters.value
  }

  // 箭头函数赋值
  const setHomeRouters = (newRouters) => {
    homeRouters.value = newRouters.map(({id, component, path, menuName}) => ({id,component,path,menuName}));
  }
  return { getHomeRouters, setHomeRouters }
})
