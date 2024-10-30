<template>
  <div class="d2-container-full">
    <div v-if="$slots.header" class="d2-container-full__header" ref="header">
      <slot name="header" />
    </div>
    <div class="d2-container-full__body" ref="body">
      <div
        ref="body_content"
        class="d2-container-full__body_content" >
        <slot />
      </div>
      <!-- <div class="d2-container-full__body_footer" style="height: 94px">
        <div class="page-login--content-footer">
          <div  style="width:calc(100% + 32px)" class="body_footer_line"></div>
          <div
            class="page-login--content-footer-logo"
            style="text-align:center"
          >
            <img src="./logo_dibu.png" alt=""/>
          </div>
          <p class="page-login--content-footer-copyright">
            Copyright
            <d2-icon name="copyright" />
            2021 上海基煜基金销售有限公司
            <a
              href="https://beian.miit.gov.cn/#/Integrated/index"
              target="_blank"
            >
              沪ICP备14043616号
            </a>
          </p>
        </div>
      </div> -->
    </div>
    <div v-if="$slots.footer" class="d2-container-full__footer" ref="footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
import scroll from './mixins/normal'
export default {
  name: 'd2-container-full',
  mixins: [scroll],
  props: {
    showFooter: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  mounted () {
    // 增加滚动事件监听
    this.addScrollListener()
  },
  beforeDestroy () {
    // 移除滚动事件监听
    this.removeScrollListener()
  }
}
</script>

<style lang="scss">
// .d2-container-full__body{
//   position: relative;
//     display: flex;
//     // flex-grow: 1;
//     overflow: scroll;
// }
// 内容区域
.d2-container-full__body_content{
  min-height: calc(100vh - 110px);
  @include backgroundColor(A2);
  // transform: scale3d(1, 1, 1);
  margin: 17px 16px 0;
  padding:  17px 16px 0;
  // position: relative;
  overflow: hidden;
}
// footer
.page-login--content-footer {
  // padding: 12px 0 8px 0;
  // border-top: 1px solid #cfd7e5;
  .page-login--content-footer-logo {
    margin:0 0 13px;
    padding-top: 15px;
  }
  .page-login--content-footer-copyright {
    font-size: 12px;
    line-height: 12px;
    text-align: center;
    color: $color-text-sub;
    a {
      color: $color-text-sub;
    }
  }
  .page-login--content-footer-options {
    padding: 0px;
    margin: 0px;
    font-size: 12px;
    line-height: 12px;
    text-align: center;
    a {
      color: $color-text-sub;
      margin: 0 1em;
      cursor: pointer;
    }
  }
  .body_footer_line{
    height: 12px;
    margin-left: -16px;
    @include backgroundColor(content-bg);
  }
}
.page-title{
  @include color(text);
  font-size: 16px;
  font-weight: 700;
}
</style>
