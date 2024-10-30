import Vue from 'vue'
import * as publicFilter from './publicFilter'

const filters = {
  ...publicFilter
}
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})
