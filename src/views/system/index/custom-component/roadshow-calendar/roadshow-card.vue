<template>
  <div
    class="roadshow-card"
    :class="[
      isJySelected
        ? typeName === 'lightTheme'
          ? 'jy-jx-border  colorC'
          : 'jy-jx-border colorB'
        : typeName === 'lightTheme'
        ? 'colorA'
        : 'colorB'
    ]"
    @click="seeRoadshowInfo"
  >
    <img v-if="isJySelected" src="../../../../../assets/images/main/jx-icon.svg" alt="" />
    <div class="roadshow-name">
      <JgyTextTooltip className="name" :content="roadshowFmOrSp"></JgyTextTooltip>
      <div v-if="roadshowInProgress" class="voice-playing">
        <div class="play play1"></div>
        <div class="play play2"></div>
        <div class="play play3"></div>
      </div>
    </div>
    <JgyTextTooltip className="roadshow-other" :content="roadshowDateAndFc"></JgyTextTooltip>
  </div>
</template>

<script>
import JgyTextTooltip from '../jgy-text-toottip/index.vue'
import dayjs from 'dayjs'
import { mapGetters } from 'vuex'
export default {
  name: '',
  components: { JgyTextTooltip },
  props: {
    // 路演信息
    roadshowInfo: {
      type: Object,
      default: () => []
    }
  },
  data() {
    return {
      // 路演时间 公司信息
      roadshowDateAndFc: '',
      // 路演基金经理信息/专场信息
      roadshowFmOrSp: '',
      // 是否基煜精选
      isJySelected: false,
      // 是否正在路演
      roadshowInProgress: false,
      typeName: ''
    }
  },
  watch: {
    '$store.state.d2admin.theme.activeName'(value) {
      this.typeName = value
    }
  },
  computed: {
    ...mapGetters('d2admin', {
      themeActiveSetting: 'theme/activeSetting'
    })
  },
  methods: {
    getRoadshowDateAndFm() {
      let {
        roadShowTime = '',
        fundCompanyName = '',
        managerList = [],
        jiYuSelection = '',
        roadShowStatus,
        activityFlag = '0'
      } = this.roadshowInfo
      this.roadshowInProgress = roadShowStatus === '2'
      this.isJySelected = jiYuSelection === '1'
      let date = dayjs(roadShowTime).format('HH:mm')
      let fmList = []
      managerList.forEach(item => {
        if (item.fundManagerName) {
          fmList.push(item.fundManagerName)
        }
      })
      this.roadshowDateAndFc =
        activityFlag === '1' ? `${date} ${fmList.join('、')}` : `${date} ${fundCompanyName}`
      this.roadshowFmOrSp = activityFlag === '1' ? `${fundCompanyName}专场` : fmList.join('、')
    },
    seeRoadshowInfo() {
      this.$emit('open-roadshow-info', this.roadshowInfo)
    }
  },
  created() {},
  mounted() {
    this.getRoadshowDateAndFm()
    this.typeName = this.themeActiveSetting.name
  }
}
</script>

<style lang="scss" scoped>
div {
  box-sizing: border-box;
}
.colorA {
  background: #f4f6fd;
}
.colorB {
  background: #242424;
}
.colorC {
  background: #fff4f2;
}
.roadshow-card {
  min-height: 56px;
  max-height: 56px;
  border-radius: 4px;
  padding: 8px 6px;
  cursor: pointer;
  position: relative;
  border-left: 2px solid #2B53D6;
  // background-color: #2B53D6-focus;

  &:hover {
    box-shadow: 0px 4px 12px -1px rgba(0, 0, 0, 0.08) ;
  }

  & + .roadshow-card {
    margin: 8px 0;
  }

  & > img {
    width: 24px;
    position: absolute;
    top: 0;
    right: 0;
  }

  .roadshow {
    &-name {
      width: 100%;
      height: 20px;
      display: flex;
      align-items: center;
      .name {
        width: 70%;
        font-weight: normal;
        font-size: 12px;
        max-width: 70%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: rgba( 0,0,0, 0.9) ;
      }
    }
    &-other {
      height: 20px;
      line-height: 20px;
      font-weight: normal;
      font-size: 12px;
      max-width: 83%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: rgba(0,0,0, 0.4);
    }
  }
  .voice-playing {
    height: 8px;
    width: 8px;
    margin-left: 4px;
    display: flex;
    align-items: flex-end;
    .play {
      width: 2px;
      max-width: 2px;
      min-width: 2px;
      margin-right: 1px;
      background-color: #409EFF;

      &:last-child {
        margin-right: 0;
      }
      &1 {
        animation: playing1 1s linear infinite alternate;
      }
      &2 {
        animation: playing2 1s linear infinite alternate;
      }
      &3 {
        animation: playing3 1s 0.5s linear infinite alternate;
      }
    }
    @keyframes playing1 {
      0% {
        height: 4px;
      }
      100% {
        height: 8px;
      }
    }
    @keyframes playing2 {
      0% {
        height: 8px;
      }
      100% {
        height: 4px;
      }
    }
    @keyframes playing3 {
      0% {
        height: 4px;
      }
      100% {
        height: 8px;
      }
    }
  }
}

.jy-jx-border {
  border-left: 2px solid #F52D00;
}
</style>
