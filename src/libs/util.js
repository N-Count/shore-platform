import cookies from './util.cookies'
import { database } from './util.db'
import log from './util.log'
import router from '@/router'
import store from '@/store'
// 密码RSA加密
import JSEncrypt from 'jsencrypt'
import dayjs from 'dayjs'
import { isEqual } from 'lodash'
import { getMenuListByUser } from '@/menu/handleMenu'
import { userRoles, jgyBtnAuthConfig } from '@/menu/authConfig'
import { MessageBox } from 'element-ui'
const util = {
  cookies,
  log
}

/**
 * @description 更新标题
 * @param {String} title 标题
 */
util.title = function (titleText) {
  const processTitle = process.env.VUE_APP_TITLE || 'D2Admin'
  window.document.title = `${processTitle}${titleText ? ` | ${titleText}` : ''}`
}

/**
 * @description 打开新页面
 * @param {String} url 地址
 */
util.open = function (url) {
  var a = document.createElement('a')
  a.setAttribute('href', url)
  a.setAttribute('target', '_blank')
  a.setAttribute('id', 'd2admin-link-temp')
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(document.getElementById('d2admin-link-temp'))
}

/**
 * @description 重定向
 * @param {String} url 地址
 */
util.redirect = function (url) {
  store.dispatch('d2admin/page/redirect', {
    tagName: router.history.current.fullPath,
    name: url
  })
}

/**
 * @description 节流 ：规定延迟时间（delay）内只执行最开始触发的函数
 * @param {Function} fn 需要节流的函数
 * @param {Number} delay 延迟的时间
 * @returns {Function}
 */
util.throttle = function (fn, delay) {
  var canRun = true
  return function () {
    var that = this
    var args = arguments
    if (!canRun) return // 注意，这里不能用timer来做标记，因为setTimeout会返回一个定时器id
    canRun = false
    fn.apply(that, args)
    setTimeout(function () {
      canRun = true
    }, delay)
  }
}

/**
 * @description 防抖：上个函数在规定延迟时间（delay）内未开始执行就接连触发的函数只执行最后触发的函数
 * @param {Function} fn 需要节流的函数
 * @param {Number} delay 延迟的时间
 * @returns {Function}
 */
util.decounce = function (fn, delay) {
  let timer = null
  return function () {
    let args = arguments
    if (timer !== null) {
      // 每次调用debounce函数都会将前一次的timer清空，确保只执行一次
      clearTimeout(timer)
    }
    timer = setTimeout(() => fn(...args), delay)
  }
}

/**
 * @description 传入内容是否为空值
 * @param expect 传入值
 */
util.isEmpty = function (expect) {
  return (
    expect === undefined ||
    expect === 'undefined' ||
    expect === 'null' ||
    expect === null ||
    (typeof expect === 'string' && expect.trim() === '') ||
    (typeof expect === 'number' && expect.toString() === 'NaN') ||
    (expect.constructor === Object && Object.keys(expect).length === 0)
  )
}

/**
 * @description 传入内容是否不为空值
 * @param expect 传入值
 */
util.notEmpty = function (expect) {
  return !util.isEmpty(expect)
}

/**
 * 深拷贝
 * @param obj 需拷贝的内容
 * @returns
 */
util.deepClone = function (obj) {
  let _tmp = JSON.stringify(obj) // 将对象转换为json字符串形式
  let result = JSON.parse(_tmp) // 将转换而来的字符串转换为原生js对象
  return result
}
/**
 * 获取封装的路由传参
 */
util.pushRouterParam = async function (path, param, query) {
  let routerParam = {
    path
  }
  if (param) {
    const _db = await database('d2admin/db/database', {
      user: true
    })
    const key = btoa(path).substr(0, 10)
    const value = JSON.stringify(param)
    _db.set(key, value).write()
    routerParam.query = {
      param: key,
      ...query
    }
  }
  router.push(routerParam)
}

/**
 * 获取重定向封装的路由传参
 */
util.redirectRouterParam = async function (path, param) {
  if (param) {
    const _db = await database('d2admin/db/database', {
      user: true
    })
    const key = btoa(path).substr(0, 10)
    const value = JSON.stringify(param)
    _db.set(key, value).write()
    path += `?param=${key}`
  }

  store.dispatch('d2admin/page/redirect', {
    tagName: router.history.current.fullPath,
    name: path
  })
}

/**
 * 获取重定向封装的路由传参
 */
util.getRouterParam = async function (thisRouter) {
  const routerKey = thisRouter.$route.query.param
  if (routerKey) {
    const _db = await database('d2admin/db/database', {
      user: true
    })
    return JSON.parse(_db.get(routerKey).value())
  }
  return false
}

