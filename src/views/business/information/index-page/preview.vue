<template>
  <d2-container>
    <div class="main" v-if="info.title">
      <el-page-header @back="goBack" content="资讯预览"> </el-page-header>
      <h4 class="title">{{ info.title }}</h4>
      <div class="time">发布时间 <i class="time-split"></i> {{ info.updateTime }}</div>
      <div v-html="info.content"></div>
    </div>
  </d2-container>
</template>

<script>
// 组件引入
// 接口引入
import { getFundCompanyNewsDetail } from '@/api/bus-frp-agg'
// 常量引入
// 常规JS引入
// 混入引入
// VueX引入
// 埋点混入
export default {
  name: 'release-preview',
  mixins: [],
  props: {},
  components: {},
  data() {
    return {
      info: {}
    }
  },
  watch: {},
  computed: {},

  methods: {
    goBack() {
      this.util.redirectRouterParam('/release-info/release-info')
    }
  },
  created() {},
  beforeUpdate() {},
  mounted() {
    getFundCompanyNewsDetail({ id: this.$route.query.id }).then(res => {
      this.info = res
    })
  },
  updated() {},
  beforeDestroy() {},
  destroyed() {}
}
</script>
<style lang="scss" scoped>
.title {
  font-size: 20px;
  color: rgba(0, 0, 0, 0.8);
  margin-top: 20px;
}
.time {
  color: rgba(0, 0, 0, 0.4);
  margin: 10px 0 16px 0;
  display: flex;
  align-items: center;
  &-split {
    margin: -1px 10px 0 10px;
    display: inline-block;
    width: 1px;
    height: 12px;
    background: rgba(0, 0, 0, 0.2);
  }
}
.main {
  ::v-deep img {
    width: 100%;
  }
  ::v-deep video {
    width: 100%;
  }
}
</style>
