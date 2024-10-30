import verificationStr from './verification'
import charClass from './charClass'
import limitLength from './limit-select'
const directives = {
  verificationStr,
  limitLength,
  charClass
}

export default {
  install(Vue) {
    Object.keys(directives).forEach(key => {
      Vue.directive(key, directives[key])
    })
  }
}
