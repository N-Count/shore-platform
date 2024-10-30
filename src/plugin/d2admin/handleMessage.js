import { Message } from 'element-ui'
// 处理message弹出多次问题 只允许弹一次
// 空值 message弹框只弹出一次
const showMessage = Symbol('showMessage')
class DoneMessage {
  [showMessage] (type, options, single) {
    let settings = {}
    if (options instanceof Object) {
      options.offset = 70
      settings = options
    } else {
      settings = {
        message: options,
        offset: 70
      }
    }
    if (single) {
      if (document.getElementsByClassName('el-message').length === 0) {
        Message[type](settings)
      }
    } else {
      Message[type](settings)
    }
  }
  info (settings, single = true) {
    this[showMessage]('info', settings, single)
  }
  warning (settings, single = true) {
    this[showMessage]('warning', settings, single)
  }
  error (settings, single = true) {
    this[showMessage]('error', settings, single)
  }
  success (settings, single = true) {
    this[showMessage]('success', settings, single)
  }
}
const message = new DoneMessage()
export default message
