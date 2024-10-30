import { MessageBox } from 'element-ui'
export const uploadTableColumn = [
  {
    prop: 'fileName',
    label: '研报标题',
    attrs: { minWidth: '100px', align: 'center' }
  },
  // {
  //   prop: 'labelNameList',
  //   label: '标签',
  //   attrs: { minWidth: '100px', align: 'center' }
  // },
  {
    prop: 'compSimpName',
    label: '基金公司',
    attrs: { minWidth: '100px', align: 'center' }
  },
  {
    prop: 'updateTime',
    label: '更新日期',
    attrs: { minWidth: '100px', align: 'center' }
  },
  {
    prop: 'reportStatus',
    label: '状态',
    attrs: { minWidth: '100px', align: 'center' }
  },
  {
    prop: 'reviewStatus',
    label: '审核状态',
    attrs: { minWidth: '100px', align: 'center',  showOverflowTooltip: true }
  },
  {
    prop: 'reviewComment',
    label: '备注',
    attrs: { minWidth: '100px', align: 'center',  showOverflowTooltip: true }
  },
  {
    prop: 'opt',
    label: '操作',
    attrs: { minWidth: '100px', align: 'center' }
  }
]
export const STATUS = {
  reCommandFlag: [
    { key: '1', val: '推荐' },
    { key: '0', val: '不推荐' }
  ],
  reportStatus: [
    { key: '0', val: '未发布' },
    { key: '1', val: '上线' },
    { key: '2', val: '下线' }
  ],
  notificationFlag: [
    { key: '1', val: '是' },
    { key: '0', val: '否' }
  ],
  displayChannel: [
    { key: '0', val: 'PC端' },
    { key: '1', val: 'PC端+移动端' }
  ],
  synchronizeWechatFlag: [
    { key: '1', val: '同步' },
    { key: '0', val: '不同步' }
  ]
}
export const PROD = {
  headerDispose: {
    a: {
      prop: 'fileName',
      label: '研报标题',
      is: 'input',
      maxlength: '200',
      attrs: { minWidth: '200px' }
    },
    b: {
      prop: 'labelIdList',
      label: '标签',
      is: 'remote',
      multiple: true,
      collapseTags: true
    },
    c: {
      prop: 'compId',
      label: '基金公司',
      is: 'remote',
      filterable: true
      // multiple: true,
      // collapseTags: true
    }
  },
  uploadFormConfig: {
    a: {
      prop: 'fileId',
      label: '上传报告',
      is: 'slot',
      rules: { required: true, message: '请上传报告' }
    },
    b: {
      prop: 'fileName',
      label: '研报标题',
      is: 'slot',
      rules: { required: true, message: '研报标题不能为空' }
    },
    d: {
      prop: 'compId',
      label: '基金公司',
      is: 'remote',
      rules: { required: true, message: '请输入基金公司' }
    },
    e: {
      prop: 'compSimpName',
      label: '基金公司',
      is: 'text'
    },
    // f: {
    //   prop: 'labels',
    //   label: '研报标签',
    //   is: 'slot'
    // },
    j: {
      prop: 'publishDate',
      label: '发布日期',
      is: 'slot',
      rules: { required: true, message: '请选择发布日期' }
    },
    k: {
      prop: 'fundList',
      is: 'slot',
      label: '相关产品'
    }
  }
}

/**
 * @description  小弹窗方法
 * @param {*} fn 执行函数
 * @param {*} hintText 提示文字
 * @param {*} loadText 加载文字
 *
 */
export const smallPop = (fn, hintText, loadText) => {
  MessageBox.prompt(hintText, {
    title: '提示',
    type: 'warning',
    showCancelButton: true,
    showInput: false,
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true
        instance.confirmButtonText = loadText
        try {
          fn()
        } finally {
          done()
          instance.confirmButtonLoading = false
          instance.confirmButtonText = '确定'
        }
      } else {
        done()
      }
    }
  }).catch(error => {
    console.log(error)
  })
}

const noop = () => {}
export const findColumns = (ids, columns, cb = noop) => {
  const columnMap = {}
  const columnList = ids.split('').map(id => (columnMap[id] = { id, ...columns[id] }))

  cb(columnMap)
  return columnList
}

/**
 * @description  转换下拉数据key
 * @param {*} list 要转换的数组
 * @param {*} value 要转换码值
 * @param {*} label 要转换中文
 * @returns {*}  返回数组
 */
export const transformKey = (list, value, label) => {
  const newList = []
  list.map(item => {
    newList.push({
      key: item[value],
      val: item[label]
    })
  })
  return newList || []
}
