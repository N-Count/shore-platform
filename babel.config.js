module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  // 允许两种编码引入方式共存,也就是 common 规范与 es6 规范的共存处理
  sourceType: 'unambiguous',
  plugins: [
    '@babel/plugin-proposal-nullish-coalescing-operator', // 双问号
    '@babel/plugin-proposal-optional-chaining' // 可选链
  ]
}
