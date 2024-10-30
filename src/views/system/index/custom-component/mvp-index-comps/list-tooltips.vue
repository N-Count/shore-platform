<template>
  <div class="info-ellipsis" ref="isOverflow">
    <img v-if="recommandFlag" class="title-hot" :src="hotIcon" alt="" />
    <JyLineCustomTooltip
      line="2"
      :maxHeight="44"
      :content="content"
      isLink
      :style="{
        textIndent: recommandFlag ? textIndent : '0'
      }"
    >
    </JyLineCustomTooltip>
  </div>
</template>
<script>
import jgyIconImg from '@/libs/base64Img'
export default {
  name: 'listEllipsis',
  components: {
  },
  props: {
    lineClamp: {
      type: Number,
      default: 2
    },
    content: {
      type: String,
      default: ''
    },
    textIndent: {
      type: String,
      default: '32px'
    },
    recommandFlag: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      hotIcon: jgyIconImg.hotIcon
    }
  },
  created() {}
}
</script>
<style lang="scss" scoped>
.info-ellipsis {
  position: relative;
  top: -2px;
  color: rgba(0, 0, 0, 0.9) !important;
  .title-hot {
    position: absolute;
    left: 0px;
    top: 4px;
    height: 13px;
  }
  .ellipsisRow {
    word-wrap: break-word;
  }
}
</style>
