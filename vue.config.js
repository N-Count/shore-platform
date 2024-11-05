const CompressionWebpackPlugin = require('compression-webpack-plugin')
const VueFilenameInjector = require('@d2-projects/vue-filename-injector')
const ThemeColorReplacer = require('webpack-theme-color-replacer')
const forElementUI = require('webpack-theme-color-replacer/forElementUI')
const TerserPlugin = require('terser-webpack-plugin')
const cdnDependencies = require('./dependencies-cdn')
// dll配置
const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')

// 拼接路径
const resolve = dir => require('path').join(__dirname, dir)

// 增加环境变量
process.env.VUE_APP_VERSION = require('./package.json').version
process.env.VUE_APP_BUILD_TIME = require('dayjs')().format('YYYY-M-D HH:mm:ss')

// 基础路径 注意发布之前要先修改这里
let publicPath = process.env.VUE_APP_PUBLIC_PATH || '/'

// 设置不参与构建的库
let externals = {}
cdnDependencies.forEach(pack => {
  externals[pack.name] = pack.library
})

// 引入文件的 cdn 链接
const cdn = {
  css: cdnDependencies.map(e => e.css).filter(e => e),
  js: cdnDependencies.map(e => e.js).filter(e => e)
}

const files = fs.readdirSync(resolve('./public/vendor'))
// 用于存储DllReferencePlugin插件的配置，只能引入对象
const dllReferenceFiles = []
// 用于存储AddAssetHtmlPlugin插件的配置，
const htmlAssetFiles = []
files.forEach(file => {
  // 匹配js引入
  if (/.*\.js$/.test(file)) {
    htmlAssetFiles.push({
      filepath: path.resolve(__dirname, './public/vendor', file),
      outputPath: './vendor',
      publicPath: './vendor'
    })
  }
  // 匹配manifest.json
  if (/.*\.json$/.test(file)) {
    dllReferenceFiles.push({
      manifest: path.resolve(__dirname, './public/vendor', file),
      context: __dirname
    })
  }
})
const dllReference = config => {
  config.plugin('vendorDll').use(webpack.DllReferencePlugin, dllReferenceFiles)
  config.plugin('addAssetHtml').use(AddAssetHtmlPlugin, [htmlAssetFiles]).after('html')
}

// 前端代理转发
let proxyTable = {}
// 各个环境地址更新,
const gateway = {
  // new_dev: 'http://10.106.100.53:30301/frp-gateway',
  new_dev: 'http://192.168.8.11:8081',
  new_test: 'http://sp1477.jgy-cloudscape-platform.test.jiyujgt.com/frp-gateway',
}

// 如果有多个后端api，修改paths
const paths = ['api']

// 参考：https://webpack.js.org/configuration/dev-server/#devserverproxy
Object.keys(gateway).forEach(env => {
  paths.forEach(path => {
    // const key = `^/${env}`
    if (path !== '') {
      proxyTable[`/${env}/${path}`] = {
        target: `${gateway[env]}`,
        logLevel: 'debug',
        changeOrigin: true,
        pathRewrite: {}
      }
    } else {
      proxyTable[`/${env}/`] = {
        target: `${gateway[env]}`,
        logLevel: 'debug',
        changeOrigin: true,
        pathRewrite: {}
      }
    }
    proxyTable[`/${env}/${path}`]['pathRewrite'][`^/${env}`] = ''
    // 生产环境
    if (env === 'prod') {
      proxyTable[`/${env}/${path}`]['secure'] = false
      proxyTable[`/${env}/${path}`]['changeOrigin'] = true
      let replaceKey = `${path}/`
      if (path === '') {
        replaceKey = `account/`
      }
      proxyTable[`/${env}/${path}`]['target'] = proxyTable[`/${env}/${path}`]['target'].replace(
        replaceKey,
        ''
      )
    }
  })
})

if (process.env.NODE_ENV === 'development') {
  console.log('proxy table', proxyTable)
}

