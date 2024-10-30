<template>
  <el-tooltip
    effect="dark"
    :open-delay="240"
    :content="active ? '退出全屏' : '全屏'"
    placement="bottom">
    <el-button class="d2-mr btn-text can-hover" type="text" @click="toggle">
      <d2-icon v-if="active" name="compress"/>
      <!-- <d2-icon name="arrows-alt" style="font-size: 16px"/> -->
      <i v-else class="icon iconfont icon-quanping" style="font-size: 16px" />
    </el-button>
  </el-tooltip>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState('d2admin/fullscreen', [
      'active'
    ])
  },
  methods: {
    ...mapActions('d2admin/fullscreen', [
      'toggle'
    ])
  }
}
</script>
