<template>
  <d2-container>
    <el-button type="primary" @click="click()">接口测试</el-button>
    <div>{{ message }}</div>
    <div>{{ getDate }}</div>
  </d2-container>
</template>

<script>
import { logIn } from '@api/bus-frp-agg'
export default {
  data () {
    return {
      message: 'Hello, Vue.js!',
      getDate: {}
    }
  },
  methods: {
    click() {
      logIn({
        username: 'admin',
        password: this.util.getRsaCode('123321')
      })
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
      this.$message.info('Button clicked!')
      this.getDate = {
        name: 'getDate',
        children: [
          {
            name: 'getTime',
            value: 123
          }
        ]
      }
    }
  }
}

</script>

<style lang="scss" scoped>

</style>
