<template>
  <ElTooltip :content="contentHover" :disabled="isShowTooltip" :open-delay="400">
    <div :class="['jgy-overview-container', className]" @mousemove="onMouseOver">
      <span ref="jgyTextContent">
        {{ content }}
      </span>
    </div>
  </ElTooltip>
</template>

<script>
// 组件引入
// 接口引入
// 常量引入
// 常规JS引入
// 混入引入
// VueX引入
export default {
  name: '',
  components: {},
  props: {
    content: {
      type: String,
      default: ''
    },
    className: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isShowTooltip: false,
      contentHover: ''
    }
  },
  watch: {},
  computed: {},
  methods: {
    onMouseOver() {
      if (this.content.length > 0) {
        const tag = this.$refs.jgyTextContent
        const parentWidth = tag.parentNode.offsetWidth
        const contentWidth = tag.offsetWidth + 1
        this.isShowTooltip = contentWidth < parentWidth
        this.contentHover = this.content
      }
    }
  },
  created() {},
  mounted() {}
}
</script>

<style lang="scss" scoped>
.jgy-overview-container {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
