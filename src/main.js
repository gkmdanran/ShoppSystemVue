// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/global.css'
Vue.config.productionTip = false
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'; /* 引入axios进行地址访问*/
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
Vue.use(VueQuillEditor)
Vue.prototype.$http = axios;
axios.defaults.baseURL="http://127.0.0.1:8888/api/private/v1/"

axios.interceptors.request.use(config=>{
  NProgress.start()
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config
})

axios.interceptors.response.use(config=>{
  NProgress.done()
  return config
})

Vue.component('tree-table',TreeTable)
Vue.filter('dateFormat',function(originVal){
      const dt=new Date(originVal)
      const y=dt.getFullYear()
      const m=(dt.getMonth()+1+'').padStart(2,'0')
      const d=(dt.getDate()+'').padStart(2,'0')
      const h=(dt.getHours()+'').padStart(2,'0')
      const mm=(dt.getMinutes()+'').padStart(2,'0')
      const s=(dt.getSeconds()+'').padStart(2,'0')
      return `${y}-${m}-${d} ${h}:${mm}:${s}`
})


import './assets/fonts/iconfont.css'
Vue.use(ElementUI)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
