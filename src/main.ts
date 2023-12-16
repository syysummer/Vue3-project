import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { loadEchartsPlus } from '@/plugins/echarts'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// 注册echart组件
loadEchartsPlus(app)

app.use(createPinia())
app.use(router)

app.mount('#app')
