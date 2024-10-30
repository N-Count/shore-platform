/**
 * @description 创建菜单
 * @param {Function} h createElement
 * @param {Object} menu 菜单项
 * @param {boolean} isFold 折叠flag
 */
export function elMenuItem (h, menu, isFold) {
  let icon = null
  if (menu.iconClass) icon = <i class={ `${menu.iconClass}` }/>
  // else if (menu.iconSvg) icon = <d2-icon-svg name={ menu.iconSvg }/>
  // else icon = <i class="fa fa-file-o"/>
  return <el-menu-item
    class={`${isFold ? 'fold-menu-item' : isFold === undefined ? '' : 'main-title-item'}`}
    style={`${isFold === undefined ? 'paddingLeft: 42px' : ''}`}
    key={ menu.path }
    index={ menu.path }>
    { icon }
    <span>{ menu.title || '未命名菜单' }</span>
    {isFold && <span class='fold-menu-title'>{ menu.miniTitle || '未命名菜单' }</span>}
  </el-menu-item>
}

/**
 * @description 创建子菜单
 * @param {Function} h createElement
 * @param {Object} menu 菜单项
 * @param {boolean} isFold 折叠flag
 */
export function elSubmenu (h, menu, isFold) {
  let icon = null
  if (menu.iconClass) icon = <i slot="title" class={ `iconfont icon-${menu.iconClass}` }/>
  // else if (menu.iconSvg) icon = <d2-icon-svg slot="title" name={ menu.iconSvg }/>
  // else icon = <i slot="title" class="fa fa-folder-o"/>
  return <el-submenu
    class={`${isFold ? 'fold-menu-item' : ''}`}
    key={ menu.path }
    index={ menu.path }>
    { icon }
    <span slot="title">{ menu.title || '未命名菜单' }</span>
    {isFold && <span class='fold-menu-title' slot="title">{ menu.miniTitle || '未命名菜单' }</span>}
    { menu.children.map(child => createMenu.call(this, h, child)) }
  </el-submenu>
}

/**
 * @description 在组件中调用此方法渲染菜单项目
 * @param {Function} h createElement
 * @param {Object} menu 菜单项
 * @param {boolean} isFold 折叠flag
 */
export function createMenu (h, menu, isFold) {
  if (menu.children === undefined) return elMenuItem.call(this, h, menu, isFold)
  return elSubmenu.call(this, h, menu, isFold)
}
