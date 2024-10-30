<template>
  <div :class="['report-main', customClass, reportLists.length ? '' : 'report-nodata']">
    <el-row
      :gutter="24"
      v-if="reportLists.length"
    >
      <el-col
        v-for="item in reportLists"
        :key="item.id"
        :xl="reportLists.length !== 1 ? row.xl : 100"
        :lg="row.lg"
        :md="reportLists.length !== 1 ? row.md : 100"
      >
        <div class="report-list report" @click="openPdf(item.fileUrl, item)">
          <div
            class="report-cover market clearfix"
            :style="{
              background: `url(${imgUrl})`,
              backgroundSize: '100% 100%'
            }"
          >
            <div class="market-info">
              <JyLineCustomTooltip isLink line="2" :maxHeight="44" :content="item.firstCategory">
              </JyLineCustomTooltip>
            </div>
          </div>
          <div class="report-inner">
            <div class="report-inner-box">
              <listEllipsis
                :recommandFlag="Number(item.recommandFlag) || 0"
                :content="item.fileName"
              >
              </listEllipsis>
            </div>
            <div class="report-inner-btm">
              <span class="issue" v-if="item.publishDate"> {{ item.publishDate || '-' }}</span>
              <span class="line">|</span>
              <JyLineCustomTooltip
                isLink
                :content="item.firstCategory + '：' + item.secondCategory"
              >
              </JyLineCustomTooltip>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="report-empty" v-else>
      <JyNoDataComp></JyNoDataComp>
    </div>

    <commitMent :visible="visible" @contralModel="contralModel"> </commitMent>
  </div>
</template>

