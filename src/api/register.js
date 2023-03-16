import Vue from "vue"
let VuePro = Vue.prototype
// 用户注册
export function register(data, options = {}) {
  return VuePro.$http.post({
    url: "/auth/token/register",
    data,
    options,
    isNeedAccessToken: false
  })
}
// 验证码发送

export function SendVerificationCode(data, options = {}) {
  return VuePro.$http.post({
    url: "/auth/token/sendVerificationCode",
    data,
    options,
    isNeedAccessToken: false
  })
}
// 验证码校验

export function codeVerification(data, options = {}) {
  return VuePro.$http.post({
    url: "/auth/token/check",
    data,
    options,
    isNeedAccessToken: false
  })
}
