import { createRouter, createWebHashHistory } from 'vue-router'
import login from "@/views/login/login.vue"
import frame from "@/views/main/frame.vue"


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

export default router
