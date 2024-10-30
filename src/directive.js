/* eslint-disable */
import Vue from 'vue'

Vue.directive('el-drag-dialog', {
  bind (el, binding, vnode) {
    const dialogHeaderEl = el.querySelector('.el-dialog__header')
    const dragDom = el.querySelector('.el-dialog')
    dialogHeaderEl.style.cssText += ';cursor:move;'
    dragDom.style.cssText += ';top:0px;'
    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const getStyle = (function () {
      if (window.document.currentStyle) {
        return (dom, attr) => dom.currentStyle[attr]
      } else {
        return (dom, attr) => getComputedStyle(dom, false)[attr]
      }
    })()

    dialogHeaderEl.onmousedown = e => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - dialogHeaderEl.offsetLeft
      const disY = e.clientY - dialogHeaderEl.offsetTop

      const dragDomWidth = dragDom.offsetWidth
      const dragDomHeight = dragDom.offsetHeight

      const screenWidth = document.body.clientWidth
      const screenHeight = document.body.clientHeight

      const minDragDomLeft = dragDom.offsetLeft
      const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth

      const minDragDomTop = dragDom.offsetTop
      const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomHeight

      // 获取到的值带px 正则匹配替换
      let styL = getStyle(dragDom, 'left')
      let styT = getStyle(dragDom, 'top')

      if (styL.includes('%')) {
        styL =
          Number(document.body.clientWidth) *
          (Number(styL.replace(/\%/g, '')) / 100)
        styT =
          Number(document.body.clientHeight) *
          (Number(styT.replace(/\%/g, '')) / 100)
      } else {
        styL = Number(styL.replace(/\px/g, ''))
        styT = Number(styT.replace(/\px/g, ''))
      }

      document.onmousemove = function (e) {
        // 通过事件委托，计算移动的距离
        let left = e.clientX - disX
        let top = e.clientY - disY

        // 边界处理
        if (-left > minDragDomLeft) {
          left = -minDragDomLeft
        } else if (left > maxDragDomLeft) {
          left = maxDragDomLeft
        }

        if (-top > minDragDomTop) {
          top = -minDragDomTop
        } else if (top > maxDragDomTop) {
          top = maxDragDomTop
        }

        // 移动当前元素
        dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`

        // 广播 拖动事件
        vnode.child.$emit('dragDialog')
      }

      document.onmouseup = function (e) {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
})

Vue.directive('el-drag-dialog-width', {
  bind (el, binding, vnode) {
    const dialogDom = el.querySelector('.el-dialog')
    const lineNode = document.createElement('div')
    lineNode.setAttribute('class', 'dialog-sidebar-line')
    dialogDom.appendChild(lineNode)

    lineNode.onmousedown = e => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - lineNode.offsetLeft
      console.log(disX)
      document.onmousemove = function (e) {
        e.preventDefault() // 移动时禁用默认事件

        // 通过事件委托，计算移动的距离
        const l = e.clientX - disX
        if(l < 620) return
        dialogDom.style.width = `${l}px`
      }

      document.onmouseup = function (e) {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
})

Vue.directive('clickOutside', {
  bind (el, binding) {
    function clickHandler (e) {
      e.stopPropagation()
      window.event.cancelBubble = true // IE浏览器
      let result = false
      // 指令中是否有函数
      if (typeof binding.value === 'function') {
        // 判断是否是DOM本身
        if (el.contains(e.target)) {
          result = true
        }
        binding.value(result)
      }
    }
    el.__vueClickOutside__ = clickHandler
    document.addEventListener('click', clickHandler)
  },
  unbind (el, binding) {
    document.removeEventListener('click', el.__vueClickOutside__)
    delete el.__vueClickOutside__
  }
})

// 拖动时取消文字选中
var clearSlct = 'getSelection' in window ? function () {
  window.getSelection().removeAllRanges()
} : function () {
  document.selection.empty()
}
// v-dialogDrag: 弹窗拖拽
Vue.directive('dialogDrag', {
  bind (el, binding, vnode, oldVnode) {
    const dialogHeaderEl = el.querySelector('.el-dialog__header')
    const dragDom = el.querySelector('.el-dialog')
    if (!binding.value || !dialogHeaderEl || !dragDom) return
    dialogHeaderEl.style.cursor = 'move'

    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null)

    dialogHeaderEl.onmousedown = (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - dialogHeaderEl.offsetLeft
      const disY = e.clientY - dialogHeaderEl.offsetTop
      // 获取到的值带px 正则匹配替换
      let styL, styT
      if (sty.left.includes('%')) {
        // eslint-disable-next-line no-useless-escape
        styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100)
        // eslint-disable-next-line no-useless-escape
        styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100)
      } else if (sty.left.includes('auto')) {
        styL = 0
        styT = 0
      } else {
        // eslint-disable-next-line no-useless-escape
        styL = +sty.left.replace(/\px/g, '')
        // eslint-disable-next-line no-useless-escape
        styT = +sty.top.replace(/\px/g, '')
      }
      document.onmousemove = function (e) {
        // 通过事件委托，计算移动的距离
        let l = e.clientX - disX
        const t = e.clientY - disY
        const leftMin = document.body.clientWidth / 2 - dragDom.offsetWidth / 2
        const percent = parseInt(dragDom.style.marginTop.match(/\d+/g))
        const topMin = document.body.clientHeight * (percent / 100)
        const topMax = document.body.clientHeight * (100 - percent) / 100 - dragDom.offsetHeight
        let left = 0
        let top = 0
        // 限制拖动区域
        if (l + styL <= -leftMin) {
          left = -leftMin
        } else if (l + styL >= leftMin) {
          left = leftMin
        } else {
          left = l + styL
        }
        if (t + styT <= -topMin) {
          top = -topMin
        } else if (t + styT >= topMax) {
          top = topMax
        } else {
          top = t + styT
        }
        // left = l + styL >= leftMin ? leftMin : l + styL
        dragDom.style.left = `${left}px`
        dragDom.style.top = `${top}px`
        clearSlct()
      }

      document.onmouseup = function (e) {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
})

