/**
 * 全局常量
 * @example 代码翻译为文字：constant.custType['1']
 * @example 文字翻译为代码：constant.convert(custType, '个人')
 */
const constant = {
  custType: {
    '0': '机构',
    '1': '个人',
    '2': '产品'
  },
  scoreType: {
    '1': '货基',
    '2': '固收',
    '3': '权益'
  },
  // 主题色配置
  mainColorLists: {
    'darkTheme': '#FFA10A',
    'lightTheme': '#D60010'
  },
  // 图表X轴y轴刻度文字颜色
  lineNameColorLists: {
    'darkTheme': '#FFFFFF',
    'lightTheme': '#38383B'
  },
  // 图表X轴y轴颜色
  lineColorLists: {
    'darkTheme': '#333333',
    'lightTheme': '#E6E6E6'
  },
  // 图表X,y軸zoom border顏色
  dataZoomBorderColorLists: {
    'darkTheme': '#EBD9B5',
    'lightTheme': '#D2AE87'
  },
  // 图表zoom icon
  dataZoomIconList: {
    'darkTheme': 'image://' + require('../assets/images/charts/handleIconBlack.png'),
    'lightTheme': 'image://' + require('../assets/images/charts/handleIconWhite.png')
  },
  // 其他图表指标color
  dataLegendColorList: {
    'darkTheme': ['#FAAD32', '#6195FF', '#FF5E45', '#02CC8F', '#FF8F42', '#39E3FF', '#FF8181', '#B378FF', '#D5FA67', '#99BBFF', '#FBE5A2', '#BD98FA', '#10C7BB', '#FFDDE5', '#7875FF', '#C7F9AB', '#FFDB26', '#FF3953', '#B1FEFF', '#ED97EB', '#CBDF42', '#F8B6A7', '#4EEB58', '#FD6C06', '#4AEC8E', '#FFD57A', '#65B019', '#51BBCC', '#BAAC1B', '#DCF6D4', '#AD7000', '#A6FB78', '#B874CD', '#017A7A', '#F9D6A8', '#11984A', '#B3291E', '#5D7092', '#CFFF4D', '#9DB7BE'],
    'lightTheme': ['#F56849', '#5A8EFA', '#FABB41', '#02CC8E', '#FF8640', '#34D7F0', '#8560F5', '#AFD833', '#34AFCF', '#FFB492', '#B3451A', '#984ABB', '#0FC7BA', '#5370C6', '#91CC74', '#DC5E71', '#FFDB27', '#309D6B', '#C55842', '#65B019', '#DCA853', '#076F7A', '#684575', '#B58355', '#009A64', '#F83D17', '#1C99F3', '#FF4BA7', '#BAAC1A', '#5A5AFF', '#AD7000', '#6645C0', '#D0133D', '#0E753C', '#B22276', '#C86335', '#5D7092', '#FF7256', '#1D74E0', '#639D9E']
  },
  // 折线柱状图表指标color
  lineBarColorLists: {
    'darkTheme': ['#66502B', '#6195FF', '#FF5E45', '#4AEC8E', '#FF8C3E', '#39E3FF'],
    'lightTheme': ['#F56849', '#5A8EFA', '#FABB41', '#38D97C', '#FF8640', '#34D7F0']
  },
  // 雷达图背景
  radarBgColorLists: {
    'darkTheme': '#000000',
    'lightTheme': '#FFFFFF'
  },
  // 图表tootip背景色
  tipBgColorLists: {
    'darkTheme': 'rgba(255,255,255, 0.8)',
    'lightTheme': 'rgba(56,56,59, 0.8)'
  },
  // 图表tootip文字颜色
  tipTextColorLists: {
    'darkTheme': '#181818',
    'lightTheme': '#ffffff'
  },
  // 引导线labelLine颜色
  labelLineColorLists: {
    'darkTheme': '#4E4E50',
    'lightTheme': '#C0C0C0'
  },

  researchName: {
    '1': '权益型',
    '2': '固收型',
    '3': '固收+型',
    '4': '其他型'
  },

  /**
   * 常量转换
   * @param {常量的键} type
   * @param {翻译的值} value
   * @param {默认值} defaultVal
   */
  convert (type, value, defaultVal = '--') {
    if (type && value) {
      let data = Object.entries(this[type]).filter(res => res[1] === value)
      return data.length > 0 ? data[0][0] : defaultVal
    }
    return defaultVal
  }
}

export default constant
