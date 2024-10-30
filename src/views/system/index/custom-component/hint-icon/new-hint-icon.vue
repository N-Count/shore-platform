<template>
  <el-tooltip :placement="placement">
    <span class="iconfont icon-wenanjieshi1 hint-icon__image"></span>
    <div slot="content" style="font-size: 12px; line-height: 24px">
      <slot></slot>
    </div>
  </el-tooltip>
</template>

<script>
export default {
  props: {
    placement: {
      type: String,
      default: 'bottom'
    }
  }
}
</script>

<style lang="scss" scoped>
.hint-icon__image {
  position: relative;
  font-size: 14px !important;
  line-height: 20px;
  vertical-align: middle;
  cursor: pointer;
  color:  #838383;

  &:hover {
    color: #8a8a8a;
   color:  #409EFF;
  }
}
</style>
