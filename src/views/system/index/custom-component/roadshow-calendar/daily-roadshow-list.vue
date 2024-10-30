<script>
import RoadshowCard from './roadshow-card.vue'
import { cloneDeep } from 'lodash'
// prop 属性，align 是否正序
const compare = (prop, prop1, align = true) => {
  return function (a, b) {
    let val1 = a[prop]
    let val2 = b[prop]
    if (val1 === val2) {
      let newVal1 = parseInt(a[prop1])
      let newVal2 = parseInt(b[prop1])
      return newVal2 - newVal1
    } else {
      if (align) {
        return new Date(val1) - new Date(val2)
      } else {
        return new Date(val2) - new Date(val1)
      }
    }
  }
}
export default {
  name: '',
  components: { RoadshowCard },
  props: {
    // 当天路演信息
    theDayList: {
      type: Object,
      default: () => []
    }
  },
  data() {
    return {
      // 路演列表
      theDayRoadshowList: [],
      // 是否展示展开面板
      showExpandPanel: false,
      // 展开面板Style
      expandPanelStyle: '',
      // 定时器
      timer: null
    }
  },
  watch: {
    theDayList: {
      handler: function () {
        this.getTodayRoadshowList()
      },
      immediate: true,
      deep: true
    }
  },
  computed: {},
  methods: {
    expandMore() {
      this.showExpandPanel = !this.showExpandPanel
      this.setStyle()
    },
    dirExpandMore(state) {
      if (!state) {
        this.showExpandPanel = state
        this.setStyle()
      }
    },
    setStyle() {
      if (this.theDayRoadshowList.length > 2 && this.showExpandPanel) {
        let aryLen = this.theDayRoadshowList.length
        let newHeight = 144
        if (aryLen >= 5) {
          this.expandPanelStyle = 'height:360px;'
        } else {
          newHeight = aryLen * 56 + (aryLen - 1) * 8 + 54
          this.expandPanelStyle = `height:${newHeight}px;`
        }
        // 第二排展开情况
        if (this.$el.parentNode && this.$el.parentNode.offsetTop > 0) {
          this.expandPanelStyle = `${this.expandPanelStyle} top:-164px;`
          // if (aryLen >= 5) {
          //   this.expandPanelStyle = `${this.expandPanelStyle} top:-162px;`
          // } else {
          //   this.expandPanelStyle = `${this.expandPanelStyle} top:-${
          //     newHeight > 144 ? newHeight - 144 : 0
          //   }px;`
          // }
        }
      } else {
        this.expandPanelStyle = ''
      }
      // 设置滚动条位置
      if (!this.showExpandPanel) {
        this.$refs.dayList.scrollTop = 0
      }
    },
    // 创建路演列表
    createRoadshowListDom() {
      const { theDayRoadshowList, $listeners } = this
      if (theDayRoadshowList.length) {
        return theDayRoadshowList.map(item => (
          <RoadshowCard {...{ on: $listeners }} roadshowInfo={item}></RoadshowCard>
        ))
      } else {
        return (
          <div class="roadshow-data-null">
            <em class="iconfont icon-zanwuluyan"></em>
            <span>暂无路演</span>
          </div>
        )
      }
    },
    // 创建展开收起元素
    createExpandDom() {
      const { showExpandPanel, expandMore } = this
      return (
        <div
          class={[
            'expand-more',
            showExpandPanel ? 'expand-more-no-position' : 'expand-more-position'
          ]}
          onClick={expandMore}
        >
          <div class={['more-box']}>
            <span class="expand-title">{showExpandPanel ? '收起' : '展开'}</span>
            <em
              class={[
                'iconfont',
                'icon-xiala',
                'expand-icon',
                showExpandPanel ? 'expand-icon-retract' : ''
              ]}
            ></em>
          </div>
        </div>
      )
    },
    // 获取当天路演列表
    getTodayRoadshowList() {
      const { roadshowList = [], isToday = false } = this.theDayList
      // 对当天路演列表进行排序  排序规则：正在路演的排第一个，未开始按时间随后，已完成的按时间排在最后
      if (isToday) {
        let started = [] // 正在路演
        let notStarted = [] // 未开始
        let ended = [] // 已结束
        roadshowList.length &&
          roadshowList.forEach(item => {
            const { roadShowStatus } = item
            switch (roadShowStatus) {
              case '1':
                notStarted.push(item)
                break
              case '2':
                started.push(item)
                break
              case '3':
                ended.push(item)
                break
            }
          })
        started.length > 1 && started.sort(compare('roadShowTime', 'jiYuSelection', false))
        notStarted.length > 1 && notStarted.sort(compare('roadShowTime', 'jiYuSelection'))
        ended.length > 1 && ended.sort(compare('roadShowTime', 'jiYuSelection'))
        // 从原始列表中删除正在路演的数据，将正在路演数据排到最前面
        this.theDayRoadshowList = roadshowList
        if (started.length > 0) {
          let copyTheDayRoadshowList = cloneDeep(this.theDayRoadshowList)
          started.forEach(item => {
            let findIndex = copyTheDayRoadshowList.findIndex(sItem => sItem.id === item.id)
            if (findIndex !== -1) {
              copyTheDayRoadshowList.splice(findIndex, 1)
            }
          })
          this.theDayRoadshowList = [...started, ...copyTheDayRoadshowList]
        }
        this.roadshowCountdown(notStarted)
      } else {
        this.theDayRoadshowList = roadshowList || []
      }
    },
    // 获取最近的一个路演，计算倒计时
    roadshowCountdown(notStartedAry) {
      if (notStartedAry.length > 0) {
        let { roadShowTime, systemTime } = notStartedAry[0]
        roadShowTime = new Date(roadShowTime)
        systemTime = new Date(systemTime)
        let timerDiff = parseInt(roadShowTime - systemTime) / 1000
        if (timerDiff > 0) {
          this.timer = setInterval(() => {
            timerDiff--
            if (timerDiff === 0) {
              clearInterval(this.timer)
              this.$emit('refresh-roadshow')
            }
          }, 1000)
        }
      }
    }
  },
  created() {},
  mounted() {
    this.$refs.dayList.addEventListener('scroll', () => {
      let tooltipList = document.querySelectorAll("div[aria-hidden='false']")
      if (tooltipList.length > 0) {
        tooltipList.forEach(dom => {
          dom.style.display = 'none'
        })
      }
    })
  },
  render() {
    const {
      theDayList,
      theDayRoadshowList,
      showExpandPanel,
      expandPanelStyle,
      dirExpandMore,
      createExpandDom,
      createRoadshowListDom
    } = this
    const directives = [{ name: 'clickOutside', value: dirExpandMore, modifiers: {} }]
    return (
      <div
        class={['daily-roadshow-list', showExpandPanel ? 'daily-roadshow-list-expand' : '']}
        style={expandPanelStyle}
        {...{ directives }}
      >
        <div class="day-title">
          <span>{theDayList.date}</span>
          <span>{theDayList.weekDay}</span>
        </div>
        <div
          class={'day-list'}
          style={
            showExpandPanel
              ? 'overflow: auto; max-height: 312px;padding-bottom: 4px;'
              : 'overflow: hidden; max-height: 128px;padding-bottom: 8px;'
          }
          ref="dayList"
        >
          {createRoadshowListDom()}
        </div>
        {theDayRoadshowList.length > 2 ? createExpandDom() : ''}
      </div>
    )
  },
  beforeDestroy() {
    this.timer && clearInterval(this.timer)
    this.$refs.dayList && this.$refs.dayList.removeEventListener('scroll')
  }
}
</script>

