
// const productPlugins = []

//判断是开发还是发布阶段
// if (process.env.NODE_ENV === 'production') {
//   //发布阶段
//   productPlugins.push("transform-remove-console")
// }

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ]
  // plugins: [
  //   //配置路由懒加载插件
  //   '@babel/plugin-syntax-dynamic-import'
  // ]
}