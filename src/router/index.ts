import { createRouter, createWebHistory } from 'vue-router'
// import IndexDbPage from '../views/IndexDB/index.vue'
// import ImgPreview from '../views/ImgPreview/index.vue'
import UploadImg from '../views/UploadImg/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'UploadImg',
      component: UploadImg
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
    {
      path: '/IndexDbPage',
      name: 'IndexDbPage',
      component: () => import('@/views/IndexDB/index.vue')
    },
    {
      path: '/NavTree',
      name: 'NavTree',
      component: () => import('@/views/NavTree/index.vue')
    },
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
    {
      path: '/EchartsPage',
      name: 'EchartsPage',
      component: () => import('@/views/EchartsDemo/index.vue')
    },
    {
      path: '/ImgPreview',
      name: 'ImgPreview',
      component: () => import('@/views/ImgPreview/index.vue')
    },
    // {
    //   path: '/UploadImg',
    //   name: 'UploadImg',
    //   component: () => import('@/views/UploadImg/index.vue')
    // },
  ]
})

export default router
