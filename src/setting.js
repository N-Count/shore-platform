export default {
  // 快捷键
  // 支持快捷键 例如 ctrl+shift+s
  hotkey: {
    search: {
      open: 's',
      close: 'esc'
    }
  },
  // 侧边栏默认折叠状态
  menu: {
    asideCollapse: false
  },
  // 在读取持久化数据失败时默认页面
  page: {
    opened: []
  },
  // 菜单搜索
  search: {
    enable: true
  },
  // 注册的主题
  theme: {
    list: [
      {
        title: '浅色主题',
        name: 'lightTheme',
        preview: 'image/theme/lightTheme/small-logo2.png'
      },
      {
        title: '深色主题',
        name: 'darkTheme',
        preview: 'image/theme/darkTheme/small-logo2.png'
      }
    ]
  },
  // 是否默认开启页面切换动画
  transition: {
    active: true
  }
}
