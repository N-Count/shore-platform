import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

const meta = { auth: true }

// 基金优选
export default {
  path: '/report',
  name: 'report',
  meta: {
    ...meta,
    iconClass: 'icon-xinjijinbaogao',
    title: '上传研报',
    miniTitle: '上传研报',
    isMenu: true,
    order: 4
  },
  redirect: { name: 'report-upload' },
  component: layoutHeaderAside,
  children: (pre => [
    // 优选工具
    {
      path: 'report-upload',
      name: `${pre}upload`,
      component: _import('business/rep-upload'),
      meta: { ...meta, title: '上传研报', cache: true, isMenu: true, order: 1 }
    }
  ])('report-')
}
