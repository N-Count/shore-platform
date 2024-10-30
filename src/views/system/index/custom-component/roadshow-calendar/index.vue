<template>
  <div class="roadshow-calendar">
    <div class="header-title">基金经理调研日历</div>
    <div class="calendar-body" v-loading="loading">
      <div class="day-box" v-for="item in fmRoadshowList" :key="item.id">
        <DailyRoadshowList
          :theDayList="item"
          @open-roadshow-info="openRoadshowInfo"
          @refresh-roadshow="refreshRoadshow"
        ></DailyRoadshowList>
      </div>
      <!-- <div class="see-more-box">
        <div @click="seeMore">
          <em class="iconfont icon-luyangengduo"></em>
          <span>更多调研</span>
        </div>
      </div> -->
    </div>

    <InfoCardmodal
      :defualtFmImg="defualtFmImg"
      :defualtCompnayImg="defualtCompnayImg"
      :baseInfo="roadshowInfo"
      :id="detailId"
      :dialog-visible="showDialog"
      @dialog-cancel="dialogCancel"
      @dialog-close="dialogCancel"
    />
  </div>
</template>

<script>
// 组件引入
import DailyRoadshowList from './daily-roadshow-list.vue'
import InfoCardmodal from '../mvp-index-comps/info-card-modal.vue'
// 接口引入
//  getManagerPhoto, getCompanyPhoto
import { accesShowlist } from '@/api/bus-frp-agg'
// 常量引入
// 常规JS引入
import dayjs from 'dayjs'
// 混入引入
// VueX引入
import { mapState } from 'vuex'
export default {
  name: '',
  components: { DailyRoadshowList, InfoCardmodal },
  data() {
    return {
      // 基金经理路演列表
      fmRoadshowList: [],
      showDialog: false,
      detailId: '',
      roadshowInfo: {},
      defualtFmImg: '',
      defualtCompnayImg: '',
      loading: false
    }
  },
  props: {
    compId: {
      type: String,
      default: ''
    }
  },
  watch: {
    compId(val) {
      if (val) {
        this.getRoadshowList()
      }
    }
  },
  computed: {
    ...mapState('d2admin/user', ['info'])
  },
  methods: {
    // 获取所有路演列表
    async getRoadshowList() {
      let res = []
      this.loading = true
      try {
        res = (await accesShowlist({ compId: this.compId })) || []
      } catch (e) {
      } finally {
        this.loading = false
        this.fmRoadshowList = this.dataClassify(res)
      }
    },
    // 将所有路演数据以日期归类
    dataClassify(dataObj) {
      const { roadShowList = [], systemTime } = dataObj
      let res = []
      let classify = new Map()
      let thisWeekDateList = []
      // 根据数据返回的系统时间 获取本周工作日日期列表（如果没有返回系统时间接口挂了，就默认获取当前系统时间）
      let todayDate = systemTime
        ? dayjs(systemTime).format('YYYY-MM-DD')
        : dayjs(`${new Date()}`).format('YYYY-MM-DD')
      if (todayDate) {
        let weekList = this.getWeekDay(dayjs(todayDate).format('YYYY-MM-DD'))
        thisWeekDateList = weekList.length >= 7 ? weekList.slice(0, 5) : []
      }
      if (roadShowList.length > 0) {
        roadShowList.forEach(item => {
          let { roadShowTime = '' } = item
          if (roadShowTime) {
            let formatDate = dayjs(roadShowTime).format('YYYY-MM-DD')
            let itemData = []
            if (classify.has(formatDate)) {
              itemData = classify.get(formatDate)
              itemData.push(item)
            } else {
              itemData = [item]
            }
            classify.set(formatDate, itemData)
          }
        })
      }
      if (thisWeekDateList.length > 0) {
        const getWeekDay = num => {
          let resStr = ''
          switch (num) {
            case 1:
              resStr = '一'
              break
            case 2:
              resStr = '二'
              break
            case 3:
              resStr = '三'
              break
            case 4:
              resStr = '四'
              break
            case 5:
              resStr = '五'
              break
          }
          return `星期${resStr}`
        }
        thisWeekDateList.forEach(item => {
          let dayData = {
            id: this.util.randomString(8),
            isToday: item === todayDate,
            systemTime: systemTime,
            date: dayjs(item).format('M月D日'),
            weekDay: getWeekDay(dayjs(item).day()),
            roadshowList: []
          }
          if (classify.has(item)) {
            dayData.roadshowList = classify.get(item)
          }
          res.push(dayData)
        })
      }
      return res
    },
    // 根据传入日期获取本周工作日日期
    getWeekDay(dateString) {
      let dateStringReg = /^\d{4}[/-]\d{1,2}[/-]\d{1,2}$/
      if (dateString.match(dateStringReg)) {
        let presentDate = new Date(dateString)
        let today = presentDate.getDay() !== 0 ? presentDate.getDay() : 7
        return Array.from(new Array(7), (val, index) => {
          return dayjs(
            new Date(presentDate.getTime() - (today - index - 1) * 24 * 60 * 60 * 1000)
          ).format('YYYY-MM-DD')
        })
      } else {
        throw new Error('dateString should be like "yyyy-mm-dd" or "yyyy/mm/dd"')
      }
    },
    // queryFmImg() {
    //   getManagerPhoto({})
    //     .then(res => {
    //       if (!res) return
    //       this.defualtFmImg = res
    //     })
    //     .catch(err => {
    //       console.log(err)
    //     })
    //     .finally(_ => {
    //     })
    // },
    // queryCompanyPhoto() {
    //   getCompanyPhoto({})
    //     .then(res => {
    //       if (!res) return
    //       this.defualtCompnayImg = res
    //     })
    //     .catch(err => {
    //       console.log(err)
    //     })
    //     .finally(_ => {
    //     })
    // },
    dialogCancel() {
      this.showDialog = false
    },
    openRoadshowInfo(info) {
      this.roadshowInfo = info
      this.detailId = info.id
      this.showDialog = true
    },
    refreshRoadshow() {
      console.log('点击')
      this.getRoadshowList()
    }
  },
  created() {},
  mounted() {
    // this.getRoadshowList()
    // this.queryCompanyPhoto()
    // this.queryFmImg()
  }
}
</script>