module.exports = {
  // 根据你的实际情况更改这里
  publicPath,
  lintOnSave: true,
  // devServer: {
  //   publicPath // 和 publicPath 保持一致
  // },
  devServer: {
    publicPath, // 和 publicPath 保持一致
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 8080,
    https: false,
    hotOnly: false,
    // 查阅 https://github.com/vuejs/vue-docs-zh-cn/blob/master/vue-cli/cli-service.md#配置代理
    proxy: 'http://192.168.8.11:8081',
    before: app => {}
  },
  css: {
    loaderOptions: {
      // 设置 scss 公用变量文件
      sass: {
        prependData: `@import '~@/assets/style/public.scss';`
      }
    }
  },
  configureWebpack: config => {
    const configNew = {}
    if (process.env.NODE_ENV === 'production') {
      configNew.externals = externals
      configNew.plugins = [
        // gzip
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
          threshold: 10240,
          minRatio: 0.8,
          deleteOriginalAssets: false
        })
      ]
      configNew.optimization = {
        splitChunks: {
          chunks: 'async',
          minSize: 30000,
          maxSize: 5000,
          minChunks: 1,
          maxAsyncRequests: 5,
          maxInitialRequests: 2,
          automaticNameDelimiter: '~',
          name: true,
          cacheGroups: {
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true
            }
          }
        },
        // 删除console.log
        minimizer: [
          new TerserPlugin({
            // 采用多进程打包
            parallel: 4,
            terserOptions: {
              compress: {
                // 去除debug、console
                warnings: true,
                drop_debugger: true,
                // drop_console: true
                pure_funcs: ['console.log', 'console.info']
              }
            }
          })
        ]
      }
    }
    if (process.env.NODE_ENV === 'development') {
      // 关闭 host check，方便使用 ngrok 之类的内网转发工具
      configNew.devServer = {
        disableHostCheck: true
      }
    }
    return configNew
  },
  // 默认设置: https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-service/lib/config/base.js
  chainWebpack: config => {
    // dll配置
    dllReference(config)
    /**
     * 添加 CDN 参数到 htmlWebpackPlugin 配置中
     */
    config.plugin('html').tap(args => {
      if (process.env.NODE_ENV === 'production') {
        args[0].cdn = cdn
      } else {
        args[0].cdn = []
      }
      return args
    })
    /**
     * 删除懒加载模块的 prefetch preload，降低带宽压力
     * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#prefetch
     * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#preload
     * 而且预渲染时生成的 prefetch 标签是 modern 版本的，低版本浏览器是不需要的
     */
    config.plugins.delete('prefetch').delete('preload')
    // 解决 cli3 热更新失效 https://github.com/vuejs/vue-cli/issues/1559
    config.resolve.symlinks(true)
    config.plugin('theme-color-replacer').use(ThemeColorReplacer, [
      {
        fileName: 'css/theme-colors.[contenthash:8].css',
        matchColors: [
          ...forElementUI.getElementUISeries(process.env.VUE_APP_ELEMENT_COLOR) // Element-ui主色系列
        ],
        externalCssFiles: ['./node_modules/element-ui/lib/theme-chalk/index.css'], // optional, String or string array. Set external css files (such as cdn css) to extract colors.
        changeSelector: forElementUI.changeSelector
      }
    ])
    config
      // 开发环境 sourcemap 不包含列信息
      .when(process.env.NODE_ENV === 'development', config => config.devtool('cheap-source-map'))
      // 预览环境构建 vue-loader 添加 filename
      .when(process.env.VUE_APP_SCOURCE_LINK === 'TRUE', config =>
        VueFilenameInjector(config, {
          propName: process.env.VUE_APP_SOURCE_VIEWER_PROP_NAME
        })
      )
    // markdown
    config.module.rule('md').test(/\.md$/).use('text-loader').loader('text-loader').end()
    // svg
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule.include
      .add(resolve('src/assets/svg-icons/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'd2-[name]'
      })
      .end()
    // image exclude
    const imagesRule = config.module.rule('images')
    imagesRule
      .test(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/)
      .exclude.add(resolve('src/assets/svg-icons/icons'))
      .end()
    // 重新设置 alias
    config.resolve.alias
      .set('@api', resolve('src/api'))
      .set('@module', resolve('src/views/components'))
      .set('@bus', resolve('src/views/business/components'))
    // 分析工具
    if (process.env.npm_config_report) {
      config
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    }
    // 格式化工具
    config.module
      .rule('eslint')
      .use('eslint-loader')
      .loader('eslint-loader')
      .tap(options => {
        options.fix = true
        return options
      })
  },
  // 不输出 map 文件
  productionSourceMap: false,
  // i18n
  pluginOptions: {
    i18n: {
      locale: 'zh-chs',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true
    }
  }
}
