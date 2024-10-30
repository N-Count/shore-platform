<template>
  <div v-loading="loading">
    <div id="echart" v-if="!empty" :style="{ width: '100%', height: chartH + 'px' }"></div>
    <no-data
      v-if="empty"
      :noDataUrl="noDataImg"
      :style="{ width: '100%', height: chartH + 'px' }"
    />
  </div>
</template>

<script>
import NoData from '../noData.vue'
// 接口引入
import { accesOrgGroup } from '@api/bus-frp-agg'
import dayjs from 'dayjs'
// import { padStart } from 'lodash'
import { mapState } from 'vuex'
import noDataImg from '../../../../../assets/images/noData.png'
export default {
  name: 'echart',
  components: {
    NoData
  },
  props: {
    compId: {
      type: String,
      default: ''
    }
  },
  watch: {
    // 添加侧边栏展开收起，图表自适应
    asideCollapse() {
      this.$nextTick(_ => {
        this.chart && this.chart.resize()
      })
    },
    compId(val) {
      if (val) {
        this.getOrgGroup()
      }
    }
  },
  computed: {
    ...mapState('d2admin/user', ['info'])
  },
  data: function () {
    return {
      noDataImg,
      loading: false,
      empty: false,
      year: dayjs().year(),
      dateArr: [],
      seriesData: [],
      yAxisList: [],
      data: [],
      chartH: 456
    }
  },
  created() {
    // 饼图弹窗背景颜色
    this.tipBgColor = '#fff'
    // 饼图弹窗文字颜色
    this.tipTextColor = 'rgba(0, 0, 0, 0.9)'
    // 标题颜色
    this.titleColor = 'rgba(0, 0, 0, 0.9)'
    // 柱状图颜色
    this.pieColor = [
      ' #FF7F71',
      '#8091FF',
      ' #FFC156',
      '#3CDAB4',
      '#75B3FF',
      '#A496FF',
      '#5ED7FF',
      ' #D08DFC'
    ]
    this.fillerColor = '#A08D7930'
    this.xAxisLineColor = 'rgba(0, 0, 0, 0.1)'
  },
  mounted() {
    // this.getOrgGroup()
    this.countH()
    this.chart = this.$echarts.init(document.getElementById('echart'))
    window.addEventListener(
      'resize',
      this.util.debounce(() => {
        this.chart.resize()
        this.countH()
      }, 500)
    )
  },

  methods: {
    countH() {
      const rightH = document.getElementsByClassName('right-top')[0].clientHeight
      const righbH = document.getElementsByClassName('roadshow-calendar')[0].clientHeight
      const leftH = document.getElementsByClassName('left-top')[0].clientHeight
      this.chartH = rightH + righbH + 16 - leftH - 32 - 26
    },
    getOrgGroup() {
      this.loading = true
      // 重置数据
      this.empty = false
      this.year = dayjs().year()
      this.dateArr = []
      this.seriesData = []
      this.yAxisList = []
      this.data = []
      accesOrgGroup({
        compId: this.compId
      })
        .then(res => {
          this.loading = false
          if (!res) return
          this.data = res?.histogramChartList
          this.formartData()
        })
        .catch(err => {
          this.loading = false
          this.empty = true
          console.log(err)
        })
    },
    formartData() {
      this.data.map(item => {
        this.dateArr.push(item.month)
        const seriesData = item.items.map(n => {
          return {
            name: n.data,
            value: n.value
          }
        })
        this.seriesData.push(seriesData)
        this.yAxisList = this.getIntersection()
      })
      this.draw()
    },
    getIntersection() {
      let result = []
      this.seriesData.map((item, index) => {
        for (let i = 0; i < item.length; i++) {
          result.push(item[i].name)
        }
      })
      return [...new Set(result)]
    },
    getSeriesOpt(arr, arr2) {
      const result = []
      arr2.forEach(element => {
        const item = {
          name: element,
          type: 'bar',
          barMaxWidth: 10,
          connectNulls: false,
          data: []
        }
        arr.forEach(subArr => {
          const found = subArr.find(obj => obj.name === element)
          if (found) {
            item.data.push(found.value)
          } else {
            item.data.push(null)
          }
        })
        result.push(item)
      })
      return result
    },
    getxAxisData() {
      const originalArray = this.data.map(i => i.month)

      // const result = originalArray.map((item, index) => {
      //   const data = Array(originalArray.length).fill('')
      //   data[index] = item
      //   return {
      //     type: 'category',
      //     axisTick: { show: false },
      //     axisLine: {
      //       show: true,
      //       lineStyle: {
      //         color: this.xAxisLineColor,
      //         type: 'solid'
      //       }
      //     },
      //     axisLabel: {
      //       color: this.titleColor
      //     },
      //     data: data
      //   }
      // })
      return originalArray
    },
    draw() {
      try {
        const echartDom = document.getElementById('echart')
        if (!echartDom) return
        this.chart = this.$echarts.init(echartDom)
        if (this.data?.length === 0) {
          this.empty = true
          return
        }
        this.empty = false

        this.chart.setOption(
          {
            color: this.pieColor,
            tooltip: {
              trigger: 'axis',
              extraCssText: `box-shadow: 0px 2px 7px 1px rgba(0,0,0,0.1);`,
              backgroundColor: this.tipBgColor,
              axisPointer: {
                type: 'none'
              },
              textStyle: {
                color: this.tipTextColor,
                fontSize: 12
              },
              formatter: params => {
                let res = `${params[0].name} <br/>`
                for (const item of params) {
                  if (item.value !== '-' && item.value) {
                    res += `<div style="display: flex; width: 100%;
                    margin-top: 4px;
                align-items: center;
                justify-content: flex-start;"><span class="bar-tips-box" style="background: ${item.color}; height:10px; width: 10px; border-radius: 50%;display: inline-block;margin-right:10px;"></span><div style="flex: 1;
                display: flex;
                justify-content: space-between;"> <span> ${item.seriesName}：</span><span class="bar-tips-text" >${item.value}</span></div></div>`
                  }
                }
                return `<div style="padding: 4px">${res}</div>`
              }
            },
            grid: { left: 40, top: 60, right: 30, bottom: 50 },
            xAxis: {
              data: this.getxAxisData(),
              type: 'category',
              axisLine: {
                show: true,
                lineStyle: {
                  color: this.xAxisLineColor,
                  type: 'solid'
                }
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                color: this.titleColor
              }
            },
            // xAxis: this.getxAxisData(),
            yAxis: {
              axisTick: { alignWithLabel: false, show: false },
              type: 'value',
              splitLine: {
                lineStyle: {
                  type: 'dotted',
                  color: this.xAxisLineColor
                }
              },
              axisLine: {
                show: false,
                lineStyle: {
                  color: this.titleColor,
                  type: 'solid'
                }
              }
            },
            legend: {
              top: '10',
              right: '16px',
              icon: 'roundRect',
              itemGap: 15,
              itemWidth: 10,
              itemHeight: 10,
              textStyle: {
                color: this.titleColor,
                fontSize: 12
              }
            },
            series: this.getSeriesOpt(this.seriesData, this.yAxisList)
          },
          true
        )
        setTimeout(() => {
          this.chart.resize()
        }, 0)

        // 绘制图表
        // chart.setOption(option, { notMerge: true })
      } catch (error) {
        console.log(error)
        this.empty = true
      } finally {
      }
    }
  }
}
</script>

<style></style>
