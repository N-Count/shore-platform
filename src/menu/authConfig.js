// 云朵平台所有角色枚举
export const userRoles = [
  {
    role: '运营超级管理',
    type: '1'
  },
  {
    role: '运营管理',
    type: '2'
  }
]

// 配置指定菜单在特定角色有权限的情况下 是否展示出来（针对左侧菜单列表）
export const visibleMenuConfig = {
  1: {
    showList: [],
    hideList: []
  }
}

// 配置系统中按钮权限列表，按钮命名方式 【页面名称-按钮名称】
export const jgyBtnAuthConfig = {
  1: {
    showList: [],
    // 不可见
    hideList: []
  }
}
