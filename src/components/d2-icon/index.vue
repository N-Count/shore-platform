<template>
  <i class="fa" :class="!isIcon?`fa-${name}`:`iconfont ${name}`" aria-hidden="true"></i>
</template>

<script>
import './font-awesome-4.7.0/css/font-awesome.min.css'
export default {
  name: 'd2-icon',
  props: {
    name: {
      type: String,
      required: false,
      default: 'font-awesome'
    },
    // 是否使用iconfont
    isIcon: {
      type: Boolean,
      default: false
    }
  }
}
</script>
