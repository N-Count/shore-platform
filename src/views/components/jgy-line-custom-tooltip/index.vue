<template>
  <ElTooltip ref="jgyTooltip" :content="content" :disabled="disabled" :placement="placement" :open-delay="openDelay"
    :popper-class="popperClass" :style="styleObject">
    <!-- 自定义插槽 -->
    <div slot="content" v-if="isSlot" class="custom-slot" :style="slotStyle">
      <slot></slot>
    </div>
    <!-- 超过指定高度展示 -->
    <div class="custom-ellipsis" :class="className" @mouseover="onMouseOver" v-if="!isCharacter">
      <span class="ellipsis-span" ref="ellipsis" :style="ellipsisLink">
        {{ getContent(content) }}
      </span>
    </div>
    <!-- 超过指定字符展示 -->
    <span v-else :style="ellipsisLink">{{ displayText }}</span>
  </ElTooltip>
</template>

<script>
import { isNil } from 'lodash'
export default {
  name: 'jgyLineCustomTooltip',
  props: {
    lineHeight: { type: Number, default: 22 }, // 设置文本行高
    maxHeight: { type: Number, default: 22 }, // 设置最大可展示高度
    maxWidth: { type: [String, Number], default: 'inherit' }, // 兼容设置最大可展示宽度
    line: { type: [Number, String], default: 1 }, // 设置超过几行...
    content: { type: String, default: '' }, // 内容
    placement: { type: String, default: 'top' }, // 展示位置
    className: { type: String, default: '' }, // 自定义类名
    openDelay: { type: Number, default: 300 }, // 延迟展示
    isLink: { type: Boolean, default: false }, // 是否可点击
    limit: { type: Number, default: 6 }, // 超过几个字符展示
    isCharacter: { type: Boolean, default: false }, // 是否为字符控制
    isSlot: { type: Boolean, default: false }, // 是否为自定义插槽
    slotMaxHeight: { type: Number, default: 0 }, // tootips最大高度设置，超出滚动, 默认不滚动
    customTooltips: { type: String, default: '' } // 自定义tootips类
  },
  data () {
    return {
      disabled: false
    }
  },
  watch: {
    // 控制字符是否有弹窗判断
    content: {
      handler () {
        if (this.isCharacter) {
          this.disabled = this.content.length <= this.limit
        }
      },
      immediate: true
    }
  },
  computed: {
    // 自定义tootips最大高度
    slotStyle () {
      return this.slotMaxHeight
        ? `maxHeight:${this.slotMaxHeight + 'px'};overflow: hidden;overflow-y:scroll`
        : ''
    },
    // 字符截取
    displayText () {
      const { content, limit } = this
      const text = content !== '' && !isNil(content) ? content : '-'
      if (text?.length > limit) {
        return text.slice(0, this.limit) + '...'
      } else {
        return text
      }
    },
    // 文本处理
    getContent () {
      return val => (val !== '' && !isNil(val) ? val : '-')
    },
    // 设置样式
    styleObject () {
      const maxHeight = this.lineHeight * this.line
      const maxWidth = typeof this.maxWidth === 'string' ? this.maxWidth : this.maxWidth + 'px'
      return {
        maxHeight: `${maxHeight}px`,
        maxWidth: maxWidth,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        '-webkit-box-orient': 'vertical',
        '-webkit-line-clamp': this.line
      }
    },
    ellipsisLink () {
      return {
        cursor: this.isLink ? 'pointer' : 'default'
      }
    },
    popperClass () {
      return this.customTooltips ? `jy-custom-tooltips ${this.customTooltips}` : 'jy-custom-tooltips'
    }
  },
  methods: {
    // 鼠标事件判断
    onMouseOver () {
      this.$nextTick(_ => {
        const domEl = this.$refs['ellipsis']
        const domElHeight = domEl.offsetHeight
        this.disabled = domElHeight <= this.maxHeight
      })
    }
  }
}
</script>
<style lang="scss">
.jy-custom-tooltips {
  max-width: 400px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
}
</style>
<style scoped lang="scss">
.custom-ellipsis {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre-line;
}

.custom-slot {
  &::-webkit-scrollbar {
    width: 4px;
    border: 6px;
  }
}
</style>
