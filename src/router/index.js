import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index'
// 路由数据
import routes from './routes'
import util from '@/libs/util.js'
// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { cloneDeep, isEmpty } from 'lodash'
import {
  getMenuListByUser,
  getCrumbsList,
  checkAccess,
  clearUserMenuAndPageListCatch
} from '@/menu/handleMenu'

// 解决路由报错问题 fix vue-router NavigationDuplicated
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return VueRouterPush.call(this, location).catch(err => err)
}
const VueRouterReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace(location) {
  return VueRouterReplace.call(this, location).catch(err => err)
}
Vue.use(VueRouter)

// 导出路由 在 main.js 里使用
const router = new VueRouter({
  routes
})

// 路由拦截 权限校验
const routerCheck = (to, from) => {
  // 验证当前路由所有的匹配中是否需要有登录验证的
  if (to.matched.some(r => r.meta.auth)) {
    // 当前用户信息
    let userInfo = store.state.d2admin.user.info
    // 这里暂时将cookie里是否存有token作为验证是否登录的条件
    const token = util.cookies.get('token')
    // 登录拦截，当前用户如果为新用户标识, 需修改密码后才能登录
    const newuserstate = util.cookies.get('newuserstate')
    // 如果没有token、标记用户是新用户、用户信息为空都去登录页
    if (!isEmpty(userInfo)) {
      // 清除当前用户的权限相关数据
      // clearUserMenuAndPageListCatch()
      // 清除当前用户的访问来源缓存
      // window.localStorage.removeItem('user_access_source')
      if (to.name === 'login') {
        return null
      } else {
        return {
          name: 'login'
        }
      }
    }

    // 当前用户已经是正常登录状态，如果去登录页，就重定向到首页
    if (to.name === 'login') {
      return {
        name: 'index'
      }
    }

    // 获取用户对应的可见页面列表
    let { allRouterListByRole } = getMenuListByUser(userInfo)

    // 判断要打开的路由当前用户是否有权限，没权限打开404页面
    // if (!checkAccess(to, allRouterListByRole)) {
    //   return {
    //     name: '404'
    //   }
    // }
    // 设置要打开的路由的面包屑数据 将当前路由的面包屑添加到对应路由的meta属性
    let crumbsList = getCrumbsList(to, from, allRouterListByRole)
    if (crumbsList.length > 0) {
      to.meta.crumbsList = cloneDeep(crumbsList)
    }
    return null
  } else {
    // 不需要身份校验 直接通过
    return null
  }
}

/**
 * 路由拦截
 * 权限验证
 */
router.beforeEach(async (to, from, next) => {
  // 确认已经加载多标签页数据 https://github.com/d2-projects/d2-admin/issues/201
  await store.dispatch('d2admin/page/isLoaded')
  // 确认已经加载组件尺寸设置 https://github.com/d2-projects/d2-admin/issues/198
  await store.dispatch('d2admin/size/isLoaded')
  // 进度条
  NProgress.start()
  // 关闭搜索面板
  store.commit('d2admin/search/set', false)
  // 进度条
  NProgress.start()
  let nextPage = routerCheck(to, from)
  nextPage ? next(nextPage) : next()
  NProgress.done()
})

router.afterEach(to => {
  // 进度条
  NProgress.done()
  // 多页控制 打开新的页面
  store.dispatch('d2admin/page/open', to)
  // 更改标题
  util.title(to.meta.title)
   // 此处手动上报 $pageview 事件
   try {
    Vue.prototype.$nextTick(() => {
      if (Vue.prototype.$jySensors) {
        Vue.prototype.$jySensors.trackSinglePageview()
      }
    })
  } catch (e) {}
})

export default router
