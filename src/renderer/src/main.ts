import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import naiveUI from 'naive-ui'
import router from './route/route'
import 'naive-ui/lib/styles'
let vue = createApp(App)
vue.use(naiveUI)
vue.use(router)
vue.mount('#app')