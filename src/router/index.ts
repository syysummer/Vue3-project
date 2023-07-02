import { createRouter, createWebHistory } from 'vue-router'
import WaterFallFlow from '@/views/WaterFallFlow.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'WaterFallFlow',
      component: WaterFallFlow
    },
    {
      path: '/WaterFallFlow',
      name: 'WaterFallFlow',
      component: WaterFallFlow
    },
    {
      path: '/FaceCapture',
      name: 'FaceCapture',
      component: () => import('@/views/FaceCapture.vue')
    },
    {
      path: '/NavTree',
      name: 'NavTree',
      component: () => import('@/views/NavTree.vue')
    },
  ]
})

export default router
