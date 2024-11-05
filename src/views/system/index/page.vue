<template>
  <d2-container>
     <div>
      首页
      <el-button @click="loginClick">登陆</el-button>
     </div>
  </d2-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import errorPng from '@/assets/images/404.png'
export default {
  data() {
    return {
      errorPng: errorPng
    }
  },
  computed: {
    ...mapState('d2admin', {
      defaultMainPage: state => state.page.defaultMainPage
    })
  },
  methods: {
    ...mapActions('d2admin/account', ['login']),
    loginClick() {
      console.log(555, this.util.getRsaCode('1234567'))
      this.login({
        username: 'admin',
        password: this.util.getRsaCode('1234567')
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