<script>
import listEllipsis from './list-tooltips.vue'
import noDataUrl from '@/assets/images/noData.png'
import commitMent from './commitMent.vue'
export default {
  components: {
    listEllipsis,
    commitMent
  },
  props: {
    refs: {
      type: String,
      default: ''
    },
    // 来源，做埋点
    source: {
      type: String,
      default: ''
    },
    reportLists: {
      type: Array,
      default: () => []
    },
    // 是否是自定义类名
    customClass: {
      type: String,
      default: ''
    }
    // calculateHigh: {
    //   type: [String, Number],
    //   default: 136
    // }
  },
  data() {
    return {
      // headerBg,
      noDataUrl,
      loading: false,
      imgUrl: '',
      lightTheme: require('@/assets/images/mvpindex/research-info-light.png'),
      darkTheme: require('@/assets/images/mvpindex/research-info-dark.png'),
      defaultImage: require('@/assets/images/mvpindex/cover/market.png'),
      width: 'auto',
      visible: false,
      clientWidth: 0,
      // headerImg: require('./imgs/3.jpg'),
      headerImg: '',
      row: {
        xl: 12,
        lg: 12,
        md: 12
      },
      // 当前点击报告信息
      currentUrl: '',
      currentItem: {},
      // 承诺函阅读态
      keyStorage: 'key_readed_status_commit',
      valueStorage: 'value_readed_status_ment'
    }
  },
  watch: {
    '$store.state.d2admin.theme.activeName': {
      handler(value) {
        this.imgUrl = value === 'lightTheme' ? this.lightTheme : this.darkTheme
      },
      immediate: true
    },
    customClass: {
      handler(val) {
        if (val === 'adaption') {
          this.row = {
            xl: 4,
            lg: 8,
            md: 12
          }
        }
      },
      immediate: true
    }
  },
  computed: {},
  mounted() {
    this.$nextTick(_ => {
      const containerBox = document.getElementsByClassName('jy-frame-container-box')
      containerBox[0] && containerBox[0].addEventListener('scroll', this.handleScroll)
    })
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    // 处理滚动tooltip隐藏
    handleScroll() {
      let list = document.getElementsByClassName('jy-tooltip__popper')
      if (list.length > 0) {
        list[list.length - 1].style.display = 'none'
      }
    },
    // 承诺函加密
    setJiami(str = ' ') {
      return str && window.btoa(unescape(encodeURIComponent(str)))
    },
    // 承诺函解密
    getJiemi(str = '') {
      return str && decodeURIComponent(escape(window.atob(str)))
    },
    // 弹窗操作功能
    contralModel(type) {
      this.visible = false
      if (type === 'enter') {
        // 确定 保存承诺函已读状态
        const key = this.setJiami(this.keyStorage)
        const value = this.setJiami(this.valueStorage)
        localStorage.setItem(key, value)
        // 确定 打开pdf
        if (this.currentUrl) {
          this.openPdf(this.currentUrl, this.currentItem)
        }
      } else {
        // 清空当前pdf数据
        this.currentUrl = ''
        this.currentItem = {}
      }
    },
    goDetail() {
      this.$router.push({
        path: 'information/research-report'
      })
    },
    openPdf(val, item) {
      // 获取加密已读状态
      this.currentUrl = val
      this.currentItem = Object.assign({}, item)
      // 添加投研资讯埋点
      // const params = {
      //   research_report_type: item?.firstCategory || '',
      //   research_report_headline: item?.fileName || '',
      //   research_report_headline_is_hot: item?.recommandFlag ? '是' : '否',
      //   page_source: this.source === 'index' ? '首页' : '投研资讯页面'
      // }
      // this.$jgySensorsTrack.jgyResearchReportClick(params)
      // 获取本地阅读状态
      const keyStorage = this.setJiami(this.keyStorage)
      const valueStorage = localStorage.getItem(keyStorage)
      // 如果是未读 && 并且点击私募报告， 则展示弹窗
      // popupFlag
      if (!valueStorage && item.notificationFlag === '1') {
        this.visible = true
      } else {
        // 正常跳转
        this.visible = false
        item.fileId &&
          this.util.goPdfViewer(item.fileId, {
            api: 'voucher',
            fileId: item.fileId,
            pdf_file_class:"投研资讯报告"
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.report-main {
  display: flex;
  justify-content: flex-start;
  margin-left: -8px;
  .clearfix:after {
    content: '';
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
  .clearfix {
    *zoom: 1;
  }
  .report-empty {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    // margin-top: 100px;
    img {
      width: 140px;
      height: 96px;
      margin: 60px auto 30px;
    }
    span {
      color: #38383b;
    }
  }
}
// 暂无数据盒子
.report-nodata {
  display: flex;
  justify-content: center;
}
// 首页暂无数据样式调整
.index-no-data {
  .report-empty {
    margin: 50px 0 100px;
  }
}
// 首页永远保持2条
@media screen and (max-width: 992px) {
  ::v-deep .el-col-24 {
    width: 50%;
  }
}
// 详情页 自适应
.adaption {
  // 两条数据最小宽度展示,自适应撑开
  .el-row {
    min-width: 100%;
    min-width: -moz-available;
    min-width: -webkit-fill-available;
    // min-width: fill-available;
  }
  // 最小自适应
  @media screen and (max-width: 992px) {
    ::v-deep .el-col-md-12,
    ::v-deep .el-col-24 {
      width: 100%;
    }
  }
  // 自适应
  @media screen and (min-width: 992px) {
    ::v-deep .el-col-md-12 {
      width: 50%;
    }
  }
  // 数据只有一条时，保持正常宽度展示
  @media screen and (min-width: 992px) {
    ::v-deep .el-col-md-100 {
      width: 50%;
    }
  }
  @media screen and (min-width: 1921px) {
    ::v-deep .el-col-xl-100 {
      width: 33.333%;
    }
  }
  // 超1920
  @media screen and (min-width: 1921px) {
    ::v-deep .el-col-xl-4 {
      width: 33.333%;
    }
  }
}

.report-list {
  margin-bottom: 12px;
  padding: 10px 8px;
  cursor: pointer;
  height: 64px;
  &:hover {
    box-shadow: 0px 4px 12px -1px rgba(0, 0, 0, 0.08);
    transition: 0.2s;
    border-radius: 6px;
  }
}
.report {
  &-cover {
    float: left;
    width: 54px;
    height: 64px;
    padding: 8px 13px 20px;
    border-radius: 4px;
    box-sizing: border-box;
    text-align: center;
    margin-right: 10px;
  }
  .market {
    background-repeat: no-repeat;
    background-size: 100% 100% !important;
    color: rgba(0,0,0, 0.4);
    &-info {
      font-size: 14px;
      line-height: 22px;
      word-break: break-all;
    }
    &-week-report {
      font-size: 12px;
      font-weight: normal;
      line-height: 20px;
      text-align: center;
      letter-spacing: 0px;
    }
  }
  &-inner {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 14px;
    line-height: 22px;
    // color: #1d2129;
    box-sizing: border-box;
    height: inherit;
    &-box {
      .title-wrap {
        font-size: 14px;
        line-height: 22px;
      }
      .title-hot {
        width: 30px;
        height: 23.04px;
        display: inline-block;
        vertical-align: middle;
      }
      .title-content {
        color: rgba( 0,0,0, 0.9) ;
      }
    }
    .report-inner-btm {
      display: flex;
      color: rgba(0,0,0, 0.4);
      font-size: 12px;
      margin-bottom: -4px;
      .issue {
        white-space: nowrap;
      }
      .line {
        margin: 0 8px;
      }
    }

    &-look {
      font-size: 12px;
      line-height: 20px;
      display: flex;
      align-items: center;
      letter-spacing: 0px;
      color: #4e5969;
      cursor: pointer;
      .el-icon-arrow-right {
        font-size: 12px;
      }
      & span:nth-child(1) {
        margin-right: 4px;
      }
    }
  }
}
</style>
