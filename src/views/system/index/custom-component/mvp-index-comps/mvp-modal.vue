// 弹窗组件
<template>
  <div class="mvp-dialog">
    <el-dialog
      ref="dialog"
      v-bind="$attrs"
      v-on="$listeners"
      :width="width"
      :title="title"
      :destroy-on-close="clearCache"
      :visible.sync="dialogVisible"
      :modal="modal"
      :append-to-body="appendToBody"
      :close-on-click-modal="closeOnClickModal"
      @open="open"
      @close="cancel"
      :before-close="cancel"
      custom-class="mvp-customClass"
    >
      <div class="dialog-content" v-loading="loading">
        <span class="el-icon-close close" @click="cancel"></span>
        <div class="header">
          <slot name="header"> </slot>
        </div>
        <div class="content">
          <slot name="content"> </slot>
        </div>
      </div>
      <div class="content-btm">
        <slot name="footer"> </slot>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'mvpModal',
  data() {
    return {
      bgType: ''
    }
  },
  props: {
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
      default: '800px'
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
    loading: {
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
        this.setBackground(this.bgType)
      },
      immediate: true
    },
    dialogVisible: {
      handler(val) {
        if (val) {
          this.setBackground(this.bgType)
        }
      },
      immediate: true
    }
  },
  mounted() {},
  methods: {
    cancel() {
      this.$emit('dialog-cancel')
    },
    open() {
      // this.setBackground()
      this.$emit('dialogOpend', true)
    },
    setBackground(flag) {
      this.$nextTick(_ => {
        const dialogBody = document.querySelector('.mvp-customClass .el-dialog__body')
        const contentBtm = document.querySelector('.content-btm')
        const bgcolor = flag !== 'lightTheme' ? '#181818' : '#ffffff'
        const cgcolor = flag !== 'lightTheme' ? '#242424' : '#F2F3F5'
        dialogBody &&
          dialogBody.setAttribute(
            'style',
            `background: radial-gradient(circle at right bottom, transparent 8px, ${bgcolor} 0) right bottom /
            578px no-repeat,
          radial-gradient(circle at left bottom, transparent 8px,  ${bgcolor} 0) left bottom / 578px
            no-repeat !important`
          )
        contentBtm &&
          contentBtm.setAttribute(
            'style',
            `  background: radial-gradient(circle at right top, transparent 8px, ${cgcolor} 0) right top / 578px
      no-repeat,
    radial-gradient(circle at left top, transparent 8px, ${cgcolor} 0) left top / 578px no-repeat`
          )
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.mvp-dialog {
  position: relative;
}
.el-dialog__wrapper {
  // background: rgba($color: #000000, $alpha: 0.8);
  ::v-deep .el-dialog {
    background: transparent !important;
    margin-top: -26vh !important;
    box-shadow: none !important;
  }
}
::v-deep .el-dialog__header {
  display: none !important;
}
::v-deep .el-dialog__body {
  margin-top: -1px !important;
  overflow: hidden !important;
  padding: 0 !important;
  border-top-left-radius: 6px !important;
  border-top-right-radius: 6px !important;
}

::v-deep .el-dialog__close {
  font-weight: bold;
  color: #838383;
}
// 内容
.dialog-content {
  padding-bottom: 12px;
  box-sizing: border-box;
  position: relative;
  .header {
    width: 100%;
    background-repeat: no-repeat;
    padding: 21px 20px 16px;
    box-sizing: border-box;
     background: linear-gradient(180deg,#8D31AB -200%,#FFF 50%);
  }
  .content {
    width: 100%;
    padding: 0 32px;
    box-sizing: border-box;
    margin-bottom: 16px;
  }
  .close {
    font-size: 20px;
    position: absolute;
    right: 14px;
    top: 14px;
    color: #838383;
    font-weight: bold;
    z-index: 1002;
    cursor: pointer;
  }
}
.content-btm {
  position: absolute;
  // bottom: -0;
  left: 0;
  width: 800px;
  max-height: 350px;
  z-index: 1001;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  padding: 24px 0 48px 0;
  box-sizing: border-box;
  overflow-y: hidden;
  overflow-x: hidden;
  &::after {
    content: '';
    position: absolute;
    left: 14px;
    top: 0px;
    width: 770px;
    border: 0.5px dashed #e5e6eb;
  }
}
.content-btm:hover {
  overflow-y: hidden;
}
</style>
