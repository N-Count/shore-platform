import { MessageBox } from 'element-ui'
import setting from '@/setting.js'
import util from '@/libs/util.js'
import constant from '@/globalConstant/constant.js'
import router from '@/router'
import store from '@/store/index'
import { AccountLogin, AccountLogout, UserInfo } from '@api/bus-frp-agg'

export default {
  namespaced: true,
  actions: {
    /**
     * @description 登录
     * @param {Object} context
     * @param {Object} payload token {String} 用户标识
     * @param {Object} payload route {Object} 登录成功后定向的路由对象 任何 vue-router 支持的格式
     */
    login(
      { dispatch },
      {
        account = '',
        loginPwd = '',
        loginMethod = '',
        continueLoginFlag = '',
        deviceId = util.randomString(),
        authCode = '',
        authCodeToken = ''
      } = {}
    ) {
      return new Promise((resolve, reject) => {
        // 开始请求登录接口
        AccountLogin({
          account: account,
          loginPwd: util.getRsaCode(loginPwd),
          loginMethod: loginMethod,
          continueLoginFlag: continueLoginFlag,
          deviceId: deviceId,
          authCode: authCode,
          authCodeToken: authCodeToken,
          handlerBusinessError: true
        })
          .then(async res => {
            let userInfo = await dispatch(
              'd2admin/account/loadUserInfo',
              { loginUserInfo: { ...res, deviceId: deviceId } },
              { root: true }
            )
            // 结束
            resolve(userInfo)
          })
          .catch(err => {
            console.log('err: ', err)
            reject(err)
          })
      })
    },
    /**
     * @description 注销用户并返回登录页面
     * @param {Object} context
     * @param {Object} payload confirm {Boolean} 是否需要确认
     */
    logout({ commit, dispatch }, { confirm = false } = {}) {
      /**
       * @description 注销
       */
      async function logout() {
        // 删除cookie
        util.cookies.remove('token')
        util.cookies.remove('uuid')
        // 跳转路由
        router.push({
          name: 'login'
        })
        // 清空 vuex 用户信息
        await dispatch('d2admin/user/set', {}, { root: true })
        // 关闭所有已打开页面
        await dispatch('d2admin/page/closeAll', {}, { root: true })
      }
      // 判断是否需要确认
      if (confirm) {
        commit('d2admin/gray/set', true, { root: true })
        MessageBox.confirm('确定要退出当前用户吗', '退出用户', {
          type: 'warning'
        })
          .then(() => {
            commit('d2admin/gray/set', false, { root: true })
            AccountLogout().then(() => {
              logout()
            })
          })
          .catch(() => {
            commit('d2admin/gray/set', false, { root: true })
          })
      } else {
        logout()
      }
    },
    /**
     * @description 用户登录后从持久化数据加载一系列的设置
     * @param {Object} context
     */
    load({ dispatch }) {
      return new Promise(async resolve => {
        // DB -> store 加载用户名
        await dispatch('d2admin/user/load', null, { root: true })
        // DB -> store 加载主题
        await dispatch('d2admin/theme/load', null, { root: true })
        // DB -> store 加载页面过渡效果设置
        await dispatch('d2admin/transition/load', null, { root: true })
        // DB -> store 持久化数据加载上次退出时的多页列表
        await dispatch('d2admin/page/openedLoad', null, { root: true })
        // DB -> store 持久化数据加载侧边栏折叠状态
        await dispatch('d2admin/menu/asideCollapseLoad', null, { root: true })
        // DB -> store 持久化数据加载全局尺寸
        await dispatch('d2admin/size/load', null, { root: true })
        // DB -> store 持久化数据加载颜色设置
        await dispatch('d2admin/color/load', null, { root: true })
        // end
        resolve()
      })
    },

    /**
     * 用户登录成功后加载存储信息
     * @param {Object} userInfo 登录接口返回的用户信息
     * @returns 返回用户信息
     */
    loadUserInfo({ dispatch }, { loginUserInfo = {} } = {}) {
      return new Promise(async resolve => {
        // 设置 cookie 一定要存 uuid 和 token 两个 cookie
        // 整个系统依赖这两个数据进行校验和存储
        util.cookies.set('uuid', loginUserInfo.userId)
        util.cookies.set('token', loginUserInfo.token)
        util.cookies.set('deviceId', loginUserInfo.deviceId)
        let userInfo = await UserInfo()
        loginUserInfo = { ...loginUserInfo, ...userInfo }
        // 设置 vuex 用户信息
        await dispatch('d2admin/user/set', loginUserInfo, { root: true })
        // 用户登录后从持久化数据加载一系列的设置
        await dispatch('load')
        // 如果返回数据有颜色值
        let activeName = await dispatch(
          'd2admin/db/get',
          {
            dbName: 'sys',
            path: 'theme.activeName',
            defaultValue: setting.theme.list[0].name,
            user: true
          },
          { root: true }
        )
        if (loginUserInfo.darkColor || loginUserInfo.lightColor) {
          // set color
          if (activeName === 'darkTheme') {
            await store.dispatch('d2admin/color/set', loginUserInfo.darkColor, { root: true })
          } else {
            await store.dispatch('d2admin/color/set', loginUserInfo.lightColor, { root: true })
          }
        } else {
          const colors = constant.mainColorLists[activeName]
          await store.dispatch('d2admin/color/set', colors, { root: true })
        }
        resolve(loginUserInfo)
      })
    }
  }
}
