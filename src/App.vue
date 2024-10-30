<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import util from '@/libs/util'
import { mapActions } from 'vuex'
export default {
  name: 'app',
  watch: {
    '$i18n.locale': 'i18nHandle'
  },
  created() {
    this.i18nHandle(this.$i18n.locale)
  },
  methods: {
    ...mapActions('d2admin/account', ['logout']),
    i18nHandle(val, oldVal) {
      util.cookies.set('lang', val)
      document.querySelector('html').setAttribute('lang', val)
    },
    logoutConfirm() {
      this.logout({
        confirm: true
      })
    }
  }
}
</script>

<style lang="scss">
@import '~@/assets/style/public-class.scss';
</style>
