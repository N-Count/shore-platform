<template>
  <el-button
    class="d2-ml-0 d2-mr btn-text can-hover"
    type="text"
    @click="logOff"
    style="background: transparent;"
  >
    <i class="icon iconfont icon-zhuxiao" style="font-size: 16px" />
  </el-button>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState('d2admin/user', ['info'])
  },
  methods: {
    ...mapActions('d2admin/account', ['logout']),
    /**
     * @description 登出
     */
    logOff () {
      this.logout({
        confirm: true
      })
    }
  }
}
</script>
