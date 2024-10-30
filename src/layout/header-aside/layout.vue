<template>
  <div
    class="d2-layout-header-aside-group"
    :style="styleLayoutMainGroup"
    :class="{ grayMode: grayActive }"
  >
    <!-- 半透明遮罩 -->
    <div class="d2-layout-header-aside-mask"></div>
    <!-- 主体内容 -->
    <div class="d2-layout-header-aside-content" flex="dir:top">
      <!-- 顶栏 -->
      <div
        class="d2-theme-header"
        :style="{
          opacity: this.searchActive ? 0.5 : 1
        }"
        flex-box="0"
        flex
      >
        <router-link
          :to="defaultMainPage"
          class="logo-group"
          :style="{ width: asideCollapse ? asideWidthCollapse : asideWidth }"
          flex-box="0"
        >
          <img
            v-if="asideCollapse"
            :style="{ width: asideWidthCollapse }"
            :src="`${$baseUrl}image/theme/${themeActiveSetting.name}/logo/icon-only.png`"
          />
          <img
            v-else
            :style="{ width: asideWidth }"
            :src="`${$baseUrl}image/theme/${themeActiveSetting.name}/logo/all.png`"
          />
        </router-link>
        <div class="toggle-aside-btn asideBtn" @click="handleToggleAside" flex-box="0">
          <d2-icon isIcon :name="!asideCollapse ? 'icon-shouqi1' : 'icon-zhankai1'" />
        </div>
        <div class="toggle-aside-btn" @click="handleRefreshPage" flex-box="0">
          <d2-icon isIcon name="icon-shuaxin" />
        </div>
        <d2-menu-header flex-box="1" />
        <!-- 顶栏右侧 -->
        <div class="d2-header-right" flex-box="0">
          <!-- <d2-header-theme /> -->
          <!-- <d2-header-fullscreen /> -->
          <d2HeaderLogOut />
          <d2-header-user />
        </div>
      </div>
      <!-- 下面 主体 -->
      <div class="d2-theme-container" flex-box="1" flex>
        <!-- 主体 侧边栏 -->
        <div
          flex-box="0"
          ref="aside"
          class="d2-theme-container-aside"
          :style="{
            width: asideCollapse ? asideWidthCollapse : asideWidth,
            opacity: this.searchActive ? 0.5 : 1
          }"
        >
          <d2-menu-side />
        </div>
        <!-- 主体 -->
        <div class="d2-theme-container-main" flex-box="1" flex>
          <!-- 搜索 -->
          <transition name="fade-scale">
            <div v-if="searchActive" class="d2-theme-container-main-layer" flex>
              <d2-panel-search ref="panelSearch" @close="searchPanelClose" />
            </div>
          </transition>
          <!-- 内容 -->
          <transition name="fade-scale">
            <div v-if="!searchActive" class="d2-theme-container-main-layer" flex="dir:top">
              <!-- tab -->
              <div class="d2-theme-container-main-header header-tabs-shadow" flex-box="0">
                <d2-tabs />
              </div>
              <!-- 页面 -->
              <div class="d2-theme-container-main-body" flex-box="1">
                <transition :name="transitionActive ? 'fade-transverse' : ''">
                  <keep-alive :include="keepAlive">
                    <router-view :key="$router.history.current.fullPath" />
                  </keep-alive>
                </transition>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import d2MenuSide from './components/menu-side'
import d2MenuHeader from './components/menu-header'
import d2Tabs from './components/tabs'
import d2HeaderUser from './components/header-user'
import d2HeaderLogOut from './components/header-logout'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import echarts from 'echarts'
export default {
  name: 'd2-layout-header-aside',
  components: {
    d2MenuSide,
    d2MenuHeader,
    d2Tabs,
    d2HeaderLogOut,
    d2HeaderUser
  },
  data() {
    return {
      searchActive: false,
      // [侧边栏宽度] 正常状态
      asideWidth: '200px',
      // [侧边栏宽度] 折叠状态
      asideWidthCollapse: '65px'
    }
  },
  mounted() {
    this.setDialogHeight()
    window.onresize = () => {
      this.setDialogHeight()
    }
  },
  computed: {
    ...mapState('d2admin', {
      keepAlive: state => state.page.keepAlive,
      grayActive: state => state.gray.active,
      transitionActive: state => state.transition.active,
      asideCollapse: state => state.menu.asideCollapse,
      defaultMainPage: state => state.page.defaultMainPage
    }),
    ...mapState('d2admin/user', ['info']),
    ...mapGetters('d2admin', {
      themeActiveSetting: 'theme/activeSetting'
    }),
    /**
     * @description 最外层容器的背景图片样式
     */
    // 小log路径
    smallLogColor() {
      if (this.themeActiveSetting.name === 'darkTheme') {
        return 'darkLogoThumb'
      } else {
        return 'ligthLogoThumb'
      }
    },
    // 大log路径
    largeLogColor() {
      if (this.themeActiveSetting.name === 'darkTheme') {
        return 'darkOrgLogo'
      } else {
        return 'ligthOrgLogo'
      }
    },
    styleLayoutMainGroup() {
      return {
        ...(this.themeActiveSetting.backgroundImage
          ? {
              backgroundImage: `url('${this.$baseUrl}${this.themeActiveSetting.backgroundImage}')`
            }
          : {})
      }
    }
  },
  methods: {
    ...mapActions('d2admin/menu', ['asideCollapseToggle']),
    ...mapMutations('d2admin/page', ['keepAliveRemove']),
    ...mapActions('d2admin/account', ['logout']),
    /**
     * 接收点击切换侧边栏的按钮
     */
    handleToggleAside() {
      this.asideCollapseToggle()
      Array.from(document.querySelectorAll('[_echarts_instance_]')).forEach(e => {
        setTimeout(() => {
          echarts.getInstanceByDom(e).resize()
        }, 500)
      })
      Array.from(document.querySelectorAll('[_echarts_instance_]')).forEach(e => {
        setTimeout(() => {
          echarts.getInstanceByDom(e).resize()
        }, 500)
      })
    },
    /**
     * 清空当前页缓存并刷新此页面
     */
    async handleRefreshPage() {
      this.keepAliveRemove(this.$route.name)
      await this.$nextTick()
      this.$router.replace('/refresh')
    },
    /**
     * 设置dialog内部的高度
     */
    setDialogHeight() {
      let height = document.documentElement.clientHeight
      let ratio = 0.63
      if (height < 600) {
        ratio = 0.58
      }
      window.document
        .getElementsByTagName('body')[0]
        .style.setProperty('--dialog-height', height * ratio + 'px')
      window.document
        .getElementsByTagName('body')[0]
        .style.setProperty('--dialog-height', height * ratio + 'px')
    }
    // 通过接口设置主题颜色
    // setMainColors () {
    //   // const mainColor = this.info.mainColor ? this.info.mainColor : 'blue'
    //   window.document.getElementsByTagName('body')[0].style.setProperty(`--color`, 'blue')
    // }
  }
}
</script>

<style lang="scss">
// 注册主题
@import '~@/assets/style/theme/register.scss';
@import '~@/assets/style/fixed/element.scss';

.header-tabs-shadow {
  @include boxShadow(headerTabsShadow);
  z-index: 10;
}
</style>
<style lang="scss" scoped>
.asideBtn {
  & > i {
    transition: transform 0.3s;
  }
  &.asideBtnRotate {
    & > i {
      transform: rotate(180deg);
    }
  }
}
</style>
