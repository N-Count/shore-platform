<template>
  <div v-loading="loading" class="chinaecharts">
    <div id="mapChart" style="width: 100%; height: 288px"></div>
  </div>
</template>
<script>
import { accesArea } from '@api/bus-frp-agg'
import './china.js'
import { mapState } from 'vuex'
export default {
  name: 'ChinaEcharts',
  computed: {
    ...mapState('d2admin/user', ['info'])
  },
  data: function () {
    return {
      list: [],
      chart: '',
      loading: false,
      val: ''
    }
  },
  props: {
    compId: {
      type: String,
      default: ''
    }
  },
  methods: {
    getArea() {
      this.loading = true
      accesArea({
        compId: this.compId
      })
        .then(res => {
          this.loading = false
          if (!res) {
            this.mapFn()
            return
          }
          this.list = res.areaAccessList || []
          this.mapFn()
        })
        .catch(err => {
          this.loading = false
          this.mapFn()
          console.log(err)
        })
    },
    getProvincesData(label) {
      // console.log(label)
      let data = 0
      this.list.map(item => {
        if (item.provinces.includes(label)) {
          data = item.value
        }
      })
      return data
    },
    mapFn() {
      // 基于准备好的dom，初始化echarts实例
      this.chart = this.$echarts.init(document.getElementById('mapChart'))

      this.chart.setOption({
        backgroundColor: '', // 背景颜色
        title: {
          text: '',
          subtext: '',
          color: '#fff',
          x: 'center'
        },
        zoom: 1.2,
        layoutCenter: ['50%', '50%'], // 位置
        layoutSize: '120%', // 大小
        aspectScale: 0.2, // 宽高比
        // 是视觉映射组件，用于进行『视觉编码』，也就是将数据映射到视觉元素（视觉通道）。
        // visualMap: {
        //   // 左下角定义 在选中范围中的视觉元素 渐变地区颜色
        //   type: 'piecewise', // 类型为分段型
        //   top: 'bottom',
        //   // calculable: true, //是否显示拖拽用的手柄（手柄能拖拽调整选中范围）。
        //   right: 10,
        //   splitNumber: 6,
        //   seriesIndex: [0],
        //   itemWidth: 20, // 每个图元的宽度
        //   itemGap: 2, // 每两个图元之间的间隔距离，单位为px
        //   // pieces: [
        //   //   // 自定义每一段的范围，以及每一段的文字
        //   //   { gte: 10000, label: '10000人以上', color: '#1890FF' }, // 不指定 max，表示 max 为无限大（Infinity）。
        //   //   {
        //   //     gte: 1000,
        //   //     lte: 9999,
        //   //     label: '1000-9999人',
        //   //     color: '#83C2FF'
        //   //   },
        //   //   {
        //   //     gte: 500,
        //   //     lte: 999,
        //   //     label: '500-999人',
        //   //     color: '#CDE5FF'
        //   //   },
        //   //   {
        //   //     gte: 100,
        //   //     lte: 499,
        //   //     label: '100-499人',
        //   //     color: '#E6F1FF'
        //   //   },
        //   //   {
        //   //     gte: 1,
        //   //     lte: 99,
        //   //     label: '1-99人',
        //   //     color: '#EBF3FF'
        //   //   },
        //   //   { lte: 0, label: '无', color: '#FAFAFA' } // 不指定 min，表示 min 为无限大（-Infinity）。
        //   // ],
        //   textStyle: {
        //     color: '#737373'
        //   }
        // },
        tooltip: {
          show: true, // 鼠标移入是否触发数据
          trigger: 'item', // 出发方式
          formatter: '{b}-机构数量：{c}',
          extraCssText: `box-shadow: 0px 2px 7px 1px rgba(0,0,0,0.1);`,
          backgroundColor: '#fff',
          axisPointer: {
            type: 'none'
          },
          textStyle: {
            color: 'rgba(0, 0, 0, 0.9)',
            fontSize: 12
          }
        },
        // 配置地图的数据，并且显示
        series: [
          {
            name: '地图',
            type: 'map', // 地图种类
            map: 'china', // 地图类型。
            roam: true, // 支持拖拽缩放
            scaleLimit: {
              // 滚轮缩放的极限控制
              min: 1, // 缩放最小大小
              max: 10 // 缩放最大大小
            },
            label: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 10 // 字体大小
                }
              },
              emphasis: {
                show: true
              }
            },
            data: [
              {
                name: '北京',
                itemStyle: {
                  normal: {
                    areaColor: this.getProvincesData('北京') ? '#FCFDCA' : null
                  },
                  emphasis: {
                    areaColor: '#FCFDCA'
                  }
                },
                value: this.getProvincesData('北京')
              },
              {
                name: '天津',
                itemStyle: {
                  normal: {
                    areaColor: this.getProvincesData('天津') ? '#DCCCFF' : null
                  },
                  emphasis: {
                    areaColor: '#DCCCFF'
                  }
                },
                value: this.getProvincesData('天津')
              },
              {
                name: '上海',
                itemStyle: {
                  normal: {
                    areaColor: this.getProvincesData('上海') ? '#DCF1A0' : '#E7E7E7'
                  },
                  emphasis: {
                    areaColor: '#DCF1A0'
                  }
                },
                value: this.getProvincesData('上海')
              },
              {
                name: '重庆',
                itemStyle: {
                  normal: {
                    areaColor: this.getProvincesData('重庆') ? '#DCCCFF' : null
                  },
                  emphasis: {
                    areaColor: '#DCCCFF'
                  }
                },
                value: this.getProvincesData('重庆')
              },
              {
                name: '河北',
                itemStyle: {
                  normal: {
                    areaColor: this.getProvincesData('河北') ? '#D9E5FF' : '#E4E4E4'
                  },
                  emphasis: {
                    areaColor: '#D9E5FF'
                  }
                },
                value: this.getProvincesData('河北')
              },
              {
                name: '河南',
                itemStyle: {
                  normal: {
                    areaColor: this.getProvincesData('河南') ? '#FFCCCC' : '#D7D7D7'
                  },
                  emphasis: {
                    areaColor: '#FFCCCC'
                  }
                },
                value: this.getProvincesData('河南')
              },
              {
                name: '云南',
                itemStyle: {
                  normal: {
                    areaColor: this.getProvincesData('云南') ? '#FFEAC7' : '#E9E9E9'
                  },
                  emphasis: {
                    areaColor: '#FFEAC7'
                  }
                },
                value: this.getProvincesData('云南')
              },
              {
                name: '辽宁',
                itemStyle: {
                  normal: {
                    areaColor: this.getProvincesData('辽宁') ? '#FFCCCC' : '#D7D7D7'
                  },
                  emphasis: {
                    areaColor: '#FFCCCC'
                  }
                },
                value: this.getProvincesData('辽宁')
              },
              {
                name: '黑龙江',
                itemStyle: {
                  normal: {
                    areaColor: this.getProvincesData('黑龙江') ? '#A4EEDD' : '#E0E0E0'
                  },
                  emphasis: {
                    areaColor: '#A4EEDD'
                  }
                },
                value: this.getProvincesData('黑龙江')
              },
              {
                name: '湖南',
                itemStyle: {
                  normal: {
                    areaColor: this.getProvincesData('湖南') ? '#A4EEDD' : '#E0E0E0'
                  },
                  emphasis: {
                    areaColor: '#A4EEDD'
                  }
                },
                value: this.getProvincesData('湖南')
              },
              {
                name: '安徽',
                itemStyle: {
                  normal: {
                    areaColor: this.getProvincesData('安徽') ? '#DCCCFF' : null
                  },
                  emphasis: {
                    areaColor: '#DCCCFF'
                  }
                },
                value: this.getProvincesData('安徽')
              },
              {
                name: '山东',
                itemStyle: {
                  normal: {
                    areaColor: this.getProvincesData('山东') ? '#FFEAC7' : '#E9E9E9'
                  },
                  emphasis: {
                    areaColor: '#FFEAC7'
                  }
                },
                value: this.getProvincesData('山东')
              },
              {
                name: '新疆',
                itemStyle: {
                  normal: {
                    areaColor: this.getProvincesData('新疆') ? '#FCFDCA' : null
                  },
                  emphasis: {
                    areaColor: '#FCFDCA'
                  }
                },
                value: this.getProvincesData('新疆')
              },
              {
                name: '江苏',
                itemStyle: {
                  normal: {
                    areaColor: this.getProvincesData('江苏') ? '#D1F4FF' : null
                  },
                  emphasis: {
                    areaColor: '#D1F4FF'
                  }
                },
                value: this.getProvincesData('江苏')
              },
              {
                name: '浙江',
                itemStyle: {
                  normal: {
                    areaColor: this.getProvincesData('浙江') ? '#FCFDCA' : null
                  },
                  emphasis: {
                    areaColor: '#D1F4FF'
                  }
                },
                value: this.getProvincesData('浙江')
              },
              {
                name: '江西',
                itemStyle: {
                  normal: {
                    areaColor: this.getProvincesData('江西') ? '#D8FFD9' : '#F4F4F4'
                  },
                  emphasis: {
                    areaColor: '#D8FFD9'
                  }
                },
                value: this.getProvincesData('江西')
              },
              {
                name: '湖北',
                itemStyle: {
                  normal: {
                    areaColor: this.getProvincesData('湖北') ? '#C2CAFF' : '#E4E4E4'
                  },
                  emphasis: {
                    areaColor: '#C2CAFF'
                  }
                },
                value: this.getProvincesData('湖北')
              },
              {
                name: '广西',
                itemStyle: {
                  normal: {
                    areaColor: this.getProvincesData('广西') ? '#D1F4FF' : null
                  },
                  emphasis: {
                    areaColor: '#D1F4FF'
                  }
                },
                value: this.getProvincesData('广西')
              },
              {
                name: '甘肃',
                itemStyle: {
                  normal: {
                    areaColor: this.getProvincesData('甘肃') ? '#A4EEDD' : '#E0E0E0'
                  },
                  emphasis: {
                    areaColor: '#A4EEDD'
                  }
                },
                value: this.getProvincesData('甘肃')
              },
              {
                name: '山西',
                itemStyle: {
                  normal: {
                    areaColor: this.getProvincesData('山西') ? '#D8FFD9' : '#F4F4F4'
                  },
                  emphasis: {
                    areaColor: '#D8FFD9'
                  }
                },
                value: this.getProvincesData('山西')
              },
              {
                name: '内蒙古',
                itemStyle: {
                  normal: {
                    areaColor: this.getProvincesData('内蒙古') ? '#FFEAC7' : null
                  },
                  emphasis: {
                    areaColor: '#FFEAC7'
                  }
                },
                value: this.getProvincesData('内蒙古')
              },
              {
                name: '陕西',
                itemStyle: {
                  normal: {
                    areaColor: this.getProvincesData('陕西') ? '#FCFDCA' : null
                  },
                  emphasis: {
                    areaColor: '#FCFDCA'
                  }
                },
                value: this.getProvincesData('陕西')
              },
              {
                name: '吉林',
                itemStyle: {
                  normal: {
                    areaColor: this.getProvincesData('吉林') ? '#DCCCFF' : null
                  },
                  emphasis: {
                    areaColor: '#DCCCFF'
                  }
                },
                value: this.getProvincesData('吉林')
              },
              {
                name: '福建',
                itemStyle: {
                  normal: {
                    areaColor: this.getProvincesData('福建') ? '#D9E5FF' : '#E4E4E4'
                  },
                  emphasis: {
                    areaColor: '#D9E5FF'
                  }
                },
                value: this.getProvincesData('福建')
              },
              {
                name: '贵州',
                itemStyle: {
                  normal: {
                    areaColor: this.getProvincesData('贵州') ? '#D8FFD9' : '#F4F4F4'
                  },
                  emphasis: {
                    areaColor: '#D8FFD9'
                  }
                },
                value: this.getProvincesData('贵州')
              },
              {
                name: '广东',
                itemStyle: {
                  normal: {
                    areaColor: this.getProvincesData('广东') ? '#DCF1A0' : '#E7E7E7'
                  },
                  emphasis: {
                    areaColor: '#DCF1A0'
                  }
                },
                value: this.getProvincesData('广东')
              },
              {
                name: '青海',
                itemStyle: {
                  normal: {
                    areaColor: this.getProvincesData('青海') ? '#DCF1A0' : '#E7E7E7'
                  },
                  emphasis: {
                    areaColor: '#DCF1A0'
                  }
                },
                value: this.getProvincesData('青海')
              },
              {
                name: '西藏',
                itemStyle: {
                  normal: {
                    areaColor: this.getProvincesData('西藏') ? '#FFCCCC' : '#D7D7D7'
                  },
                  emphasis: {
                    areaColor: '#FFCCCC'
                  }
                },
                value: this.getProvincesData('西藏')
              },
              {
                name: '四川',
                itemStyle: {
                  normal: {
                    areaColor: this.getProvincesData('四川') ? '#D9E5FF' : '#E4E4E4'
                  },
                  emphasis: {
                    areaColor: '#D9E5FF'
                  }
                },
                value: this.getProvincesData('四川')
              },
              {
                name: '宁夏',
                itemStyle: {
                  normal: {
                    areaColor: this.getProvincesData('宁夏') ? '#D1F4FF' : null
                  },
                  emphasis: {
                    areaColor: '#D1F4FF'
                  }
                },
                value: this.getProvincesData('宁夏')
              },
              {
                name: '海南',
                itemStyle: {
                  normal: {
                    areaColor: this.getProvincesData('海南') ? '#FCFDCA' : null
                  },
                  emphasis: {
                    areaColor: '#FCFDCA'
                  }
                },
                value: this.getProvincesData('海南')
              },
              {
                name: '台湾',
                itemStyle: {
                  normal: {
                    areaColor: this.getProvincesData('台湾') ? '#A4EEDD' : '#E0E0E0'
                  },
                  emphasis: {
                    areaColor: '#A4EEDD'
                  }
                },
                value: this.getProvincesData('台湾')
              },
              {
                name: '香港',
                itemStyle: {
                  normal: {
                    areaColor: this.getProvincesData('香港') ? '#A4EEDD' : '#E0E0E0'
                  },
                  emphasis: {
                    areaColor: '#A4EEDD'
                  }
                },
                value: this.getProvincesData('香港')
              },
              {
                name: '澳门',
                itemStyle: {
                  normal: {
                    areaColor: this.getProvincesData('澳门') ? '#A4EEDD' : '#E0E0E0'
                  },
                  emphasis: {
                    areaColor: '#A4EEDD'
                  }
                },
                value: this.getProvincesData('澳门')
              },
              {
                name: '南海诸岛',
                itemStyle: {
                  normal: {
                    areaColor: this.getProvincesData('南海诸岛') ? '#A4EEDD' : '#E0E0E0'
                  },
                  emphasis: {
                    areaColor: '#A4EEDD'
                  }
                },
                value: this.getProvincesData('南海诸岛')
              }
            ],
            itemStyle: {
              normal: {
                label: {
                  show: true // 默认是否显示省份名称
                },
                areaStyle: {
                  color: '#FAFAFA' // 默认的地图板块颜色
                },
                borderWidth: 1,
                borderColor: '#D9D9D9'
              },
              // 地图区域的多边形 图形样式。
              emphasis: {
                label: {
                  show: true // 选中状态是否显示省份名称
                }
                // areaStyle: {
                //   color: '#90c31d' // 选中状态的地图板块颜色
                // }
              }
            },
            zoom: 1 // 放大比例
          }
        ]
      })
      window.addEventListener('resize', () => {
        // 自动渲染echarts
        this.chart.resize()
      })
    }
  },
  watch: {
    compId(val) {
      if (val) {
        this.getArea()
      }
    }
  },
  mounted() {
    // this.getArea()
    window.addEventListener(
      'resize',
      this.util.debounce(() => {
        this.chart.resize()
      }, 500)
    )
  }
}
</script>
<style scoped>
.chinaecharts {
  width: 100%;
}
#mapChart {
  width: 100%;
}
</style>
