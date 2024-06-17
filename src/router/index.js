import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import frame_routes from "@/router/frame"
import login_routes from "@/router/login"

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: frame_routes.concat(login_routes)
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
