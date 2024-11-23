import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import naive from 'naive-ui'
import {createDiscreteApi} from 'naive-ui'
import { createPinia } from 'pinia'
import { router } from './router/router'
import axios from 'axios'


// 使用vue的方式
const app = createApp(App)
const pinia = createPinia()
const {message, notification, dialog} = createDiscreteApi(['message', 'dialog', 'notification'])

axios.defaults.baseURL = "http://127.0.0.1:3000"
app.provide("axios", axios)  // 组件依赖注入 这样在其他页面都可以使用axios
app.provide("message", message)
app.provide("notification", notification)
app.provide("dialog", dialog)
app.use(naive)
app.use(pinia)
app.use(router)



// 切记在挂载之前注册好上面的组件
app.mount('#app')