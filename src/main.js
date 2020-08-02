import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/css/global.css'


// 导入nprogress
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.config.productionTip = false

// axios配置
import axios from 'axios'
axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:3000'
Vue.prototype.$request = axios
// 请求拦截器
// 在request拦截器中显示进度条， NProgress.start()
axios.interceptors.request.use(config =>{
  NProgress.start()
  // config.headers.origin = 'http://localhost:8080'
  // config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 在response拦截器中显示进度条， NProgress.done()
axios.interceptors.response.use(config =>{
  NProgress.done()
  // config.headers.origin = 'http://localhost:8080'
  // config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.filter('dataFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  return `${y}-${m}-${d}`
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
