<template>
  <mvpModal v-bind="$attrs" v-on="$listeners" @dialogOpend="dialogOpend">
    <template #header>
      <div class="info-header-wrapper">
        <div :class="['header-avator', baseInfo.activityFlag === '1' ? 'header-logo' : '']">
          <img
            :src="baseInfo.activityFlag === '0' ? getUrl(baseInfo) : geCompnayIcon(baseInfo)"
            alt=""
            class="header-img"
          />
        </div>
        <div class="header-info">
          <div class="info-wrapper">
            <div class="info-name">
              <span class="manager-name" v-if="baseInfo.activityFlag === '0'">
                {{ getFundManagerName() }}
              </span>
              <span class="fund-name fund-detial">{{ detailInfo.fundCompanyName }}</span>
            </div>
            <div v-if="detailInfo.roadShowSector" class="info-type">
              <JyLineCustomTooltip
                :lineHeight="22"
                :maxWidth="330"
                :content="detailInfo.roadShowSector"
              >
              </JyLineCustomTooltip>
            </div>
          </div>
          <div class="status-wrapper">
            <div :class="['status', 'lived']">
              <span class="status-icon icon-zhibotubiao iconfont"></span>
              <span class="status-inner">{{
                baseInfo.roadShowStatus === '2'
                  ? '正在路演'
                  : baseInfo.roadShowStatus === '1'
                  ? '待开始'
                  : '已结束'
              }}</span>
            </div>
            <div class="live-timer">{{ roadShowTime(detailInfo.roadShowTime) }} </div>
          </div>
        </div>
      </div>
    </template>
    <template #content>
      <div
        class="content-wrapper"
        v-if="detailInfo.meetingAddress || detailInfo.qrCodeImgUrl || detailInfo.roadShowTopic"
      >
        <!-- 会议地址 -->
        <div class="content-wrapper-box">
          <div v-if="detailInfo.roadShowTopic" class="guest-introduction theme">
            <div class="road-show-topic">
              <div class="theme-title">路演主题：</div>
              <div class="theme-inner" v-html="ToBreak(detailInfo.roadShowTopic)"> </div>
            </div>
          </div>
          <div class="content-address" style="margin-top: 12px" v-if="detailInfo.meetingAddress">
            <span class="address">会议地址：</span>
            <JyLineCustomTooltip
              customTooltips="address-customTooltips-zIndex"
              :lineHeight="22"
              :maxWidth="330"
              isLink
              :content="detailInfo.meetingAddress"
              @click.native="handlerOpenLink(detailInfo.meetingAddress)"
            >
            </JyLineCustomTooltip>
            <!-- <span class="copy" @click="handlerCopy(detailInfo.meetingAddress, 'address')"
              >一键复制</span
            > -->
          </div>
          <div v-if="detailInfo.meetingPassword" class="content-password" style="margin-top: 12px">
            <span class="miss-passwors">会议密码：</span>
            <jyOldTooltip placement="top" :content="detailInfo.meetingPassword" :open-delay="300">
              <span class="password">{{ detailInfo.meetingPassword }}</span>
            </jyOldTooltip>
            <!-- <span class="copy" @click="handlerCopy(detailInfo.meetingPassword, 'password')"
              >一键复制</span
            > -->
          </div>
        </div>
        <!-- 会议二维码 -->
        <div v-if="detailInfo.qrCodeImgUrl" class="content-wrapper-qrcode">
          <span class="qrcode-text">扫码查看：</span>
          <img class="qrcode-img" :src="detailInfo.qrCodeImgUrl" alt="" />
        </div>
      </div>
    </template>
    <template #footer>
      <div class="footer-wrapper">
        <div class="avator" v-if="detailInfo.roadShowPoster">
          <img :src="detailInfo.roadShowPoster" alt="" />
        </div>
        <div>
          <div class="guest-introduction introduction" v-if="baseInfo.activityFlag === '0'">
            <div class="guest-title">
              <div class="scale">
                <span class="scale-title">在管规模：</span>
                <span>
                  <span class="scale-num">{{ detailInfo.managementScale }}</span>
                  <hint-icon>
                    <span>所有在管产品的合并资产规模</span>
                  </hint-icon>
                </span>
              </div>
              <div class="products">
                <span class="products-title">代表产品：</span>
                <JyLineCustomTooltip
                  :lineHeight="20"
                  :content="getRepresentFundInfoList(detailInfo.representFundInfoList)"
                ></JyLineCustomTooltip>
              </div>
            </div>
          </div>

          <div class="guest-introduction theme" v-if="baseInfo.activityFlag === '1'">
            <div class="theme-space">
              <div class="guest-info">路演嘉宾：</div>
              <div class="guest-wrap">
                <!-- <span :class="'link-info'"> {{ fmName(baseInfo.managerList) }}</span> -->
                <span v-for="(item, idx) in baseInfo.managerList" :key="idx">
                  <span :class="[item.fundManagerId ? 'link-info' : 'link-default ']">{{
                    item.fundManagerName
                  }}</span>
                  <span class="">{{ idx !== baseInfo.managerList.length - 1 ? '、' : '' }}</span>
                </span>
              </div>
            </div>
          </div>

          <div class="guest-introduction theme" v-if="detailInfo.fundManagerIntroduce">
            <div class="theme-space">
              <div class="guest-info">嘉宾简介:</div>
              <div class="guest-wrap">
                <!-- <el-tooltip :content="detailInfo.fundManagerIntroduce" placement="top"> -->
                <div class="guest-inner" v-html="ToBreak(detailInfo.fundManagerIntroduce)"></div>
                <!-- </el-tooltip> -->
                <!-- <BreakTooltip
                :content="detailInfo.fundManagerIntroduce"
                :maxHeight="48"
                :defaultLeval="24"
                :open-delay="300"
                placement="top"
              /> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </mvpModal>