<style lang="scss" scoped>
div {
  box-sizing: border-box;
}
.roadshow-calendar {
  height: 380px;
  width: 100%;
  padding: 16px 20px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  background-image: url('../../../../../assets/images/calendar-bg-img.png');
  background-size: 180px;
  background-repeat: no-repeat;
  background-position-x: right;
  background-position-y: 214px;

  .header-title {
    height: 24px;
    line-height: 24px;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
    color: rgba(0, 0, 0, 0.9);
  }
  .calendar-body {
    flex-grow: 1;
    display: flex;
    flex-flow: wrap;
    position: relative;

    &:hover {
      .see-more-box {
        opacity: 1;
        & > div {
          display: block;
        }
      }
    }
    .day-box {
      position: relative;
      height: 148px;
      width: calc((100% - 28px) / 3);
      margin-left: 14px;
      margin-bottom: 15px;
      &:first-child,
      &:nth-child(4) {
        margin-left: 0;
      }
    }
    .see-more-box {
      height: 50%;
      width: calc(100% - 28px - ((100% - 28px) / 3 * 2));
      margin-left: 14px;
      margin: 0 auto;
      text-align: center;
      position: relative;
      opacity: 0;
      transition: all 0.3s ease-in-out;
      & > div {
        width: 106px;
        display: none;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        padding: 16px;
        cursor: pointer;
        color: rgba(0, 0, 0, 0.4);
        &:hover {
          & > em,
          & > span {
            color: #409eff;
          }
        }
        & > em {
          display: block;
          font-size: 20px;
        }
        & > span {
          margin-top: 8px;
          font-size: 12px;
          display: block;
          font-weight: normal;
        }
      }
    }
  }
}
</style>
