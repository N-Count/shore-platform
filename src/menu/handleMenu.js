import routes from '@/router/routes'
import { visibleMenuConfig } from './authConfig'
// import { userRoles, visibleMenuConfig } from './authConfig'
// import { cloneDeep, isEmpty } from 'lodash'
import { cloneDeep } from 'lodash'
import store from '@/store/index'
const { MENUICONOPTION = [], MENU_AUTH_OPTIONS = {} } = window.CONFIG
// 缓存用户菜单数据和可见页面列表
let cacheUserMenuAndPageList = {
  userMenuList: [],
  allRouterListByRole: []
}

// 判断当前用户角色是否有路由访问权限
const hasPermission = (routerInfo, userRoleType, orgCode) => {
  let flag = true
  let {
    name = '',
    meta: { noAccess = '' }
  } = routerInfo
  // 首先判断当前菜单是否有特殊权限配置 只对应一些特殊机构开发或关闭
  if (MENU_AUTH_OPTIONS[name]) {
    let { visible = true, orgVisibleList = [], roleVisibleList = [] } = MENU_AUTH_OPTIONS[name]
    // 如果没有配置机构和角色列表，根据visible是否可见判断，如果 true 都可见 false 都不可见
    if (!orgVisibleList.length && !roleVisibleList.length) {
      flag = visible
    } else {
      // 判断机构是否满足条件
      let state = orgVisibleList.length ? orgVisibleList.includes(orgCode) : true
      flag = state
      if (state) {
        // 判断角色是否满足条件
        state = roleVisibleList.length ? roleVisibleList.includes(userRoleType) : true
        flag = visible ? state : !state
      }
    }
  } else {
    if (userRoleType && noAccess) {
      flag = !noAccess.split(',').includes(userRoleType)
    }
  }
  return flag
}
// 给指定菜单添加icon
const setMenuIcon = menuName => {
  if (MENUICONOPTION[menuName]) {
    return {
      menuBadgeUrl: '-',
      menuBadgeClass: `jgy-menu-badge-icon-class-${MENUICONOPTION[menuName].icon}`
    }
  } else {
    return {}
  }
}
// 创建一个menu菜单节点
const createMenuItem = (routerInfo, parentPath, userRoleType, orgCode) => {
  // 菜单配置参数
  let menuNode = null
  // 解构当前节点参数
  let { name, path, meta = {} } = routerInfo
  if (path && Object.keys(meta).length) {
    let {
      isMenu = false,
      showMenu = true,
      title = '',
      miniTitle = '',
      iconClass = '',
      menuBadgeIcon = '',
      menuBadgeClass = '',
      menuBadgeUrl = '',
      order = 0
    } = meta
    // 判断权限
    let isAdd = hasPermission(routerInfo, userRoleType, orgCode)
    if (isAdd) {
      // 路由拼接前缀
      let routerPrefix = ''
      if (parentPath !== '') {
        routerPrefix = parentPath === '/' ? '/' : parentPath + '/'
      }
      // 基本信息
      menuNode = {
        name: name,
        path: `${routerPrefix}${path}`,
        title: title,
        miniTitle: miniTitle,
        iconClass: iconClass ? `iconfont ${iconClass}` : '',
        menuBadgeIcon: menuBadgeIcon ? `iconfont ${menuBadgeIcon}` : '',
        menuBadgeUrl: menuBadgeUrl || '',
        menuBadgeClass: menuBadgeClass || '',
        showMenu: showMenu,
        meta: meta,
        order: order,
        isMenu: isMenu
      }
      // 处理动态路由
      if (path.indexOf('/:') !== -1) {
        menuNode.path = menuNode.path.slice(0, menuNode.path.indexOf('/:'))
      }
      // 添加icon图标
      menuNode = Object.assign(menuNode, setMenuIcon(name))

      // 特殊角色菜单是否可见的个性化配置
      const { showList = [], hideList = [] } = visibleMenuConfig[userRoleType] || {}
      let showMenuVal = menuNode.showMenu
      if (showList.includes(name)) {
        showMenuVal = true
      }
      if (hideList.includes(name)) {
        showMenuVal = false
      }
      menuNode.showMenu = showMenuVal
    }
  }
  return menuNode
}

// 获取对应角色所能看到的所有菜单信息(包含不在菜单中展示的数据)
let allRouterListByRole = []
// 路由分类处理 区分出当前角色下的全部可访问路由和可以当做菜单的路由
const handleRouteByRole = routeList => {
  let menuRouteList = []
  if (routeList.length) {
    routeList.forEach(item => {
      // 判断是否是菜单路由
      if (item.isMenu) {
        menuRouteList.push(item)
      }
      // 收集当前角色可以访问的所有页面列表
      let copyItem = cloneDeep(item)
      delete copyItem.children
      allRouterListByRole.push(copyItem)
    })
  }

  return menuRouteList
}

// 清空缓存
// export const clearUserMenuAndPageListCatch = () => {
//   cacheUserMenuAndPageList.userMenuList = []
//   cacheUserMenuAndPageList.allRouterListByRole = []
// }

