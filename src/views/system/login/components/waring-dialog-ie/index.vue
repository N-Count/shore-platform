<template>
  <d2-container>
    <div class="index-page-waring-box">
      <JgyDialog
        :dialog-visible="showWaring"
        :appendToBody="false"
        title="提示"
        width="600px"
        @dialog-cancel="showWaring = false"
      >
        <template #content>
          <div>
            <p class="h2">
              您当前使用的浏览器版本过低，可能导致部分功能无法正常使用！
            </p>
            <p class="h3">推荐下载最新的浏览器来体验基构云网站</p>
          </div>
          <div class="logo-area">
            <div class="chrome-area" @click="download('chrome')">
              <img :src="chrome" alt="" />
              <span class="net-name">Chrome浏览器</span>
            </div>
            <div class="edge-area" @click="download('edge')">
              <img :src="edge" alt="" />
              <span  class="net-name">Edge浏览器</span>
            </div>
          </div>
        </template>
        <template #footer>
          <el-button type="primary" @click="cancel">关 闭</el-button>
        </template>
      </JgyDialog>
    </div>
  </d2-container>
</template>

<script>
import JgyDialog from './jgy-dialog.vue'
import chrome from '../../image/logo-chrome.jpg'
import edge from '../../image/logo-edge.jpg'
export default {
  components: {
    JgyDialog
  },
  data () {
    return {
      chrome,
      edge,
      showWaring: false
    }
  },
  watch: {},
  computed: {},
  mounted () {
    this.browserJudge()
  },
  destroyed () {},
  methods: {
    download (name) {
      const links = name === 'chrome' ? 'https://www.google.cn/chrome/' : 'https://www.microsoft.com/zh-cn/edge'
      window.open(links)
    },
    browserJudge () {
      // const userAgent = navigator.userAgent // 取得浏览器的userAgent字符串
      // const isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 // 判断是否IE<11浏览器
      // const isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1
      const isGoogle = this.getChromeVersion()
      // const browser = {
      //   versions: (function () {
      //     const u = navigator.userAgent
      //     return {
      //       trident: u.indexOf('Trident') > -1 // IE内核
      //     }
      //   }())
      // }
      const isIeLowVersion = this.IEVersion()

      if (isIeLowVersion) {
        this.showWaring = true
      }
      if (isGoogle && isGoogle < 71) {
        this.showWaring = true
      }
    },

    IEVersion () {
      const userAgent = navigator.userAgent // 取得浏览器的userAgent字符串
      // var isOpera = userAgent.indexOf('Opera') > -1
      const isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 // 判断是否IE<11浏览器
      const isEdge = userAgent.indexOf('Edge') > -1 && !isIE // 判断是否IE的Edge浏览器
      const isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1

      if (isIE) {
        const reIE = new RegExp('MSIE (\\d+\\.\\d+);')
        reIE.test(userAgent)
        const fIEVersion = parseFloat(RegExp['$1'])
        if (fIEVersion === 7) {
          return true
        } else if (fIEVersion === 8) {
          return true
        } else if (fIEVersion === 9) {
          return true
        } else if (fIEVersion === 10) {
          return true
        } else {
          return true// IE版本<=7
        }
      } else if (isEdge) {
        return false// edge
      } else if (isIE11) {
        return false // IE11
      } else {
        return false// 不是ie浏览器
      }
    },
    // 获取谷歌浏览器版本
    getChromeVersion () {
      var arr = navigator.userAgent.split(' ')
      var chromeVersion = ''
      for (var i = 0; i < arr.length; i++) {
        if (/chrome/i.test(arr[i])) { chromeVersion = arr[i] }
      }
      if (chromeVersion) {
        return Number(chromeVersion.split('/')[1].split('.')[0])
      } else {
        return false
      }
    },
    cancel () {
      this.showWaring = false
    }
  }
}
</script>

<style lang="scss">
div.index-page-waring-box {
  .h2 {
    font-size: 16px;
    font-weight: 400;
    text-align: center;
  }
  .h3 {
    font-size: 16px;
    font-weight: bolder;
    text-align: center;
    margin-top: 5px;
  }
  .el-dialog {
    background: #fff;
    div.el-dialog__header {
      .el-dialog__title{
        color: #38383B;
      }
      background: #fff;
      border-top-color: #d60010;
      border-bottom-color: #E6E6E6;
    }

  div.el-dialog__footer, div.el-dialog__body{
    color: #38383B;
    background: #fff;
  }
    .logo-area {
      // display: flex;
      // justify-content: center;
      overflow: hidden;
      text-align: center;
      width: 80%;
      margin:30px auto 20px;
      .net-name{
        display: block;
        font-size: 14px;
      }
      .edge-area{
        // display: inline-block;
        // width: 45%;
        // margin-left: 80px;
        float: left;
        text-align: center;
        margin-left: 50px;
      }
      .chrome-area{
        // width: 45%;
        float: left;
        //  display: inline-block;
        margin-left: 120px;
        text-align: center;
      }
    }
  }
  .dialog-footer {
    .el-button {
      color: #fff;
      background: #d60010;
    }
  }
  //   EA5D3F
}
</style>
