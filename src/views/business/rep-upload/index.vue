<template>
  <d2-container>
    <el-button type="primary" @click="click()">测试</el-button>
    <div>{{ message }}</div>
    <div>{{ getDate }}</div>
  </d2-container>
</template>

<script>
export default {
  data () {
    return {
      message: 'Hello, Vue.js!',
      getDate: {}
    }
  },
  methods: {
    click() {
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
