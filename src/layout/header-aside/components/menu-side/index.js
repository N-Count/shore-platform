import { mapState, mapMutations } from 'vuex'
import menuMixin from '../mixin/menu'
import { elMenuItem, elSubmenu } from '../libs/util.menu'
import BScroll from 'better-scroll'

export default {
  name: 'd2-layout-header-aside-menu-side',
  mixins: [menuMixin],
  render (createElement) {
    return createElement(
      'div',
      { attrs: { class: 'd2-layout-header-aside-menu-side', 'my-data': this.activeRoute || '哈哈哈' } },
      [
        createElement(
          'el-menu',
          {
            props: {
              collapse: this.asideCollapse,
              uniqueOpened: true,
              defaultActive: this.activeRoute
            },
            ref: 'menu',
            on: { select: this.handleMenuSelect }
          },
          this.aside.map(menu =>
            (menu.children === undefined ? elMenuItem : elSubmenu).call(
              this,
              createElement,
              menu,
              this.asideCollapse
            )
          )
        ),
        ...(this.aside.length === 0 && !this.asideCollapse
          ? [
            createElement(
              'div',
              {
                attrs: {
                  class: 'd2-layout-header-aside-menu-empty',
                  flex: 'dir:top main:center cross:center'
                }
              },
              [
                createElement('d2-icon', { props: { name: 'inbox' } }),
                createElement('span', {}, '没有侧栏菜单')
              ]
            )
          ]
          : [])
      ]
    )
  },
  data () {
    return {
      active: '',
      asideHeight: 300,
      BS: null
    }
  },
  computed: {
    ...mapState('d2admin/menu', ['aside', 'asideCollapse', 'activeRoute'])
    // activeRoute () {
    //   let { fullPath, meta: { activeLevel = '' } } = this.$route
    //   console.log(fullPath, this.current, '切换路由')
    //   if (activeLevel === '') {
    //     return fullPath
    //   } else {
    //     let ary = fullPath.split('/')
    //     let menuIndex = ''
    //     for (let i = 0; i < activeLevel; i++) {
    //       menuIndex = `${menuIndex}/${ary[i + 1]}`
    //     }
    //     return menuIndex
    //   }
    // }
  },
  watch: {
    // 折叠和展开菜单的时候销毁 better scroll
    asideCollapse (val) {
      this.scrollDestroy()
      setTimeout(() => {
        this.scrollInit()
      }, 500)
    },
    // 监听路由 控制侧边栏激活状态
    '$route': {
      handler () {
        let { fullPath, meta: { activeLevel = '' } } = this.$route
        if (activeLevel === '') {
          this.activeRouterSet(fullPath)
        } else {
          let ary = fullPath.split('/')
          let menuIndex = ''
          for (let i = 0; i < activeLevel; i++) {
            menuIndex = `${menuIndex}/${ary[i + 1]}`
          }
          this.activeRouterSet(menuIndex)
        }
      },
      immediate: true,
      keep: true
    }
  },
  mounted () {
    this.scrollInit()
  },
  beforeDestroy () {
    this.scrollDestroy()
  },
  methods: {
    ...mapMutations('d2admin/menu', ['activeRouterSet']),
    scrollInit () {
      this.BS = new BScroll(this.$el, {
        mouseWheel: true,
        click: true
        // 如果你愿意可以打开显示滚动条
        // scrollbar: {
        //   fade: true,
        //   interactive: false
        // }
      })
    },
    scrollDestroy () {
      // https://github.com/d2-projects/d2-admin/issues/75
      try {
        this.BS.destroy()
      } catch (e) {
        delete this.BS
        this.BS = null
      }
    }
  }
}
