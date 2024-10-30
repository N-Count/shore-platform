// 将系统中多出用到的业务相关组件挂载到全局
// import Vue from 'vue'
// Vue.component('xxx', xxx)
import Vue from 'vue'
import jyPagination from './jy-pagination'
import JyLineCustomTooltip from './jgy-line-custom-tooltip'
import jyOldTooltip from './jy-tooltip'
import JyDialog from './jgy-dialog'
import JyOldTable from './jy-table/install'
Vue.component('jyPagination', jyPagination)
Vue.component('JyDialog', JyDialog)
Vue.component('JyLineCustomTooltip', JyLineCustomTooltip)
Vue.component('jyOldTooltip', jyOldTooltip)

Vue.use(JyOldTable)