</template>

<script>
import mvpModal from './mvp-modal'
// import BreakTooltip from '@/views/components/jgy-line-break-tooltip'
import hintIcon from '../hint-icon/index.vue'
//
import dayjs from 'dayjs'
// 设置专场图片
import specialImg from '@/assets/images/mvpindex/special.png'
import EmptyFmSee from '@/assets/images/mvpindex/empty-fm-see.png'
import { queryWeekDetail } from '@/api/bus-frp-agg'
export default {
  name: 'cardModal',
  components: {
    mvpModal,
    hintIcon
    // BreakTooltip
  },
  props: {
    baseInfo: {
      type: Object,
      default: () => {
        return {
          activityFlag: '0'
        }
      }
    },
    info: {
      type: Object,
      default: () => {}
    },
    id: String,
    defualtFmImg: [String],
    defualtCompnayImg: [String]
  },
  watch: {},
  computed: {
    geCompnayIcon() {
      return val => {
        if (!val.fundCompanyImage) return this.defualtCompnayImg
        const urls = val.fundCompanyImage
        // ret = ret.substr(0, ret.length - 1)
        return urls
      }
    },
    getUrl() {
      return val => {
        if (!val.managerList?.length) return this.defualtFmImg
        const urls = val.managerList[0].fundManagerImgUrl || this.defualtFmImg
        // ret = ret.substr(0, ret.length - 1)
        return urls
      }
    },
    getFundManagerName() {
      return val => {
        if (!this.baseInfo.managerList?.length) return ''
        const strs = this.baseInfo.managerList[0].fundManagerName
        // ret = ret.substr(0, ret.length - 1)
        return strs
      }
    },
    roadShowTime() {
      return val => {
        return val ? dayjs(val).format('YYYY-MM-DD HH:mm') : ''
      }
    }
  },
  data() {
    return {
      specialImg,
      detailInfo: {},
      loading: false,
      EmptyFmSee
    }
  },
  methods: {
    getRepresentFundInfoList(list = []) {
      if (Array.isArray(list) && list.length) {
        return list.map((item, index) => item.representFund).join('、')
      } else {
        return '-'
      }
    },
    ToBreak(val) {
      return val.replace(/\n/g, '<br/>')
    },
    dialogOpend() {
      this.openInfo()
    },
    openInfo() {
      this.loading = true
      const params = {
        id: this.id
      }
      queryWeekDetail(params)
        .then(res => {
          this.loading = false
          if (!res) return
          this.detailInfo = res
          console.log(res, 2222222)
          // 添加基金经理周周见埋点
        })
        .catch(err => {
          this.loading = false
          console.log(err)
        })
    },
    handlerOpenLink(val) {
      if (val.indexOf('http') > -1) {
        window.open(val)
      }
      //  else {
      //   const urls = 'https://' + val
      //   window.open(urls)
      // }
    },
    handlerCopy(val, type) {

      this.$copyText(val).then(
        e => {
          this.$message.success('复制成功！')
        },
        e => {
          this.$message.error('复制失败！')
        }
      )
    }
    // goProducts() {
    //   const { representFundInnerCode, representFundSimpleName } = this.detailInfo
    //   // const idx = representFundCode.indexOf('.')
    //   // const originCode = representFundCode.substring(0, idx)
    //   if (!representFundInnerCode) return
    //   this.$router.push({
    //     path: `superior/fund-detail-page/${representFundInnerCode}`
    //   })
    //   const params = {
    //     button_name: '基金经理代表产品点击',
    //     click_content: representFundSimpleName,
    //     page_source: '首页'
    //   }
    //   this.$jgySensorsTrack.jgyFrontPageButtonClick(params)
    // }
  }
}
</script>
<style>
/* 固定会议层级 2100 */
.address-customTooltips-zIndex {
  z-index: 2100 !important;
}
</style>
<style lang="scss" scoped>
// 头部
.info-header-wrapper {
  display: flex;
  align-items: center;
  margin-left: 11px;

  .header-avator {
    width: 76px;
    height: 76px;
    border: 4px solid #e5e6eb;
    border-radius: 50%;
    margin-right: 16px;
    overflow: hidden;
  }

  // logo 无需border
  .header-logo {
    width: 84px;
    height: 84px;
    border: none;

    & > img {
      width: 84px;
      height: 84px;
    }
  }

  .header-img {
    width: 76px;
    height: 76px;
  }

  .header-info {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    height: 84px;
  }

  // 信息
  .info-wrapper {
    display: flex;
    padding-top: 8px;
    align-items: center;

    .info-name {
      font-size: 20px;
      line-height: 28px;
      color: #1d2129;

      .manager-name {
        margin-right: 12px;
        color: #409eff;
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }
      }

      // .fund-detial {
      //   &:hover {
      //     cursor: pointer;
      //   }
      // }
    }

    .info-type {
      // width: 62px;
      // height: 26px;
      border-radius: 13px;
      background: #409eff;
      text-align: center;
      // line-height: 26px;
      color: #ffffff;
      margin-left: 12px;
      padding: 3px 17px;
    }
  }

  // 状态
  .status-wrapper {
    display: flex;
    align-items: center;
    margin-top: 19px;

    .status {
      margin-right: 8px;
      padding: 4px 8px;
      // width: 82px;
      // height: 30px;
      border-radius: 6px;
      // padding: 0 7px;
      display: flex;
      align-items: flex-end;

      &-icon {
        // 文字对齐
        position: relative;
        top: -1px;
        font-size: 18px;
        color: #409eff;
        margin-right: 5px;
      }

      &-inner {
        font-size: 16px;
        color: #409eff;
      }
    }

    .lived {
      // @include backgroundOpt(main, 10);
      background: rgba(#409eff, 0.1);
    }

    .live-timer {
      font-size: 20px;
      color: #1d2129;
    }
  }
}

