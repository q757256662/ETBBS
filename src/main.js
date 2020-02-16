import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n


import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'
import axios from 'axios';
//导入icon
import '@/assets/icons/iconfont.css'


import '@/icons' // icon
import '@/permission' // permission control 路由匹配规则

import './directive/dialogDrag'; //放大模态框
import VueBus from 'vue-bus'
Vue.use(ElementUI, { locale })
Vue.prototype.$http = axios;
Vue.prototype.$axios = axios;
Vue.use(VueBus)

String.prototype.trim = function () {
  return this.replace(/(^\s*)|(\s*$)/g, "");
}

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
