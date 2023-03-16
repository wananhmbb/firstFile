// const scssVariables = require("./src/theme/theme.scss.js")
const TransformPages = require("uni-read-pages")
// const CompressionWebpackPlugin = require("compression-webpack-plugin")
const { webpack } = new TransformPages()
module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        ROUTES: webpack.DefinePlugin.runtimeValue(() => {
          const tfPages = new TransformPages({
            includes: ["path", "name", "aliasPath"]
          })
          return JSON.stringify(tfPages.routes)
        }, true)
      })
      // new CompressionWebpackPlugin({
      //   filename: "[path][base].gz",
      //   algorithm: "gzip",
      //   test: /\.js$/,
      //   threshold: 10240,
      //   minRatio: 0.8,
      //   exclude: /node_modules/
      // })
    ]
  },
  // css: {
  //   loaderOptions: {
  //     scss: {
  //       data: Object.keys(scssVariables)
  //         .map(k => `\$${k.replace("_", "-")}: ${scssVariables[k]};`)
  //         .join("\n")
  //     }
  //   }
  // },
  /* webpack-dev-server 相关配置 */
  devServer: {
    /* 自动打开浏览器 */
    open: true,
    port: 80,
    https: false,
    hotOnly: false,
    /* 使用代理 */
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        /* 目标代理服务器地址 */
        // target: "https://wxdev.techgather.net:38787/",
        target: "http://wxdev.techgather.net:38080", //小虎 http://172.20.20.28:38080  ypc http://172.20.20.45:38080  //线上地址 'http://1.14.26.92:38080'
        /* 允许跨域 */
        changeOrigin: true,
        logLevel: "debug",
        pathRewrite: {
          ["^" + process.env.VUE_APP_BASE_API]: ""
        }
      }
    }
  }
}