// 会议
.content-wrapper {
  border-radius: 6px;
  padding: 16px 16px;
  background: #f7f8fa;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;

  &-box {
    display: flex;
    flex-direction: column;

    & > div {
      display: flex;
      align-items: flex-start;

      & > span:nth-child(1) {
        white-space: nowrap;
        color: #86909c;
      }

      .copy {
        white-space: nowrap;
        padding: 0px 8px;
        box-sizing: border-box;
        height: 20px;
        line-height: 18px;
        font-size: 12px;
        border: 1px solid #409eff;
        cursor: pointer;
        color: #409eff;
      }

      .link,
      ::v-deep .ellipsis-span {
        margin: 0 12px;
        font-size: 14px;
        cursor: pointer;
        line-height: 20px;
        color: #74abfd;
      }

      .password {
        margin: 0 12px;
        font-size: 14px;
        line-height: 20px;
        color: #1d2129;
      }

      ::v-deep .jy-tooltip {
        width: auto;
      }
    }
  }
  &-qrcode {
    display: flex;
    align-items: flex-start;

    .qrcode-img {
      width: 120px;
      height: 120px;
      margin: 0 10px 0 12px;
      border-radius: 8px;
    }

    .qrcode-text {
      font-size: 14px;
      line-height: 22px;
      color: #1d2129;
      white-space: nowrap;
    }
  }

  .road-show-topic {
    display: flex;
    .theme-title {
      white-space: nowrap;
      color: #86909c;
    }
    .theme-inner {
    }
  }
  .address {
    width: 70px;
  }

  .content-password {
    // margin-top: 19px;
  }
}

//底部
.footer-wrapper {
  display: flex;
  .avator {
    img {
      width: 154px;
      height: 274px;
      border-radius: 6px;
      margin-right: 10px;
    }
  }
  @mixin commonOverflow($keys, $lineheight, $important: 0) {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: $keys;
    overflow: hidden;
    line-height: $lineheight;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
  }

  padding: 0 36px 0 48px;
  font-size: 14px;
  line-height: 22px;
  color: #4e5969;

  .introduction {
    .guest-title {
      margin-bottom: 8px;
      display: flex;
      justify-content: flex-start;

      .scale {
        white-space: nowrap;

        &-num {
          margin-right: 5px;
          margin-left: 12px;
        }
      }

      .products {
        margin-left: 54px;
        display: flex;
        align-items: flex-start;
        &-title {
          white-space: nowrap;
        }

        &-inner {
          @include commonOverflow(2, 24px);
          cursor: pointer;
          color: #409eff;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }

    // .guest-inner {
    // @include commonOverflow(4, 24px);
    // }
  }

  .theme {
    .link-info {
      cursor: pointer;
      color: #74abfd;

      &:hover {
        text-decoration: underline;
      }
    }

    .link-default {
      color: #4e5969;
    }

    .theme-space {
      margin-top: 8px;
      display: flex;
      align-items: flex-start;

      .guest-info {
        margin-bottom: 4px;
        width: 70px;
      }

      .guest-wrap {
        // @include commonOverflow(2, 24px);
        flex: 1;
        margin-left: 12px;

        // fix 修复鼠标hover文字溢出
        .guest-inner {
          max-width: 620px;
          max-height: 250px;
          overflow-y: auto;
        }
      }

      .guest-inner {
        max-width: 620px;
      }

      .theme-title {
        white-space: nowrap;
      }

      .theme-inner {
        margin-left: 12px;
        // @include commonOverflow(2, 24px);
      }
    }
  }

  .icon-wenanjieshi1 {
    vertical-align: inherit;
  }
}
</style>
