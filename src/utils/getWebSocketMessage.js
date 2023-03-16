//获取医生端消息
import { ACCESS_TOKEN } from "@/const/storage-key"
import store from "../store/index"

export function setWebSocketIp() {
	let apiIp = process.env.VUE_APP_BASE_API_IP.replace(/(http)s?/, "wss")
  if (apiIp.includes("weixin-api")) {
    apiIp = apiIp.replace("weixin-api", "weixin2-websocket-api")
  } else if (apiIp.includes("weixin2-demo-api")) {
    apiIp = apiIp.replace("weixin2-demo-api", "weixin2-demo-websocket-api")
  } else if (apiIp.includes("hjt/")) {
    apiIp = apiIp.replace("hjt/", "hjt-websocket/")
  }
  return apiIp
}

export function getDoctorMessage(isConsult) {
  let apiIp = setWebSocketIp()
  let webSocketurl =
    apiIp +
    "product/websocket/userMessage?access_token=" +
    uni.getStorageSync(ACCESS_TOKEN)
  var socketOpen = false
  var content = JSON.stringify({
    type: "user_in_consult_page",
    data: { data: isConsult }
  })
  uni.connectSocket({
    url: webSocketurl
  })
  uni.onSocketOpen(function (res) {
    console.log(res, "WebSocket连接已打开！")
    socketOpen = true
    sendSocketMessage(content)
  })
  uni.onSocketMessage(function (res) {
    console.log("收到服务器内容：" + res.data)
    if (res.data !== "连接成功") {
      var haveDoctorMessage = JSON.parse(res.data).data.type
      if (haveDoctorMessage === "has_doctor_message") {
        let message = true
        store.commit("getMessage", message)
      }
      // if (haveDoctorMessage === "send_message") {
      //   let message = true
      //   store.commit("getMessage", message)
      // }
    }
  })
  function sendSocketMessage(msg) {
    if (socketOpen) {
      console.log(msg, "发送消息")
      uni.sendSocketMessage({
        data: msg
      })
    }
  }
}
