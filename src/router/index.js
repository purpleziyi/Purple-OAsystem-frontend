import { createRouter, createWebHashHistory } from 'vue-router'
import login from "@/views/login/login.vue"
import frame from "@/views/main/frame.vue"
import myabsent from "@/views/absent/my.vue"
import subabsent from "@/views/absent/sub.vue"
import publish from "@/views/inform/publish.vue"
import inform_detail from "@/views/inform/detail.vue"
import inform_list from "@/views/inform/list.vue"
import { useAuthStore } from '@/stores/auth'
import staffadd from "@/views/staff/add.vue"
import stafflist from "@/views/staff/list.vue"
import home from "@/views/home/home.vue"



const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),  // use HashHistory
  routes: [
    {
      path: '/',
      name: 'frame',
      component: frame,
      children: [
        { path: '/', name: 'home', component: home },
        { path: '/absent/my', name: 'myabsent', component: myabsent },
        { path: '/absent/sub', name: 'subabsent', component: subabsent },
        { path: '/inform/publish', name: 'inform_publish', component: publish },
        { path: '/inform/list', name: 'inform_list', component: inform_list },
        { path: '/inform/detail/:pk', name: 'inform_detail', component: inform_detail },
        { path: '/staff/add', name: 'staff_add', component: staffadd },
        { path: '/staff/list', name: 'staff_list', component: stafflist },

      ]
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
