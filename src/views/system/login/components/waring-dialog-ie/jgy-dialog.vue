// 弹窗组件
<template>
  <el-dialog
    v-bind="$attrs"
    v-on="$listeners"
    :width="width"
    :title="title"
    :visible.sync="dialogVisible"
    :modal="modal"
    :append-to-body='appendToBody'
    :close-on-click-modal='closeOnClickModal'
    @opened="opened"
    :before-close="cancel"
  >
    <div class="dialog-content">
      <slot name="content"></slot>
    </div>
    <div v-if="useFooter" slot="footer" class="dialog-footer">
      <slot name="footer">
        <el-button type="primary" :loading="buttonDisable" :disabled='disableBtn' @click="confirm" size="small" >确 定</el-button>
        <el-button @click="cancel" size="small" style="margin-left:32px">取 消</el-button>
      </slot>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'dialogExample',
  data () {
    return {}
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
      default: '50%'
    },
    closeOnClickModal: {
      type: Boolean,
      default: true
    },
    disableBtn: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    cancel () {
      this.$emit('dialog-cancel')
    },
    confirm () {
      this.$emit('dialog-confirm')
    },
    opened () {
      this.$emit('opened')
    }
  }
}
</script>
<style lang="scss" scoped></style>
