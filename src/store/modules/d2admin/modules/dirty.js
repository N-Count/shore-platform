export default {
  namespaced: true,
  state: {
    // 模拟脏值检测，控制跨页面刷新
    dirty: false
  },
  mutations: {
    clearDirty (state) {
      state.dirty = !state.dirty
    },

    setDirty (state) {
      state.dirty = true
    }
  }
}
