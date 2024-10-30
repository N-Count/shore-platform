<template>
  <div class="banner-dialog">
    <el-dialog
      ref="dialog"
      v-bind="$attrs"
      v-on="$listeners"
      :title="title"
      :destroy-on-close="clearCache"
      :visible.sync="dialogVisible"
      :modal="modal"
      :width="width"
      :append-to-body="appendToBody"
      :close-on-click-modal="closeOnClickModal"
      @opened="opened"
      @close="cancel"
      :before-close="cancel"
    >
      <div class="content">
        <span class="el-icon-close close" @click="cancel"></span>
        <img :src="bannerModelPng" alt="" class="content-img" />
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'mvpModal',
  data() {
    return {}
  },
  props: {
    bannerModelPng: {
      type: String,
      default: ''
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    useFooter: {
      type: Boolean,
      default: true
    },
    modal: {
      type: Boolean,
      default: true
    },
    buttonDisable: {
      type: Boolean,
      default: false
    },
    appendToBody: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: 'auto'
    },
    closeOnClickModal: {
      type: Boolean,
      default: true
    },
    disableBtn: {
      type: Boolean,
      default: false
    },
    clearCache: {
      // 是否清除缓存
      type: Boolean,
      default: false
    },
    headerImg: {
      type: Object,
      default: () => {
        return {
          lightTheme: require('@/assets/images/mvpindex/header-bg-l.png'),
          darkTheme: require('@/assets/images/mvpindex/header-bg-d.png')
        }
      }
    }
  },
  watch: {
    '$store.state.d2admin.theme.activeName': {
      handler(val) {
        this.bgType = val
      },
      immediate: true
    }
  },
  mounted() {},
  methods: {
    cancel() {
      this.$emit('dialog-cancel')
    },
    opened() {
      this.$emit('opened')
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__header {
  display: none !important;
}
::v-deep div.el-dialog {
  box-shadow: none;
  background: none !important;
}
::v-deep div.el-dialog .el-dialog__body {
  overflow: hidden !important;
  padding: 0 !important;
  max-height: initial !important;
  background: none !important;
}
.banner-dialog {
  position: relative;
}
.content {
  position: relative;
  .close {
    font-size: 20px;
    position: absolute;
    right: 6px;
    top: 6px;
    color: #838383;
    font-weight: bold;
    z-index: 1002;
    cursor: pointer;
  }
  &-img {
    width: 100%;
  }
}
</style>