<style lang="scss" scoped>
div {
  box-sizing: border-box;
}
.daily-roadshow-list {
  width: 100%;
  position: absolute;
  top: 0;
  padding-left: 4px;
  padding-right: 1px;
  height: 144px;
  transition: all 0.3s ease;

  &:hover {
    .more-box {
      height: 20px;
      width: 100%;
      border-radius: 10px;
      .expand-title {
        overflow: hidden;
        width: 30px;
      }
    }
  }
}
.daily-roadshow-list-expand {
  z-index: 10;
  background-color: #FFF;
  border-radius: 4px;
  box-shadow: 0px 8px 20px -2px rgba(0, 0, 0, 0.2);
}
.day-title {
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  font-weight: normal;
  margin-bottom: 8px;
  color: rgba(0,0,0, 0.4);

  span {
    &:last-child {
      margin-left: 6px;
    }
  }
}
.day-list {
  min-height: 124px;
  padding-right: 1px;
  transition: all 0.3s ease;
  &::-webkit-scrollbar {
    width: 2px;
  }
  // 无路演数据
  .roadshow-data-null {
    width: 100%;
    min-height: 124px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    color: rgba(0,0,0, 0.4);
    background-color: #F7F7FA;
    & > em {
      font-size: 30px;
    }
    & > span {
      font-size: 12px;
      margin-top: 4px;
    }
  }

  // 最后一个元素
  & > .roadshow-card:last-child {
    margin-bottom: 4px;
  }
}
.expand-more {
  width: 100%;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent !important;
  .more-box {
    font-size: 12px;
    font-weight: normal;
    text-align: center;
    cursor: pointer;
    color: rgba(0,0,0, 0.4);
    & > em {
      font-size: 16px;
    }
    &:hover {
      color: #409EFF;
    }
  }
}
.expand-title {
  transition: all 0.2s ease;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 0px;
}
.expand-more-position {
  position: absolute;
  bottom: -9px;
  background: transparent !important;
  .more-box {
    height: 12px;
    width: 20px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    box-shadow: 0px 4px 12px -1px rgba(0, 0, 0, 0.08);
    background-color: #FFF;
  }
}
.expand-more-no-position {
  background: transparent !important;
  .more-box {
    height: 20px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .expand-title {
      overflow: auto;
      width: 30px;
    }
  }
}

.expand-icon {
  display: inline-block;
  transition: transform 0.3s;

  &-retract {
    transform: rotate(180deg);
  }
}
</style>
