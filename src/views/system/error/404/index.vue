<template>
  <div class="page">
    <div class="pageImg">
      <img :src="errorPng" alt="" />
    </div>
    <el-button class="d2-mt" @click="$router.replace({ path: defaultMainPage })">
      返回首页
    </el-button>
  </div>
</template>
<script>
import { mapState } from 'vuex'
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
  }
}
</script>

<style lang="scss" scoped>
.page {
  background: #303133;
  background-blend-mode: multiply, multiply;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .pageImg {
    margin-bottom: 24px;
  }
  .page_title {
    font-size: 20px;
    color: #fff;
  }
}
</style>