/**
 * RSA加密
 * @param str 需要加密的字符串
 * @returns
 */
util.getRsaCode = function (str) {
  let pubKey = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC6ZV1
  PBGKTF3a7vnz0n1nv/WhKbRrJXGl48pJzGlgTG3O/VTZQMfCtd+HuhNB5q
  z21jjZn+xOe2IkV/fVMUmVYvE07sClPN8dLYDQBCNklUepQKb94o+hxxaIX
  4/lLYnDHWx9MWRaufcX4q21tTnj9PRj6U8LSpBFP7W7DoyqN3QIDAQAB` // ES6 模板字符串 引用 rsa 公钥
  let encryptStr = new JSEncrypt()
  encryptStr.setPublicKey(pubKey) // 设置 加密公钥
  let data = encryptStr.encrypt(str.toString()) // 进行加密
  return data
}

/**
 * 生成随机字符串
 * @param len 表示长度，默认32位
 * @returns
 */
util.randomString = function (len = 32) {
  const template = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789'
  let str = ''
  for (let i = 0; i < len; i++) {
    str += template.charAt(Math.floor(Math.random() * template.length))
  }
  return str
}

// 数字近似相等
util.nearlyEquals = function (a, b) {
  if (isNaN(a)) return false
  if (isNaN(b)) return false
  return Math.abs(Number(a) - Number(b)) < 1e-6
}

// 防抖
util.debounce = function (func, wait, immediate) {
  let timeout, args, context, timestamp, result
  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp
    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }
    return result
  }
}

util.getChartType = {
  1: 'line',
  2: 'bar',
  3: 'radar'
}

// 指标频率
util.indicatorFrequency = {
  1: '周',
  2: '月',
  3: '季',
  4: '年'
}

// 指标Y轴左右
util.chartAsis = {
  1: '左轴',
  2: '右轴'
}

util.thousands = function (thisVal, num, defaultVal, fmt) {
  if (util.isEmpty(thisVal) || util.isEmpty(Number(thisVal))) {
    return util.isEmpty(defaultVal) ? '--' : defaultVal
  }

  // 去掉可能的已经是千分位字符串中的逗号
  thisVal = (thisVal || '').toString().replace(/,/g, '')

  // 固定保留的小数位数
  num = typeof num === 'undefined' || num * 1 < 0 ? 2 : num

  var prefix = ''
  var strN = util.toFixed(thisVal * 1, num).toString()

  // 找出字符串中可能的负号
  if (strN.indexOf('-') === 0) {
    prefix = '-'
    strN = strN.substr(1)
  }

  var pindex = strN.indexOf('.')
  var suffix
  var result = ''
  suffix = pindex >= 0 ? strN.substr(pindex, strN.length) : ''
  strN = pindex >= 0 ? strN.substr(0, pindex) : strN
  while (strN.length > 3) {
    result = ',' + strN.slice(-3) + result
    strN = strN.slice(0, strN.length - 3)
  }

  result = prefix + strN + result + suffix

  if (!util.isEmpty(fmt)) {
    result = result + fmt
  }
  return result
}

/**
 * 解决chrome下toFixed当小数四舍五入精度后一位是5，导致四舍五入不准确的问题
 */
util.toFixed = function (num, n) {
  return (num + 1e-14).toFixed(n)
}

// downloadFilename   // 设置导出的文件名
util.blob2Excel = (res, downloadFilename, optType) => {
  let blob = new Blob([res]) // response.data为后端传的流文件
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    // 兼容ie浏览器
    window.navigator.msSaveOrOpenBlob(blob, downloadFilename)
  } else {
    // 谷歌,火狐等浏览器
    // TODO 客户端预览pdf文件
    // if (downloadFilename.endsWith('.pdf') && optType !== 'download') {
    //   // 预览pdf
    //   blob = new Blob([res], { type: 'application/pdf' })
    //   let href = window.URL.createObjectURL(blob)
    //   window.open(href, '_blank')
    // }
    // else {
    blob = new Blob([res], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    let url = window.URL.createObjectURL(blob)
    let downloadElement = document.createElement('a')
    downloadElement.style.display = 'none'
    downloadElement.href = url
    downloadElement.download = downloadFilename
    document.body.appendChild(downloadElement)
    downloadElement.click()
    document.body.removeChild(downloadElement)
    window.URL.revokeObjectURL(url)
    // }
  }
}

// 数组去重
util.unique = arr => {
  return Array.from(new Set(arr))
}

/**
 * 格式化日期  可以是单个日期也可以是起始日期
 * @param {原始日期数据} dates
 * @param {格式} format
 */
util.formatDate = (dates, format = 'YYYY-MM-DD') => {
  let res = ''
  if (Array.isArray(dates)) {
    res = []
    for (let i = 0; i < dates.length; i++) {
      let value = dates[i]
      res.push(dayjs(value).format(format))
    }
  } else {
    res = dayjs(dates).format(format)
  }
  return res
}

/**
 * 获取浏览器和版本号
 * @return {string}
 */
util.getBrowser = () => {
  let ua = navigator.userAgent.toLowerCase()
  const ie = ua.match(/msie ([\d.]+)/)
  const firefox = ua.match(/firefox\/([\d.]+)/)
  const chrome = ua.match(/chrome\/([\d.]+)/)
  const opera = ua.match(/opera.([\d.]+)/)
  const safari = ua.match(/version\/([\d.]+).*safari/)

  if (ie) return `ie: ${ie[1]}`
  if (firefox) return `firefox: ${firefox[1]}`
  if (chrome) return `chrome: ${chrome[1]}`
  if (opera) return `opera: ${opera[1]}`
  if (safari) return `safari: ${safari[1]}`
  return ''
}

/**
 * 获取操作系统
 * @return {string}
 */
util.getOS = () => {
  let sUserAgent = navigator.userAgent
  let isWin = navigator.platform === 'Win32' || navigator.platform === 'Windows'
  let isMac =
    navigator.platform === 'Mac68K' ||
    navigator.platform === 'MacPPC' ||
    navigator.platform === 'Macintosh' ||
    navigator.platform === 'MacIntel'
  if (isMac) return 'Mac'
  let isUnix = navigator.platform === 'X11' && !isWin && !isMac
  if (isUnix) return 'Unix'
  let isLinux = String(navigator.platform).indexOf('Linux') > -1
  if (isLinux) return 'Linux'
  if (isWin) {
    let isWin2K =
      sUserAgent.indexOf('Windows NT 5.0') > -1 || sUserAgent.indexOf('Windows 2000') > -1
    if (isWin2K) return 'Win2000'
    let isWinXP = sUserAgent.indexOf('Windows NT 5.1') > -1 || sUserAgent.indexOf('Windows XP') > -1
    if (isWinXP) return 'WinXP'
    let isWin2003 =
      sUserAgent.indexOf('Windows NT 5.2') > -1 || sUserAgent.indexOf('Windows 2003') > -1
    if (isWin2003) return 'Win2003'
    let isWinVista =
      sUserAgent.indexOf('Windows NT 6.0') > -1 || sUserAgent.indexOf('Windows Vista') > -1
    if (isWinVista) return 'WinVista'
    let isWin7 = sUserAgent.indexOf('Windows NT 6.1') > -1 || sUserAgent.indexOf('Windows 7') > -1
    if (isWin7) return 'Win7'
    let isWin10 = sUserAgent.indexOf('Windows NT 10') > -1 || sUserAgent.indexOf('Windows 10') > -1
    if (isWin10) return 'Win10'
  }
  return 'other'
}

/**
 * 检测数据是否是满足条件的
 * @param {要校验的数字} num
 * @param {整数位长度} integerLen
 * @param {小数位长度} decimalLen
 * @param {整数位最大数值限制} integerLimit
 * @param {如果是整数，是否校验整数部分} isCheckInteger
 */
util.checkNum = (
  num,
  integerLen = 3,
  decimalLen = 2,
  integerLimit = 100,
  isCheckInteger = true
) => {
  let res = {
    msg: '',
    num: ''
  }
  // 首先校验是否是一个有效的数字
  let regNum = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g
  if (!regNum.test(num)) {
    res.msg = '请输入有效的数字！'
  } else {
    // 判断是否是一个小数
    if (num.toString().includes('.')) {
      let [$1, $2] = num.toString().split('.')
      // 判断是否是负数
      if ($1.startsWith('-')) {
        $1 = $1.slice(1)
      }
      let newIntegerLimit = Number($2) > 0 ? integerLimit - 1 : integerLimit
      if (integerLen > 0 && Number($1) > newIntegerLimit) {
        res.msg = `正负最大不超过${integerLimit}！`
      } else if (decimalLen > 0 && $2.toString().length > decimalLen) {
        res.msg = `只能输入${decimalLen}位小数！`
      } else {
        res.num = Number(num)
      }
    } else {
      if (isCheckInteger) {
        // 判断是否是负数
        let compareNum = num
        if (num.toString().startsWith('-')) {
          compareNum = num.slice(1)
        }
        if (Number(compareNum) > integerLimit) {
          res.msg = `整数部位最大不超过正负${integerLimit}！`
        } else {
          res.num = Number(num)
        }
      } else {
        res.num = Number(num)
      }
    }
  }
  return res
}

// footer翻页计算滚动
util.hasScrollbar = that => {
  // footerDom.style.opacity = 0
  that.$nextTick(() => {
    setTimeout(() => {
      const footerDom = document.querySelector('.jy-flex-center-row')
      if (!footerDom) return
      const contentDom = document.querySelector('.d2-container-full__body_content')
      const boxDom = document.querySelector('.d2-container-full')
      const domStyles = window.getComputedStyle(contentDom)
      const boxStyles = window.getComputedStyle(boxDom)
      // const footerStyles = window.getComputedStyle(footerDom)
      console.log(parseInt(domStyles.height), parseInt(boxStyles.height))
      if (parseInt(domStyles.height) + 17 >= parseInt(boxStyles.height)) {
        if (!!window.ActiveXObject || 'ActiveXObject' in window) {
          footerDom.style.width = 'calc(100% - 48px)'
          footerDom.style.left = '-16px'
        } else {
          footerDom.style.width = 'calc(100% - 42px)'
          footerDom.style.left = '-10px'
        }
      } else {
        footerDom.style.width = 'calc(100% - 32px)'
        footerDom.style.left = '0px'
      }
      // footerDom.style.opacity = 1
    }, 200)
  })
}

/**
 * 根据按钮唯一ID或者path来判断对应按钮是否有权限
 * @param {Boolean} isPath  是否通过路径判断
 * @param {String|Object} targetVal  如果是路径传入对象，否则传入按钮ID
 * @returns
 */
util.checkBtnAuthByUser = function (targetVal = '', isPath = false) {
  let isShowBtn = true
  if (isPath) {
    let findRouter = util.getRouterInfo('path', targetVal.path)
    isShowBtn = findRouter !== null
  } else {
    // 获取当前用户信息
    const userInfo = store.state.d2admin.user.info
    // 判断按钮ID
    if (userInfo && targetVal) {
      const { roleName = '' } = userInfo
      const userRoleType = userRoles.find(item => item.role === roleName)?.type || ''
      if (userRoleType) {
        const { showList = [], hideList = [] } = jgyBtnAuthConfig[userRoleType] || {}
        if (showList.includes(targetVal)) {
          isShowBtn = true
        }
        if (hideList.includes(targetVal)) {
          isShowBtn = false
        }
      }
    }
  }
  return isShowBtn
}

/**
 * 根据当前用户角色权限来获取可见页面路由中的路由信息
 * @param {String} key 根据指定key查找 name/path
 * @param {String} val 指定key对应的值
 * @returns 查找到的结果 null或者指定的路由信息
 */
util.getRouterInfo = function (key, val) {
  let findRouter = null
  // 获取当前用户信息
  const userInfo = store.state.d2admin.user.info
  // 根据当前用户获取对应的可见页面列表
  let { allRouterListByRole = [] } = getMenuListByUser(userInfo)
  // 判断当前目标页面是否在权限范围内
  if (allRouterListByRole.length && val && key) {
    findRouter = allRouterListByRole.find(item => item[key] === val)
  }
  return isEqual(findRouter) ? null : findRouter
}

/**
 *
 * @description  小弹窗方法
 * @param {function} fn 执行函数
 * @param {String} hintText 提示文字
 * @param {String} loadText 加载文字
 * @param {Object} config 弹窗配置1
 *
 */
util.$smallPop = (
  fn,
  hintText,
  loadText,
  config = {
    title: '提示',
    type: 'warning',
    showCancelButton: true,
    showInput: false,
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }
) => {
  MessageBox.prompt(hintText, {
    ...config,
    beforeClose: async (action, instance, done) => {
      // 定义当前时间
      const currentTime = Date.now()
      // 获取上次存储时间
      const lastClickTime = localStorage.getItem('currentTimeApi') || 0
      if (action === 'confirm') {
        instance.confirmButtonLoading = true
        instance.confirmButtonText = loadText
        try {
          // 如果当前时间和上传存储时间相差 1500，可以执行接口，否则1500内，点击过快，不调用接口，做去重处理
          if (currentTime - lastClickTime >= 1500) {
            await fn()
            // 执行完成存储当前时间
            localStorage.setItem('currentTimeApi', currentTime)
          }
        } finally {
          done()
          instance.confirmButtonLoading = false
          instance.confirmButtonText = config.confirmButtonText
        }
      } else {
        done()
      }
    }
  }).catch(error => {
    console.log(error)
  })
}

export default util
