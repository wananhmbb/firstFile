const fs = require("fs")
console.log(process.env.NODE_ENV)
// 环境修改 appid
let appid =
  process.env.NODE_ENV === "production"
    ? "wx96c656139e5a62d8"
    : "wxc9d9d42f0b21403a"
console.log(appid)
// manifest.json 路径
let manifestFileUrl = `${__dirname}/src/manifest.json`
// 读取文件数据
let manifestFileData = fs.readFileSync(manifestFileUrl, { encoding: "utf8" })
// 移除注释
manifestFileData = manifestFileData.replace(/\/\*[\s\S]*?\*\//g, "")
// 将txt转成obj
let manifestFileDataObj = JSON.parse(manifestFileData)
// 修改指定key对应的value
manifestFileDataObj["mp-weixin"]["appid"] = appid
// 写入文件
fs.writeFileSync(manifestFileUrl, JSON.stringify(manifestFileDataObj), {
  encoding: "utf8"
})