// 根据用户角色获取对应的菜单列表和可访问页面列表
export const getMenuListByUser = (userInfo = {}, reset = false) => {
  allRouterListByRole = []
  // 判断是否有用户信息
  // if (isEmpty(userInfo)) {
  //   clearUserMenuAndPageListCatch()
  //   return cacheUserMenuAndPageList
  // }

  // // 是否重置缓存数据
  // if (reset) {
  //   clearUserMenuAndPageListCatch()
  // }

  // 判断是否存在缓存数据
  if (
    !cacheUserMenuAndPageList.userMenuList.length &&
    !cacheUserMenuAndPageList.allRouterListByRole.length
  ) {
    // const { roleName = '', orgCode = '' } = userInfo
    const { orgCode = '' } = userInfo
    // 获取当前用户角色类型
    const userRoleType = '1'

    const processChildTree = (node, parentPath = '') => {
      const menuNode = createMenuItem(node, parentPath, userRoleType, orgCode)
      let processedChildren = []
      let { children = [], path = '' } = node
      if (children.length) {
        // 遍历子节点，递归处理每个子节点
        children.forEach(child => {
          const processedChild = processChildTree(child, path)
          if (processedChild.length > 0) {
            // 如果子节点满足条件，则添加到处理的子节点数组中
            processedChildren = processedChildren.concat(processedChild)
          }
        })
      } else {
        return menuNode ? [menuNode] : []
      }

      // 如果有值 说明是一个二级菜单列表
      if (menuNode) {
        // 将以及菜单也收集到用户可访问页面列表中，组装面包屑列表使用
        handleRouteByRole([menuNode])
        // 如果子节点满足条件且可以提升层级到与父节点相同，则将父节点和子节点作为一个树形结构返回
        return [
          {
            ...menuNode,
            children: handleRouteByRole(processedChildren).sort((a, b) =>
              a.order > b.order ? 1 : -1
            )
          }
        ]
      } else {
        // 如果子节点满足条件但不能提升层级，则将父节点和处理后的子节点拼接后返回
        return handleRouteByRole(processedChildren)
      }
    }
    // 根据角色获取权限菜单
    const processTrees = nodes => {
      let processedTrees = []
      nodes.forEach(node => {
        const rootNode = processChildTree(node, '')
        if (rootNode.length > 0) {
          // 如果根节点满足条件，则添加到处理的根节点数组中
          processedTrees = [...processedTrees, ...rootNode]
        }
      })
      // 对结果数组进行排序
      return processedTrees.sort((a, b) => (a.order > b.order ? 1 : -1))
    }

    const userMenuList = processTrees(routes)
    // 存储数据
    cacheUserMenuAndPageList.userMenuList = cloneDeep(userMenuList)
    cacheUserMenuAndPageList.allRouterListByRole = cloneDeep(allRouterListByRole)
    store.commit('d2admin/menu/asideSet', cacheUserMenuAndPageList.userMenuList)
  }
  console.log('用户路由权限', routes, cacheUserMenuAndPageList)
  return cacheUserMenuAndPageList
}

// 根据当前路由获取面包屑数据
export const getCrumbsList = (nowRouteInfo, fromRouteInfo, pageAllListByUserRole) => {
  let result = []
  let {
    fullPath: sorFullPath = '',
    path: sorPath = '',
    name: sorName = '',
    meta: sorMeta = {},
    query: sorQuery = {},
    params: sorParams = {}
  } = nowRouteInfo

  let { parentName = '', crumbsList = [] } = sorMeta
  if (parentName) {
    // 如果配置了 noClick 当前面包屑没有path属性 不可点击
    let sorCrumb = {
      path: sorFullPath || sorPath,
      name: sorName,
      meta: sorMeta,
      query: sorQuery,
      params: sorParams,
      title: sorMeta.title || ''
    }
    if (sorMeta.noClick) {
      delete sorCrumb.path
    }
    result.push(sorCrumb)

    // 从可访问页面列表中读取对应的面包屑数据
    let flag = true
    while (flag) {
      let routerInfo = result[0]
      let {
        meta: { parentName: firstParentName = '' }
      } = routerInfo
      if (firstParentName) {
        let findRes = ''
        // 如果是已经打开的页面  并且已经有面包屑数据
        if (crumbsList && crumbsList.length > 0) {
          findRes = crumbsList.find(item => {
            let { name = '' } = item
            return firstParentName === name
          })
        }
        // 如果已经打开页面的面包屑数据中找不到 就从可访问页面列表中再查一次
        if (!findRes) {
          findRes = pageAllListByUserRole.find(item => {
            let { name = '' } = item
            return firstParentName === name
          })
        }
        // 如果能查到对应的路由
        if (findRes) {
          let copyFindRes = cloneDeep(findRes)
          // 判断如果from路由和面包屑上级路由是同一个，采用from的路由信息
          if (fromRouteInfo.name === copyFindRes.name) {
            copyFindRes.path = fromRouteInfo.path
          }
          copyFindRes.title = copyFindRes.meta.title || ''
          // 面包屑不可点击
          if (copyFindRes.meta && copyFindRes.meta.noClick) {
            delete copyFindRes.path
          }
          result.unshift(copyFindRes)
        } else {
          flag = false
        }
      } else {
        flag = false
      }
    }
  }
  return result
}

// 判断当前要打开的页面是否有权限访问
export const checkAccess = (to, pageAllListByUserRole) => {
  let isRole = false
  if (pageAllListByUserRole.length) {
    isRole = pageAllListByUserRole.findIndex(item => item.name === to.name) !== -1
  }
  return isRole
}
