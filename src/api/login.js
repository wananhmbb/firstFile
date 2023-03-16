import Vue from "vue"
let VuePro = Vue.prototype
// const client_id = "ruoyi"
// const client_secret = "123456"
// const scope = "server"
// 用户登录
import store from "@/store"

export function loginUserOrWork(params, options = {}) {
  return VuePro.$http.get({
    url: "/auth/oauth/token",
    isNeedAccessToken: false,
    params: Object.assign(params, store.state.user.SpecialParamsSomeRequestsObj)
  })
}

// 获取用户信息
export function getUserInfo(data) {
  return VuePro.$http.get({
    url: "/front/front/userInfo/" + data
  })
}

// 刷新token 需要更高接口地址以及参数

export function refreshAccessToken(params, options) {
  console.log(store.state.user.SpecialParamsSomeRequestsObj)
  store.commit("SET_SPECIAL_PARAMS_SOME_REQUEST_TO_GRANT_TYPE", "refresh_token")
  return VuePro.$http.post({
    url: "/auth/oauth/token",
    params: Object.assign(
      params,
      store.state.user.SpecialParamsSomeRequestsObj
    ),

    options
  })
}
// 退出登录

// export function loginOut(params, options) {
//   return VuePro.$http.get({
//     url: "/weixin/getUserInfo2",
//     params,
//     options
//   })
// }
// 获取验证码
export function getCodeImg() {
  return VuePro.$http.get({
    url: "/code",
    isNeedAccessToken: false
  })
}

// 微信一键登录
export function wechatLogin(params, options) {
  return VuePro.$http.get({
    url: "/auth/token/AES",
    params,
    options,
    isNeedAccessToken: false
  })
}
//微信一键登录获取用户信息
export function wechatGetInfo(params) {
  return VuePro.$http.get({
    url: "/front/front/user",
    isNeedAccessToken: false,
    params
  })
}
// 微信的一键登录传到后台的信息

export function WXCopyInfoToService(data) {
  return VuePro.$http.post({
    url: "/auth/token/third/user",
    data,
    isNeedAccessToken: false
  })
}
// 获取openid， 以及是不是第一次登录
export function hadRegister(code) {
  return VuePro.$http.get({
    url: "/auth/token/third/hadRegister/" + code,
    isNeedAccessToken: false
  })
}
// 检查用户是否已经登录

export function checkPhoneIsExist(identifier) {
  return VuePro.$http.get({
    url: "/auth/token/checkPhoneIsExist/" + identifier,
    isNeedAccessToken: false
  })
}
// 切换团队
export function changeTeam(teamId) {
  return VuePro.$http.put({
    url: "/front/front/changeTeam/" + teamId
  })
}
// 获取所有团队
export function getAllTeamList() {
  return VuePro.$http.get({
    url: "/mall/team/teamList",
    isNeedAccessToken: false,
    isNeedTenantId: false
  })
}

// 获取租户list
export function getTenantList() {
  return VuePro.$http.get({
    url: "/system/user/tenant/activeList",
    isNeedAccessToken: false
  })
}

export function getAccessPrivacyPolicyApi () {
  return VuePro.$http.get({
    url: "https://dailydev.oss-cn-chengdu.aliyuncs.com/416/doc/%E9%9A%90%E7%A7%81.html",
    isNeedAccessToken: false
  })
}