<template>
  <div class="noData">
    <img class="noData-chart" :src="noDataUrl" alt="暂无数据" v-if="noDataUrl" />
    <span>暂无数据</span>
  </div>
</template>
<script>
export default {
  name: 'noData',
  components: {},
  props: {
    noDataUrl: {
      type: String,
      default: ''
    },
    className: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>
<style scoped lang="scss">
.noData {
  display: block;
  margin: 0 auto;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: column;
  align-content: space-between;
  justify-content: center;
  .noData-chart {
    width: 140px;
    height: 96px;
    margin: 0 auto;
  }
  span {
    width: 100%;
    text-align: center;
    display: block;
    margin-top: 8px;
    @include color(text);
    font-size: 14px;
  }
}
</style>
