import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/Dan2json',
      name: 'Dan2json',
      component: () => import('@/views/Dan2jsonView.vue')
    },
    {
      path: '/Dan2ass',
      name: 'Dan2ass',
      component: () => import('@/views/Dan2assView.vue')
    },
    {
      path: '/DanFilter',
      name: 'DanFilter',
      component: () => import('@/views/DanFilter.vue'),
      children: [
        {
          path: '',
          component: () => import('@/views/DanFilter/0.vue')
        },
        {
          path: ':step',
          component: () => import('@/views/DanFilter/0.vue')
        }
      ]
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/AboutView.vue')
    }
  ]
})

export default router
