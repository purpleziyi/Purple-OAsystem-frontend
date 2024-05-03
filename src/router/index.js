import { createRouter, createWebHashHistory } from 'vue-router'
import login from "@/views/login/login.vue"
import frame from "@/views/main/frame.vue"
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),  // use HashHistory
  routes: [
    {
      path: '/',
      name: 'frame',
      component: frame
    },
    {
      path: '/login',
      name: 'login',
      component: login
    }
  ]
})


// Global Navigation Guards 全局导航守卫
router.beforeEach((to, from) => {
  // Check if user is logged in
  // 如果没有登录并且访问的页面不是登录页面，那么就要跳转到登录页面
  const authStore = useAuthStore()                  // 导入'@/stores/auth'，因为用户信息都是保存在auth.js中 
  if (!authStore.is_logined && to.name != 'login') {
    return { name: 'login' }
  }
})

export default router
