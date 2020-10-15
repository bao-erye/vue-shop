import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
// 导入图标样式
import './assets/font/iconfont.css'
// 导入第三方组件
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器组件
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
// 导入axiso
import axios from 'axios'

// import { config } from 'vue/types/umd'

Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axiso请求拦截
axios.interceptors.request.use(config => {
  console.log(config)
  // 在requrst中展示进度条
  // 为请求头对象添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.config.productionTip = false

// 注册第三方组件
Vue.component('tree-table', TreeTable)
// 注册富文本编辑器为全局组件
Vue.use(VueQuillEditor)
// 注册一个全局过滤器
Vue.filter('dateFormate', function(originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
