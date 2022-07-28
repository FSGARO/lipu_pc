
// const path = require("path");

const port = process.env.port || process.env.npm_config_port || 9090 // 端口

module.exports = {

    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',

    outputDir: 'dist', //打包后的文件名

    assetsDir: 'static', //静态资源文件

    lintOnSave: false, // 是否开启eslint保存检测

    runtimeCompiler: true, //ture: runtime-compiler  false: runtime-only
    
    productionSourceMap: false, // 如果你不需要生产环境的source map, 以加速生产环境构建。

    // configureWebpack: {
    //   resolve: {
    //     alias: {
    //       'vue$': 'vue/dist/vue.esm.js' // vue.esm.js、vue.common.js
    //     }
    //   }
    // }
    devServer:{
        hotOnly:false
    }

    // devServer: {//代理，跨域设置
    //     // host: "0.0.0.0",
    //     port: port,
    //     proxy: {
    //     [process.env.VUE_APP_BASE_API]: {
    //         target: `http://192.168.0.87:20080`, // 开发环境
    //         //target: `https://dewx.pyhome.com/employment`, // 正式环境
    //         changeOrigin: true,
    //         pathRewrite: {
    //         ["^" + process.env.VUE_APP_BASE_API]: "",
    //         },
    //     },
    //     },
    //     disableHostCheck: true,
    // },

    // css: {
    //     loaderOptions: {
    //       // 这里的选项会传递给 saas-loader
    //       // 引入全局scss-只能引入变量和mixin,引入公用class样式会导致重复加载样式
    //       sass: {
    //         prependData: `@import "@/assets/style/variable.scss";`,
    //       },
    //     }
    // },

}
