import { mapState } from 'vuex'
// 修改打开的tab展示名字
export default {
  methods: {
    changeTabName (name) {
      this.opened.forEach((item, index) => {
        if (this.current === item.fullPath) {
          item.index = index
          // 防止左侧菜单内容也改变
          item.meta = { ...item.meta, title: name }
          this.util.title(name)
          this.$store.dispatch('d2admin/page/openedUpdate', item)
        }
      })
    }
  },
  computed: {
    ...mapState('d2admin/page', ['opened']),
    current: {
      get () {
        return this.$store.state.d2admin.page.current
      },
      set (v) {
        this.currentSet(v)
      }
    }
  }
}
