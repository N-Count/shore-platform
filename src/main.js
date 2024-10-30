// Vue
import Vue from 'vue'
import i18n from './i18n'
import App from './App'
// 核心插件
import d2Admin from '@/plugin/d2admin'
// store
import store from '@/store/index'

// 菜单和路由设置import store from '@/store/index'
import router from './router'
import { frameInRoutes } from '@/router/routes'

// 通用组件注册
import '@/views/components'
// 通用方法注册
import util from '@/libs/util'
import constant from './globalConstant/constant'

// 通用全局指令
import directives from './directives'
import 'echarts/lib/component/title'

// 过滤器
import './filter/index'
// echarts
import echarts from 'echarts'
// 懒加载
import VueLazyload from 'vue-lazyload'
import './directive'

Vue.prototype.$echarts = echarts
Vue.prototype.util = util
Vue.prototype.constant = constant

// 核心插件
Vue.use(d2Admin)

// 指令
Vue.use(directives)



Vue.use(VueLazyload, {
  preLoad: 1.3, // proportion of pre-loading height
  // loading: loadimage, // src of the image while loading
  attempt: 3 // attempts count
})

// 在vue中对click添加节流处理
const on = Vue.prototype.$on
// 节流时间0.5s
const throttleTime = 500

Vue.prototype.$echarts = echarts
Vue.config.productionTip = false

Vue.prototype.$on = function (event, func) {
  let previous = 0
  let newFunc = func
  if (event === 'click') {
    newFunc = function () {
      const now = new Date().getTime()
      if (previous + throttleTime <= now) {
        func.apply(this, arguments)
        previous = now
      }
    }
  }
  on.call(this, event, newFunc)
}

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
  created() {
    // 处理路由 得到每一级的路由设置
    this.$store.commit('d2admin/page/init', frameInRoutes)
  },
  mounted() {
    // 展示系统信息
    this.$store.commit('d2admin/releases/versionShow')
    // 用户登录后从数据库加载一系列的设置
    this.$store.dispatch('d2admin/account/load')
    // 获取并记录用户 UA
    this.$store.commit('d2admin/ua/get')
    // 初始化全屏监听
    this.$store.dispatch('d2admin/fullscreen/listen')
    // 关闭页面过渡效果
    this.$store.dispatch('d2admin/transition/set', false)
  }
}).$mount('#app')

window.onunhandledrejection = function (e) {
  console.error(e)
}

