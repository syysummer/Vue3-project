import { createRouter, createWebHistory } from 'vue-router'
import IndexDbPage from '../views/IndexDB/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'IndexDbPage',
      component: IndexDbPage
    },
    {
      path: '/WaterFallFlow',
      name: 'WaterFallFlow',
      component: () => import('@/views/WaterFallFlow.vue'),
    },
    {
      path: '/FaceCapture',
      name: 'FaceCapture',
      component: () => import('@/views/FaceCapture.vue')
    },
    // {
    //   path: '/NavTree',
    //   name: 'NavTree',
    //   component: () => import('@/views/NavTree/index.vue')
    // },
    {
      path: '/AsyncCom',
      name: 'AsyncCom',
      component: () => import('@/views/Suspence/index.vue')
    },
    {
      path: '/TransitionCom',
      name: 'TransitionCom',
      component: () => import('@/views/TransitionCom.vue')
    },
  ]
})

export default router
