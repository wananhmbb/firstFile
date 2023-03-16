let skin = "default" //default默认主题
let message = false
let tenantId = "0"
let locaMessage = uni.getStorageSync("doctorMessage")
let localSkin = uni.getStorageSync("theme")
let localtenantId = uni.getStorageSync("tenantId")
const theme = {
  state: {
    skin: localSkin ? localSkin : skin,
    mescrollUniHeight: "",
    message: locaMessage ? locaMessage : message,
    tenantId: localtenantId ? localtenantId : tenantId
  },
  mutations: {
    // 皮肤更换
    skinPeeler(state, skin = []) {
      state.skin = skin
      uni.setStorageSync("theme", state.skin)
    },
    SET_MESCROLL_UNI_HEIGHT(state, data) {
      state.mescrollUniHeight = data
    },
    // 获取医生消息
    getMessage(state, message = []) {
      state.message = message
      uni.setStorageSync("doctorMessage", state.message)
    },
    // 获取租户id
    getenants(state, tenantId = []) {
      state.tenantId = tenantId
      uni.setStorageSync("tenantId", state.tenantId)
    }
  }
}

export default theme
