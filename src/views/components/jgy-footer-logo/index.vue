<template>
  <div class="footer-container">
    <img class="page-login--logo" :src="logoUrl" />
    <p class="page-login--content-footer-copyright">
      Copyright
      <d2-icon name="copyright" />
      2024 上海基煜基金销售有限公司
      <a class="href-copyright" href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">
        沪ICP备14043616号
      </a>
    </p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import dLogo from '@/assets/images/mvpindex/dark_logo.png'
import lLogo from '@/assets/images/mvpindex/light_logo.png'
export default {
  data() {
    return {
      dLogo,
      lLogo,
      logoUrl: ''
    }
  },
  computed: {
    ...mapGetters('d2admin', {
      themeActiveSetting: 'theme/activeSetting'
    })
  },
  created() {
    this.logoUrl = this.themeActiveSetting.name === 'lightTheme' ? lLogo : dLogo
  }
}
</script>

<style lang="scss" scoped>
.footer-container {
  // width: 100%;
  width: calc(100% + 40px);
  margin-left: -20px;
  height: 72px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #f1f2f3;
  .page-login--logo {
    width: 100px;
    height: 32px;
    transform: scale(0.7);
    margin-bottom: 4px;
    color: rgba(0, 0, 0, 0.26);
  }
  .page-login--content-footer-copyright {
    text-align: center;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    line-height: 22px;
    font-weight: normal;
    color: rgba(0, 0, 0, 0.26);
    a {
      color: rgba(0, 0, 0, 0.26);
      &:hover {
        color: #409eff;
      }
    }
  }
}
</style>
